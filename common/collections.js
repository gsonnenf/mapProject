/**
 * Created by Greg on 5/7/2016.
 */

import './utility_multicast.js'

BasePortalData = new Mongo.Collection('BasePortalData');
LastUpdateTracker = new Mongo.Collection('LastUpdateTracker');

ChatRoomNames = new Mongo.Collection('ChatRoomNames');
ChatRoomMessages = new Mongo.Collection('ChatRoomMessages');
ChatRoomUsers = new Mongo.Collection("ChatRoomUsers");

LinkPlanData = new Mongo.Collection('LinkPlanData');
LinkPlanMessages = new Mongo.Collection('LinkPlanMessages');


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

LinkPlanData.allow({
    update: isAdmin,
    insert: isAdmin,
    remove: isAdmin
});

ChatRoomNames.allow({
    update: isAdmin,
    insert: isAdmin,
    remove: isAdmin
});