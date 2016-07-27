/**
 * Created by Greg on 5/21/2016.
 */

import {MulticastFunction} from "/common/lib/chimerapatterns"
import {Aspect} from "/common/lib/chimerapatterns"

 export class SubscriptionReady  {
    constructor() {
        this.subscriptionList = {};
        this.subscriptionReadyEvents = [];
    }

    subscribe(name, callbacks) {
        var subscriptionState = {
            name: name,
            isReady: false,
            onSubReady: new MulticastFunction()
        };

        var loaded = ()=> {
            subscriptionState.isReady = true;
            subscriptionState.onSubReady();
        };

        this.subscriptionList[name] = subscriptionState;

        //Attaches loaded event to Meteor subscribe onReady
        if (callbacks) {
            if (callbacks.onReady) Aspect.onMethodEntry(callbacks,'onReady', loaded );
            else callbacks.onReady = loaded;
            Meteor.subscribe.apply(this, arguments);
        }
        else Meteor.subscribe(name, { onReady: loaded });
    }

    addReadyCallback( {callback, subscriptionNames} ) {
        var counter = 0;
        this.subscriptionReadyEvents.push(arguments);
        var event = ()=> { if (--counter == 0) callback(); };
        for (let name of subscriptionNames) {
            var subscriptionState = this.subscriptionList[name];
            if (!subscriptionState) throw new Error("subscription: " + name + " was not found.");
            if (subscriptionState.isReady) continue;
            subscriptionState.onSubReady.push( event );
            counter++;
        }
        if (counter == 0) callback();
    }
}


