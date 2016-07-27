/**
 * Created by Greg on 6/4/2016.
 */
import {MulticastEvent} from "/common/lib/chimerapatterns"

export class DbActiveElementMeteor{
    constructor ({meteorCollection}) {
        this.meteorCollection = meteorCollection;
        this.activeCursor = null;
        this.observeHandle = null;

        this.onAdded = new MulticastEvent();
        this.onChanged = new MulticastEvent();
        this.onRemoved = new MulticastEvent();
    }

    setActiveElementById(id){ this.setActiveElements({_id: id}); }

    setActiveElements({ queryObject }) {
        if (this.observeHandle) this.observeHandle.stop();
        this.observeHandle = null;
        if (queryObject == null) return;
        this.activeCursor = this.meteorCollection.find( queryObject );
        this.observeHandle = this.activeCursor.observe({
            added: (document) => { this.onAdded.callEvent(document); },
            changed: (document) => { this.onChanged.callEvent(document); },
            removed: (document) => { this.onRemoved.callEvent(document); }
        });
    }

    fetchActiveElements() {
        return this.activeCursor.fetch();
    }
};