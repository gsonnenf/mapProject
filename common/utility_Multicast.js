/**
 * Created by Greg on 5/7/2016.
 */

import "./utility"

////*************** Event System *************************************
Utility.MulticastEvent = class MutlicastEvent {
    constructor() {
        var array = [];
        var multicastEvent = function multicastEvent() { for (let index in array) array[index].apply(this,arguments); };
        Object.setPrototypeOf(multicastEvent, MutlicastEvent.prototype);
        multicastEvent.array = array;
        return multicastEvent;
    }

    push(eventCallback) {
        if (typeof(eventCallback) != "function")
            Utility.throwErrorMessage({title: "Event Callback Error", message:"Only functions can be added to event callback list."});
        this.array.push(eventCallback);
    }

    callEvents() {
        for (let index in this.array) this.array[index].apply(this,arguments);
    }
};

Utility.MulticastFunction = Utility.MulticastEvent;



