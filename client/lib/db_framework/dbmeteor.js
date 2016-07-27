/**
 * Created by Greg on 6/4/2016.
 */

import {MulticastEvent} from "/common/lib/chimerapatterns"

export class DbMeteor{
    constructor({meteorCollection, queryObject, optionObject}) {
        this.meteorCollection = meteorCollection;
        this.cursor = this.meteorCollection.find(queryObject,optionObject);

        this.onChanged = new MulticastEvent();
        this.onRemoved = new MulticastEvent();
        this.onAdded = new MulticastEvent();

        this.observeHandle = this.cursor.observe({
            added: (document) => { if (this.observeHandle) this.onChanged.callEvent(document); },
            removed: (document) => { if (this.observeHandle) this.onRemoved.callEvent(document); },
            changed: (document) => { if (this.observeHandle) this.onAdded.callEvent(document); },
        });
    }

    getAllDocuments() {
        return this.cursor.fetch();
    }

    fetchElementListByQuery( queryObject ) {
        return this.meteorCollection.find(queryObject).fetch();
    }

    fetchElementByQuery( queryObject ) {
        return this.meteorCollection.findOne( queryObject );
    }
    fetchElementById( id ) {
        var element = this.meteorCollection.findOne({_id: id});
        if (element == null || element == [])
            Utility.throwErrorMessage({title:"Element id: " + id + "not found in db: TODO" });
        return element;
    }




};