/**
 * Created by Greg on 6/25/2016.
 */

import "/server/utility_security_server"
import "/common/collection/model_chatmessage"

Meteor.startup(() => {
    // code to run on server at startup
    ChatRoomUsers.remove({});
});


Meteor.publish("ChatRoomNames", function () {
    denyAccessUnlessUserPub(this.userId);
    if ( isAdmin(this.userId) ) return ChatRoomNames.find();
    else return ChatRoomNames.find( {restriction: "public"} );
});

Meteor.publish("ChatRoomMessages", function ( roomId ) {
    denyAccessUnlessUserPub(this.userId);
    var chatRoomUser = ChatRoomUsers.findOne({ userId: this.userId });
    if (chatRoomUser == null || chatRoomUser.roomId != roomId) accessDenied();
    return ChatRoomMessages.find({roomId: roomId}, {sort: {createdAt: -1}, limit: 20});
});

Meteor.publish("ChatRoomUsers", function ( roomId ) {
    denyAccessUnlessUserPub(this.userId);
    var chatRoomUser = ChatRoomUsers.findOne({ userId: this.userId });
    if (chatRoomUser == null || chatRoomUser.roomId != roomId) accessDenied();
    return ChatRoomUsers.find({roomId: roomId});
});

Meteor.methods({
    
    joinChatRoom: function ( roomId ) {
        denyAccessUnlessUser();
        var room = ChatRoomNames.findOne({_id: roomId});

        if (!room) accessDenied();
        if (!userHasSharedAccess(Meteor.userId(), room)) accessDenied();

        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});

        if (chatRoomUser == null) ChatRoomUsers.insert( new ChatRoomUserModel({roomId: roomId }) );
        else ChatRoomUsers.update({_id: chatRoomUser._id}, new ChatRoomUserModel(chatRoomUser).update( roomId ) );


        this.connection.onCloseFunction = ()=> {
            var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
            if (chatRoomUser) ChatRoomUsers.remove(chatRoomUser);
        }
    },

    leaveChatRoom: function () {
        denyAccessUnlessUser();
        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
        if (chatRoomUser) ChatRoomUsers.remove(chatRoomUser);
    },

    sendChatMessage: function ({text, roomId}) {
        console.log("chat called");
        denyAccessUnlessUser();
        var chatRoomUser = ChatRoomUsers.findOne({userId: Meteor.userId()});
        if (chatRoomUser == null) accessDenied();
        if (chatRoomUser.roomId != roomId) accessDenied();

        ChatRoomMessages.insert( new ChatMessageModel({ text: text, roomId: roomId }));
    }
});