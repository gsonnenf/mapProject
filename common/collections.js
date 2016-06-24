/**
 * Created by Greg on 5/7/2016.
 */

import './util.js'

BasePortalData = new Mongo.Collection('BasePortalData');
LastUpdateTracker = new Mongo.Collection('LastUpdateTracker');
LinkPlanData = new Mongo.Collection('LinkPlanData');
ChatRoomNames = new Mongo.Collection('ChatRoomNames');
ChatRoomMessages = new Mongo.Collection('ChatRoomMessages');
LinkPlanMessages = new Mongo.Collection('LinkPlanMessages');


ChatRoomUsers = new Mongo.Collection("ChatRoomUsers");

if (Meteor.isServer) {
    console.log("Publishing:");
    
    Meteor.publish("LinkPlanData", function () {
        denyAccessUnlessUser(this.userId);
        if ( isAdmin(this.userId) ) return LinkPlanData.find();
        else return LinkPlanData.find( { $or: [{userId: this.userId},{shared: true}]} );
    });

    Meteor.publish("BasePortalData", function () {
        denyAccessUnlessUser(this.userId);
        return BasePortalData.find();
    });

    Meteor.publish("LastUpdateTracker", function () {
        denyAccessUnlessUser(this.userId);
        return LastUpdateTracker.find();
    });

    Meteor.publish("ChatRoomNames", function () {
        denyAccessUnlessUser(this.userId);
        if ( isAdmin(this.userId) ) return ChatRoomNames.find();
        else return ChatRoomNames.find( {restriction: "public"} );
    });

    Meteor.publish("ChatRoomMessages", function ( roomId ) {

        denyAccessUnlessUser(this.userId);
        var chatRoomUser = ChatRoomUsers.findOne({ userId: this.userId });
        if (chatRoomUser == null || chatRoomUser.roomId != roomId) accessDenied();
        return ChatRoomMessages.find({roomId: roomId}, {sort: {createdAt: -1}, limit: 20});
    });

    Meteor.publish("LinkPlanMessages", function( linkPlanId ) {
        denyAccessUnlessUser(this.userId);
        var linkPlan = LinkPlanData.findOne( { _id: linkPlanId } );
        if ( !userHasSharedAccess(this.userId, linkPlan) ) accessDenied();
        return LinkPlanMessages.find({linkPlanId: linkPlanId}, {sort: {createdAt: -1} });
    });

    Meteor.publish("ChatRoomUsers", function ( roomId ) {
        denyAccessUnlessUser(this.userId);
        var chatRoomUser = ChatRoomUsers.findOne({ userId: this.userId });
        if (chatRoomUser == null || chatRoomUser.roomId != roomId) accessDenied();
        return ChatRoomUsers.find({roomId: roomId});
    });

    console.log("Publish registered.");

    Meteor.methods({
        //Dont use arrow functions, they ruin this.userId;

        leaveChatRoom: function ( ){
            denyAccessUnlessUser();
            var chatRoomUser = ChatRoomUsers.findOne({ userId: Meteor.userId() });
            if (chatRoomUser) ChatRoomUsers.remove( chatRoomUser );
            return;
        },

        joinChatRoom: function ( roomId ) {
            denyAccessUnlessUser();

            var room = ChatRoomNames.findOne({_id: roomId});
            if ( isAdmin() ) if (room == null) recordNotFound();
            else if (room == null || room.restriction != 'public' ) accessDenied();

            var chatRoomUser = ChatRoomUsers.findOne({ userId: Meteor.userId() });

            if (chatRoomUser == null) ChatRoomUsers.insert({
                roomId: roomId,
                name: Meteor.user().profile.name,
                userId: Meteor.userId(),
                profileId: Meteor.user().profileId,
                LastModified: Date.now()
            });

            else {
                chatRoomUser.roomId = roomId;
                chatRoomUser.name = Meteor.user().profile.name;
                chatRoomUser.LastModified = Date.now();
                ChatRoomUsers.update({_id: chatRoomUser._id}, chatRoomUser);
            }

            this.connection.onCloseFunction = ()=> {
                var chatRoomUser = ChatRoomUsers.findOne({ userId: Meteor.userId() });
                if (chatRoomUser) ChatRoomUsers.remove( chatRoomUser );
            }
        },

        sendChatMessage: function( {text, roomId} ) {
            console.log("chat called");
            denyAccessUnlessUser();
            var chatRoomUser = ChatRoomUsers.findOne({ userId: Meteor.userId() });
            if (chatRoomUser == null) accessDenied();
            if (chatRoomUser.roomId != roomId) accessDenied();

            ChatRoomMessages.insert({
                text: text,
                roomId: roomId,
                createdAt: Date.now(),
                userName: Meteor.user().profile.name
            });
        },

        sendLinkPlanMessage: function( {text,linkPlanId}) {
            denyAccessUnlessUser();
            var linkPlan = LinkPlanData.findOne( { _id: linkPlanId } );
            if ( !userHasSharedAccess(Meteor.userId(), linkPlan) ) accessDenied();

            LinkPlanMessages.insert({
                text: text,
                linkPlanId: linkPlanId,
                createdAt: Date.now(),
                userName: Meteor.user().profile.name
            });

        },

        // LINK PLAN CODE
        insertLinkPlan: function (linkPlan) {
            denyAccessUnlessUser();

            var linkPlanObject = {
                userId: this.userId,
                shared: linkPlan.shared,
                name: linkPlan.name,
                anchorList: linkPlan.anchorList,
                lineList: linkPlan.lineList,
            };

            return LinkPlanData.insert( linkPlanObject );
        },

        updateLinkPlan: function(linkPlan) {
            denyAccessUnlessUser();
            if ( isAdmin() ){
                var linkPlanObject = LinkPlanData.findOne( { _id: linkPlan._id} );
                if (!linkPlanObject) throw new Meteor.Error( 404 , 'Record not Found.' );
                LinkPlanData.update( {_id: linkPlan._id}, linkPlan );
                return linkPlan;
            }
            else {
                var linkPlanObject = LinkPlanData.findOne( { _id: linkPlan._id, userId: this.userId } );
                if (!linkPlanObject) throw new Meteor.Error( 403 , 'Access Denied.' );
                linkPlanObject.shared = linkPlan.shared;
                linkPlanObject.name = linkPlan.name;
                linkPlanObject.anchorList = linkPlan.anchorList;
                linkPlanObject.linkList = linkPlan.linkList;

                LinkPlanData.update( {_id: linkPlan._id}, linkPlanObject );
                return linkPlanObject;
            }
        },

        deleteLinkPlan: function(linkPlanId) {
            denyAccessUnlessUser();
            if ( isAdmin() ){
                var linkPlanObject = LinkPlanData.findOne( { _id: linkPlanId} );
                if (!linkPlanObject) throw new Meteor.Error( 404 , 'Record not Found.' );
            }
            else{
                var linkPlanObject = LinkPlanData.findOne( { _id: linkPlanId, userId: this.userId } );
                if (!linkPlanObject) throw new Meteor.Error( 403 , 'Access Denied.' );
            }

            LinkPlanData.remove( linkPlanObject );
            return linkPlanObject.name;
        },
    });
}



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