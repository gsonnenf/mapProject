/**
 * Created by Greg on 6/25/2016.
 */

import "./security"
import "../common/collections"

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


Meteor.publish("ChatRoomUsers", function ( roomId ) {
    denyAccessUnlessUser(this.userId);
    var chatRoomUser = ChatRoomUsers.findOne({ userId: this.userId });
    if (chatRoomUser == null || chatRoomUser.roomId != roomId) accessDenied();
    return ChatRoomUsers.find({roomId: roomId});
});

Meteor.methods({
    //Dont use arrow functions, they ruin this.userId;

    leaveChatRoom: function () {
        denyAccessUnlessUser();
        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
        if (chatRoomUser) ChatRoomUsers.remove(chatRoomUser);
    },

    joinChatRoom: function (roomId) {
        denyAccessUnlessUser();

        var room = ChatRoomNames.findOne({_id: roomId});
        if (isAdmin()) if (room == null) recordNotFound();
        else if (room == null || room.restriction != 'public') accessDenied();

        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});

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
            var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
            if (chatRoomUser) ChatRoomUsers.remove(chatRoomUser);
        }
    },

    sendChatMessage: function ({text, roomId}) {
        console.log("chat called");
        denyAccessUnlessUser();
        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
        if (chatRoomUser == null) accessDenied();
        if (chatRoomUser.roomId != roomId) accessDenied();

        ChatRoomMessages.insert({
            text: text,
            roomId: roomId,
            createdAt: Date.now(),
            userName: Meteor.user().profile.name
        });
    },
});