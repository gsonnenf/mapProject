/**
 * Created by Greg on 6/25/2016.
 */


isUser = (userId) => {
    if (arguments.length ==0) userId = Meteor.userId();
    return Roles.userIsInRole( userId, 'user' );
};

denyAccessUnlessAdmin = (userId) => {
    if (arguments.length ==0) userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, 'admin') ) throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessUser = () => {
    var userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, 'user') )throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessUserPub = (userId) => {
    if ( !Roles.userIsInRole( userId, 'user') )throw new Meteor.Error(403, "Access Denied.");
};

denyAnonymousAccessMethod = () => {if (  Meteor.userId() == null )throw new Meteor.Error(403, "Access Denied.");};
denyAnonymousAccessPublish = (userId) => { if ( userId == null )throw new Meteor.Error(403, "Access Denied.");};

accessDenied = ()=> { throw new Meteor.Error(403, "Access Denied."); };
recordNotFound = ()=> { throw new Meteor.Error(404, 'Record not Found.'); };

denyAccessUnlessPermAny = (accessManager, docId, userId, perms) => {
    if (!accessManager.hasPermissionAny( docId, userId, perms  ) ) throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessPermAll = (accessManager, docId, userId, perms) => {
    if (!accessManager.hasPermissionAll( docId, userId, perms ) ) throw new Meteor.Error(403, "Access Denied.");
};


userHasSharedAccess = function userHasSharedAccess( userId, document, permissionType ){
    if (userId == null) return false;
    if (document == null) return false;
    if (document.userId == userId) return "owner";
    if (document.isPublic) return "public";
    
    return false;
};