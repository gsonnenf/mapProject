/**
 * Created by Greg on 6/4/2016.
 */

DbActiveElementMeteor = class DbActiveElementMeteor{
    constructor ({meteorCollection}) {
        this.meteorCollection = meteorCollection;
        this.activeCursor = null;
        this.observeHandle = null;

        this.onAdded = new Utility.MulticastEvent();
        this.onChanged = new Utility.MulticastEvent();
        this.onRemoved = new Utility.MulticastEvent();
    }

    setActiveElementById(id){ this.setActiveElement({_id: id}); }

    setActiveElements({ queryObject }) {
        if (this.observeHandle) this.observeHandle.stop();
        this.observeHandle = null;
        if (queryObject == null) return;
        this.activeCursor = this.meteorCollection.find( queryObject );
        this.observeHandle = this.activeCursor.observe({
            added: (document) => { this.onAdded.callEvents(document); },
            changed: (document) => { this.onChanged.callEvents(document); },
            removed: (document) => { this.onRemoved.callEvents(document); }
        });
    }

    fetchActiveElements() {
        return this.activeCursor.fetch();
    }

};