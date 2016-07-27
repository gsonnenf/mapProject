/**
 * Created by Greg on 6/26/2016.
 */

import {Aspect} from "/common/lib/chimerapatterns"

migrationList = [];

Migration = class Migration {
    constructor({version,up,down,identifierString, description = null}){
        if (typeof up != "function") throw new Error("Up must be function.");
        if (typeof down != "function") throw new Error("Down must be function.");
        if (typeof identifierString != "string") throw new Error("Name must be a string.");
        if ( description != null && typeof description != "string") throw new Error("Description must be a string.");

        Object.defineProperty( this, 'identifierString',{ value: identifierString, configurable: false, writable:false });
        Object.defineProperty( this, 'version',{ value: version, configurable: false, writable:false });
        Object.defineProperty( this, 'description', { value: description, configurable: false, writable:false  });
        Object.defineProperty( this, 'up', { value: up, configurable: false, writable:false  });
        Object.defineProperty( this, 'down', { value: down, configurable: false, writable:false });
    }
};

MigrationManager = class MigrationManager {
    constructor() {
        this.collection = new Mongo.Collection('migrations');
        this._migrationList = [];
        this._isDisabled = false;

        Aspect.onMethodDecorator(this, 'migrateToHighestVersion', this._aspectTryDisableFail);
        Aspect.onMethodDecorator(this, 'migrateToVersion', this._aspectTryDisableFail);
        Aspect.onMethodDecorator(this, 'applyNext', this._aspectTryDisableFail);
        Aspect.onMethodDecorator(this, 'undoPrev', this._aspectTryDisableFail);
        Aspect.onMethodDecorator(this, 'addMigration', this._aspectTryDisableFail);


        // File system, get content of imports/migrations and load them.
        require('/imports/migrations/2_addstatesdata.js');
    }

    getCurrentVersion() {
        var recent = this.collection.findOne({sequential:true, completed: true}, {sort: {modifiedAt: -1, limit: 1}});
        if (recent == null) return 0;
        if (recent.action != 'Undo') return recent;
        var recentApply = this.collection.findOne(
            { sequential:true, completed: true, action: 'Apply', version: {$lt: recent.version}  },
            { sort: {modifiedAt: -1, limit: 1}}
        );
        return recentApply;
    }

    getMigrationRecords() {
        return this.collection.find({}, {sort: {createdAt: 1}} ).fetch();
    }

    getHighestVersion() {
        var highestVersion = 0;
        this._migrationList.forEach((element) => { if (highestVersion < element.version) highestVersion = element.version });
        return highestVersion;
    }

    addMigration( migration ) {
        if (typeof migration.version != "number") throw new Error("Migration version must be a number");
        if (migration.version < 1) throw new Error("Migration version must be a positive.");
        if (migration.version % 1 != 0) throw new Error("Migration version must be an integer.");
        if ( !(migration instanceof Migration) ) throw new Error("Argument must be an instance of Migration class.");
        if ( this._migrationList[migration.version] ) throw new Error("Multiple migrations assigned to same version number. ");
        this._migrationList[migration.version] = migration;
    }

    migrateToHighestVersion() {
        var currentVersion = this.getCurrentVersion();
        // forEach iterates in array order, index = version so array is sorted.
        this._migrationList.forEach((migration)=> {if (migration.version > currentVersion) this._applyMigration(migration, true);});
    }

    migrateToVersion( version ) {
        var currentVersion = this.getCurrentVersion();
        if ( version > currentVersion )
            this._migrationList.forEach((migration) => {
                if (migration.version > currentVersion && migration.version <= version ) this._applyMigration(migration, true);
            });

        else if (version < currentVersion) {
            var reverseMigrationList = [];
            this._migrationList.forEach((migration) => {
                if (migration.version <= currentVersion && migration.version > version ) reverseMigrationList.unshift( migration);
            });
            reverseMigrationList.forEach( (migration) => { if (migration) migration._undoMigration(migration, true); });
        }
    }

    undoPrev(){
        var currentVersion = this.getCurrentVersion();
        var migration;
        this._migrationList.forEach( (element) => {
            if (element.version < currentVersion) {
                if (!migration) migration = element;
                if (element.version > migration.version) migration = element;
            }
        });
        this._undoMigration(migration, true);
        return migration.version;
    }

    applyNext(){
            var currentVersion = this.getCurrentVersion();
            var migration;
            this._migrationList.forEach( (element) => {
                if (element.version > currentVersion) {
                    if (!migration) migration = element;
                    if (element.version < migration.version) migration = element;
                }
            });
            this._applyMigration(migration, true);
        return migration.version;
    }

    applyCustom( migration ) {
        if (!migration) throw new Error("Migration is not valid.");
        if ( !(migration instanceof Migration) ) throw new Error("Argument must be an instance of Migration class.");
        this._applyMigration(migration, false );
    }

    undoCustom( migration ) {
        if (!migration) throw new Error("Migration is not valid.");
        if ( !(migration instanceof Migration) ) throw new Error("Argument must be an instance of Migration class.");
        this._undoMigration(migration, false );
    }



    /* Internal methods *****************************************************************************/

    _applyMigration( migration, sequential ) {
        var recordKey = Random.id();
        var _id = this._recordStart( recordKey, migration, 'Apply', sequential );

        try {
            migration.up();
            this._recordEnd( recordKey,migration );
        } catch (error) {
            this._recordEnd( recordKey, migration, error);
            throw error;
        }
    }

    _undoMigration( migration, sequential ) {
        var recordKey = Random.id();
        var _id = this._recordStart( recordKey, migration, 'Undo', sequential );
        try {
            migration.down();
            this._recordEnd( recordKey, migration);
        } catch (error) {
            this._recordEnd( recordKey, migration, error);
            throw error;
        }
    }

    /*DB Logs *****************************************************************************/
    _recordStart( recordKey, migration, action, sequential ) {
        var _id = this.collection.insert({
            recordKey:recordKey,
            version: migration.version,
            identifierString: migration.identifierString,
            description: migration.description,
            createdAt: Date.now(),
            sequential: sequential,
            action: action,
            completed: false
        });
    }

    _recordEnd( recordKey, migration, error ){
        if (typeof error === "undefined") {
            this.collection.update({recordKey: recordKey}, {$set: {completed:true, modifiedAt: Date.now() }});
        }
        else {
            this.collection.insert({
                recordKey:recordKey,
                version: migration.version,
                identifierString: migration.identifierString,
                createdAt: Date.now(),
                state: "Error",
                errorMessage: error.toString()
            });
            throw error;
        }
    }

    _disabledCheck() {
        if (this._isDisabled) throw new Error('Error building migration table. Fix errors before using migration.');
    }

    _aspectDisableFail(callback, args) {
        this._disabledCheck();
        this._isDisabled = true;
        callback.apply(this,args);
        this._isDisabled = false;
    }

    _aspectTryDisableFail(callback, args) {
        console.log("aspect called");
        this._disabledCheck();
        this._isDisabled = true;
        try {
            callback.apply(this,args);
            this._isDisabled = false;
        } catch (error) {
            console.log("WARNING: Error encountered in migration. Migration canceled.");
            throw error;
        }
    };

};

/*
m = new MigrationManager();

migrationList.forEach( (element) => {
    m.addMigration(element);
});
*/