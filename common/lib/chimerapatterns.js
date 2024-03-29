/**
 * Created by Greg on 6/26/2016.
 *
 * Version 1.0.0
 *
 */
ChimeraPatterns = {};
ChimeraPatterns.Lock = {};
ChimeraPatterns.Lock.LockError = new Error("Property has been locked and cannot be set.");
ChimeraPatterns.Multicast = ( function() {

    class MulticastBase {
        constructor() {
            this._array = [];
        }

        push(eventCallback) {
            if (typeof(eventCallback) != "function") throw new Error("Only functions can be added to event callback list.");
            this._array.push(eventCallback);
        };

        callMethods( thisContext ) {
            var args = Array.from(arguments);
            args.shift();
            this._array.forEach( (callback) => { callback.apply( thisContext, args); })
        };

        lock(target,property) {
            Object.defineProperty(target, property, {
                configurable: true,
                get: ()=> {return this },
                set: ()=> {throw ChimeraPatterns.Lock.LockError }
            });
        };
    }

    MulticastBase.prototype.apply = Function.apply;
    MulticastBase.prototype.call = Function.call;
    MulticastBase.prototype.bind = Function.bind;

    
    class MulticastFunction extends MulticastBase {
        constructor() {
            super( );
            var array = this._array;
            var multicastFunction = function() { array.forEach((callback) => { callback.apply(this, arguments);  }); };
            multicastFunction._array = this._array;
            Object.setPrototypeOf(multicastFunction, MulticastFunction.prototype);
            return multicastFunction;
        }
    };

    class MulticastEvent extends MulticastBase {
        constructor(target, property, parameters) {
            super();
            var multicastEvent = (eventCallback) => { super.push(eventCallback) };
            multicastEvent._array = this._array;
            multicastEvent._target = target;
            multicastEvent._property = property;

            Object.setPrototypeOf(multicastEvent, MulticastEvent.prototype);
            return multicastEvent;
        }

        lock() {
            super.lock(this._target, this._property);
        }

        callEvent() {
            this._array.forEach((callback) => { callback.apply(this._target, arguments); })
        }
    };
    
    return {
        MulticastBase: MulticastBase,
        MulticastEvent: MulticastEvent,
        MulticastFunction: MulticastFunction
    };
})();

////*************** Aspect orientated code *************************************
ChimeraPatterns.Aspect = ( function() {

    //TODO: add proxy back in when it is supported in meteor.
    /*
     var aspectProxy = new Proxy(targetMethod, {
     apply: function (originalFunc, thisArg, argumentsList) {
     onMethodEntry.apply(thisArg, argumentsList);
     argumentsList.unshift(originalFunc.apply(thisArg, argumentsList));
     return onMethodExit.apply(thisArg, argumentsList);
     }
     });
     */
    
    return class Aspect {

        static onFuncEntry(func, aspectMethod) {
            if (!func.aspect) func = Aspect.createAspectProxy(func);
            func.aspect.onMethodEntry.push(aspectMethod);
            return func;
        }

        static onFuncExit(func, aspectMethod) {
            if (!func.aspect) func = Aspect.createAspectProxy(func);
            func.aspect.onMethodExit.push(aspectMethod);
            return func;
        }

        // onMethodEntry: aspectMethod( aspectMethodArgs ) { <before code>; }
        static onMethodEntry(target, property, aspectMethod) {
            Aspect.assignAspectProxy(target, property).aspect.onMethodEntry.push(aspectMethod);
        }

        // onMethodExit: aspectMethod( returnValue, ...aspectMethodArgs ) { <after code>; return returnValue; }
        static onMethodExit(target, property, aspectMethod) {
            Aspect.assignAspectProxy(target, property).aspect.onMethodExit.push(aspectMethod);
        }

        // onMethodDecorator: aspectMethod( coreMethod, arguments ) {
        //     <before code>; returnValue = coreMethod.apply( this, arguments ); <after code>; return returnValue;}
        static onMethodDecorator(target, property, aspectMethod) {
            var targetMethod = target[property];
            if (!targetMethod.aspect) { //if an aspect proxy isn't in place, just wrap the old function in the new one
                target[property] = function () {
                    return aspectMethod.apply(this, [targetMethod, arguments]);
                };
            }
            else { //if aspect proxy is in place, find the original method and wrap that instead.
                var coreMethod = targetMethod.aspect.coreMethod;
                targetMethod.aspect.coreMethod = function () {
                    return aspectMethod.apply(this, [coreMethod, arguments]);
                }
            }
        }

        static assignAspectProxy(target, property) {
            var targetMethod = target[property];
            if (targetMethod.aspect) return targetMethod;
            targetMethod = Aspect.createAspectProxy(targetMethod);
            target[property] = targetMethod;
            return targetMethod;
        }

        static createAspectProxy(targetMethod) {
            if (typeof(targetMethod) != "function") throw new Error("Only functions can be added to event callback list.");
            var onMethodEntry = new ChimeraPatterns.Multicast.MulticastFunction;
            var onMethodExit = new ChimeraPatterns.Multicast.MulticastFunction;

            var aspectProxy = function aspectProxyFunc() {
                var argumentsList = [...arguments];
                onMethodEntry.apply(this, argumentsList);
                var returnValue = aspectProxyFunc.aspect.coreMethod.apply(this, argumentsList);
                argumentsList.unshift(returnValue);
                onMethodExit.apply(this, argumentsList);
                return returnValue;
            };

            aspectProxy.aspect = {
                onMethodEntry: onMethodEntry,
                onMethodExit: onMethodExit,
                coreMethod: targetMethod
            };

            return aspectProxy;
        }
    };
})();

