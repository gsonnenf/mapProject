/**
 * Created by Greg on 6/5/2016.
 */

DbActiveSubscriptionMeteor = class DbActiveSubscriptionMeteor{
    constructor ({meteorCollection, publishName}) {
        this.meteorCollection = meteorCollection;
        this.publishName = publishName;

        //Events
        this.observeHandle = null;
        this.subscriptionHandle=null;
        this.cursor = null;

        //Events
        this.onAdded = new Utility.MulticastEvent();
        this.onChanged = new Utility.MulticastEvent();
        this.onRemoved = new Utility.MulticastEvent();

        this.onSubscriptionChanged = new Utility.MulticastEvent();
    }

    clearActiveDocuments() {
        if (this.observeHandle) this.observeHandle.stop();
        if (this.subscriptionHandle) this.subscriptionHandle.stop();
        this.observeHandle = null;
        this.subscriptionHandle = null;
        this.cursor = null;
    }

    setActiveDocuments( {params, callback} ) {
        this.clearActiveDocuments();
        if (params == null) return;

        var onReady = ()=> {
            this.cursor = this.meteorCollection.find();
            
            var observeHandle = this.cursor.observe({
                added: (document) => { if (observeHandle) this.onAdded(document); },
                changed: (document) => { this.onChanged(document); },
                removed: (document) => { this.onRemoved(document); }
            });

            this.observeHandle = observeHandle;

            callback();
        };

        this.subscriptionHandle = Meteor.subscribe( this.publishName, params, {onReady: onReady} );
    }



    getAllDocuments() { return this.cursor.fetch(); }
    
};