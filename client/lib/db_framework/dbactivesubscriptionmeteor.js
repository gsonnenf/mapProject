/**
 * Created by Greg on 6/5/2016.
 */

import {MulticastEvent} from "/common/lib/chimerapatterns"

export class DbActiveSubscriptionMeteor {
    constructor ({meteorCollection, publishName}) {
        this.meteorCollection = meteorCollection;
        this.publishName = publishName;

        //Events
        this.subHandle = null;
        this.observeHandle = null;
        this.cursor = null;

        //Events
        this.onAdded = new MulticastEvent();
        this.onChanged = new MulticastEvent();
        this.onRemoved = new MulticastEvent();

        this.onSubscriptionChanged = new MulticastEvent();
    }

    clearActiveDocuments() {
        if (this.observeHandle) this.observeHandle.stop();
        if (this.subHandle) this.subHandle.stop();
        this.observeHandle = null;
        this.subHandle = null;
        this.cursor = null;
    }

    setActiveDocuments( {params, callback} ) {
        this.clearActiveDocuments();
        if (params == null) return;

        var onReady = ()=> {
            this.cursor = this.meteorCollection.find();
            var observeHandle = this.cursor.observe({
                added: (document) => { if (observeHandle) this.onAdded.callEvent(document); },
                changed: (document) => { this.onChanged.callEvent(document); },
                removed: (document) => { this.onRemoved.callEvent(document); }
            });
            this.observeHandle = observeHandle;
            callback();
        };
        this.subHandle = Meteor.subscribe( this.publishName, params, {onReady: onReady} );
    }
    
    getAllDocuments() { return this.cursor.fetch(); }
    
};