////*************** Observable patter code  **********************************************************************

//TODO: Fix observable list so objects can be garbage collected.
ChimeraPatterns.Observable = {};
ChimeraPatterns._Observable = {};
ChimeraPatterns._Observable.ObservableList = [];

ChimeraPatterns._Observable.bindOnChanged = function(parent, childName, onChanged ) {
    Object.defineProperty( parent, 'onChanged_' + childName , {
        get: function() {return onChanged},
        set: function() { console.log("Cannot 'set' onChanged observable. To add an event use .push(), to remove observer call Utility.removeObservable()")},
        configurable: true
    });
};

ChimeraPatterns.Observable.setObservable = function(parent, childName ){
    var variable = parent[childName];
    var onChanged = new ChimeraPatterns.Multicast.MulticastFunction(['variable','oldVariable']);
    ChimeraPatterns._Observable.ObservableList.push( {parent: parent, childName: childName, onChanged: onChanged} );
    ChimeraPatterns._Observable.bindOnChanged( parent, childName, onChanged );

    Object.defineProperty(parent, childName, {
        get: function() { return variable; },
        set: function(value) {
            var oldVariable = variable;
            variable = value;
            onChanged( variable, oldVariable );
        }, configurable: true
    });
    return onChanged;
};

ChimeraPatterns.Observable.removeObservable = function(parent, childName) {
    delete parent['onChanged_' + childName];
    var temp = parent[childName];
    delete parent[childName];
    parent[childName] = temp;
    var index = ChimeraPatterns._Observable.ObservableList.findIndex((element)=> {return (element.parent == parent && element.childName == childName) });
    if (index == -1) return;
    delete ChimeraPatterns._Observable.ObservableList[index];
};
//*** AnsychronousCallbackListNotifier *********************************************************************************

ChimeraPatterns.AsyncCallbackListCompleteNotifier = class AsyncCallbackListCompleteNotifier {
    constructor() {
        this.onCompleted = new ChimeraPatterns.Multicast.MulticastEvent(this,'onComplete');
        this._callbackList = [];
        this._isActive = false;
        this.isComplete = false;
    }

    start() {
        this._isActive = true;
        if (this._callbackList.length == 0) {
            this.onCompleted.callEvent();
            this.isComplete = true;
        }
    }

    registerEmptyCallback() {
        var self = this;
        var callback = function callbackFunc() { self._removeCallback( callbackFunc ); };
        this._callbackList.push( callback );
        return callback;
    }

    registerCallback( callback ) {
        var self = this;
        this._callbackList.push( callback );
        return function() {
            callback.apply(this, arguments);
            self._removeCallback( callback );
        };
    }

    registerAndExecuteCallback( callback ){
        this.registerCallback(callback)();
    }
    _removeCallback( reference ) {
        var index = this._callbackList.indexOf( (element)=> { element.reference == reference });
        this._callbackList.splice(index,1);
        if (this._callbackList.length == 0 && this._isActive == true) {
            this.onCompleted.callEvent();
            this.isComplete = true;
        }
    }
};

export var MulticastEvent = ChimeraPatterns.Multicast.MulticastEvent;
export var Aspect = ChimeraPatterns.Aspect;
export var MulticastFunction = ChimeraPatterns.Multicast.MulticastFunction;
export var AsyncCallbackListCompleteNotifier = ChimeraPatterns.AsyncCallbackListCompleteNotifier;
export var AsyncNotifier = ChimeraPatterns.AsyncCallbackListCompleteNotifier;
export var Observable = ChimeraPatterns.Observable;
/*
 ChimeraPatterns.smartObject = {}

 ChimeraPatterns.SmartObject.getCallback = function( target,property){}

 ChimeraPatterns.SmartObject.new = function(){
 return new Proxy(new this(),{
 get: (target, property)=>{},
 set: (target, property)=>{}
 })
 };
 */
