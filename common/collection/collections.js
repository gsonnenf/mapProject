/**
 * Created by Greg on 5/7/2016.
 */


import '/common/lib/utility_security_common'

BasePortalData = new Mongo.Collection('BasePortalData');
LastUpdateTracker = new Mongo.Collection('LastUpdateTracker');

ChatRoomNames = new Mongo.Collection('ChatRoomNames');
ChatRoomMessages = new Mongo.Collection('ChatRoomMessages');
ChatRoomUsers = new Mongo.Collection("ChatRoomUsers");

FriendListData = new Mongo.Collection('FriendListData');


LastUpdateTracker.allow({
    update: isAdmin,
    insert: isAdmin,
    remove: isAdmin
});

BasePortalData.allow({
    update: isAdmin,
    insert: isAdmin,
    remove: isAdmin
});

ChatRoomNames.allow({
    update: isAdmin,
    insert: isAdmin,
    remove: isAdmin
});