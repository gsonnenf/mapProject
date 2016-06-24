/**
 * Created by Greg on 5/7/2016.
 */
if (typeof Utility === 'undefined') Utility = {};

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

////*************** Event System *************************************

isAdmin = (userId)=> {
    if (!userId) userId = Meteor.userId();
    return Roles.userIsInRole( userId, 'admin' );
};

isUser = (userId) => {
    if (!userId) userId = Meteor.userId();
    return Roles.userIsInRole( userId, 'user' );
};

denyAccessUnlessAdmin = (userId) => {
    if (!userId) userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, 'admin') ) throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessUser = (userId) => {
    if (!userId) userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, 'user') )throw new Meteor.Error(403, "Access Denied.");
};

denyAnonymousAccessMethod = () => {if (  Meteor.userId() == null )throw new Meteor.Error(403, "Access Denied.");};
denyAnonymousAccessPublish = (userId) => { if ( userId == null )throw new Meteor.Error(403, "Access Denied.");};

accessDenied = ()=> { throw new Meteor.Error(403, "Access Denied."); };
recordNotFound = ()=> { throw new Meteor.Error(404, 'Record not Found.'); };


userHasSharedAccess = function userHasSharedAccess( userId, sharedDocument){
    if (userId == null) return false;
    if (sharedDocument == null) return false;
    if (sharedDocument.userId == userId) return "owner";
    if (sharedDocument.accessList == null) return false;
    for (let listUserId of sharedDocument.accessList)
        if (listUserId == this.userId) return "shared";
    return false;
};

