/**
 * Created by Greg on 5/21/2016.
 */

SubscriptionReady = class SubscriptionReady {
    constructor() {
        this.counter = 0;
        this.subscriptionList = [];
        this.subscriptionReadyEvents = [];
        this.onAllSubscriptionsReady = new Utility.MulticastEvent()
    }

    addCallbackOnReady( {callback, subscriptionNames} ) {
        var counter = 0;
        this.subscriptionReadyEvents.push(arguments);
        var event = () => { if (--counter == 0) callback(); };
        for (let name of subscriptionNames) {
            var subscriptionState = this.subscriptionList[name];
            if (!subscriptionState) throw new Error("subscription: " + name + " was not found.");
            if (subscriptionState.isReady) continue;
            subscriptionState.onReady.push( event );
            counter++;
        }
        if (counter == 0) callback();
    }

    isReady(name) {
        var subscriptionState = this.subscriptionList[name];
        if (!subscriptionState) throw new Error("subscription: " + name + " was not found.");
        return subscriptionState.isReady;

    }
    subscribe(name, args) {
        this.counter++;
        var subscriptionState = {
            name: name,
            isReady: false,
            onReady: new Utility.MulticastEvent()
        };

        this.subscriptionList[name] = subscriptionState;
        if (args) {
            if (args.onReady) {
                args.onReady = function () {
                    this.loaded(subscriptionState);
                    args.onReady.apply(this, arguments);
                };
            }
            else args.onReady = function () {
                this.loaded(subscriptionState);
            };
            Meteor.subscribe.apply(this, arguments);
        }
        else Meteor.subscribe(name, { onReady: ()=> { this.loaded(subscriptionState); } });
    }

    loaded( subscriptionState ) {
        Utility.debugMessage( subscriptionState.name, 0 );
        this.counter--;
        subscriptionState.isReady = true;
        subscriptionState.onReady();

        if (this.counter == 0) this.onAllSubscriptionsReady();
    }
};


