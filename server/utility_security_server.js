/**
 * Created by Greg on 6/25/2016.
 */
import { RoleList } from "/server/rolelist" 

isUser = (userId) => {
    if (userId === undefined) userId = Meteor.userId();
    return Roles.userIsInRole( userId, RoleList.USER );
};

denyAccessUnlessAdmin = (userId) => {
    if (userId === undefined) userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, RoleList.ADMIN) ) throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessUser = () => {
    var userId = Meteor.userId();
    if ( !Roles.userIsInRole( userId, RoleList.USER) )throw new Meteor.Error(403, "Access Denied.");
};

denyAccessUnlessUserPub = (userId) => {
    if ( !Roles.userIsInRole( userId, RoleList.USER) )throw new Meteor.Error(403, "Access Denied.");
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