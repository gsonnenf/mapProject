/**
 * Created by Greg on 6/4/2016.
 */


DbMeteor = class DbMeteor{
    constructor({meteorCollection, queryObject}) {
        this.meteorCollection = meteorCollection;
        this.cursor = this.meteorCollection.find(queryObject);

        this.onChanged = new Utility.MulticastEvent();
        this.onRemoved = new Utility.MulticastEvent();
        this.onAdded = new Utility.MulticastEvent();

        this.observeHandle = this.cursor.observe({
            added: (document) => { if (this.observeHandle) this.onChanged(document); },
            removed: (document) => { if (this.observeHandle) this.onRemoved(document); },
            changed: (document) => { if (this.observeHandle) this.onAdded(document); },
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