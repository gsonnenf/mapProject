/**
 * Created by Greg on 6/1/2016.
 */
import "/client/lib/utility/notification";
import {DbMeteor} from "/client/lib/db_framework/dbmeteor"
import {DbActiveSubscriptionMeteor} from "/client/lib/db_framework/dbactivesubscriptionmeteor";

export class ChatRoomDbMeteor{
    constructor() {
        this.chatRoomNameListDb = new DbMeteor({ meteorCollection: ChatRoomNames, queryObject: {} });
        this.activeRoomMessageDb = new DbActiveSubscriptionMeteor( {meteorCollection: ChatRoomMessages, publishName: "ChatRoomMessages" } );
        this.activeRoomUsersDb = new DbActiveSubscriptionMeteor( {meteorCollection: ChatRoomUsers, publishName:"ChatRoomUsers"} );
        
        //Events
        this.onMessageAdded = this.activeRoomMessageDb.onAdded;
        this.onRoomNamesChanged = this.chatRoomNameListDb.onChanged;
        this.onRoomNamesAdded = this.chatRoomNameListDb.onAdded;
        this.onRoomNamesRemoved = this.chatRoomNameListDb.onRemoved;

        this.onUserAdded = this.activeRoomUsersDb.onAdded;
        this.onUserRemoved = this.activeRoomUsersDb.onRemoved;
        
    }

    getRoomList() { return this.chatRoomNameListDb.getAllDocuments(); }

    setActiveRoom( {roomId, messageCallback, userCallback} ) {
        Meteor.call('joinChatRoom',roomId, ()=> {
            this.activeRoomMessageDb.setActiveDocuments({ params: roomId, callback: messageCallback });
            this.activeRoomUsersDb.setActiveDocuments({ params: roomId, callback: userCallback });
        });
    }

    getMessageList(){ return this.activeRoomMessageDb.getAllDocuments(); }

    getUserList(){ return this.activeRoomUsersDb.getAllDocuments(); }

    sendMessage( text, roomId ) { Meteor.call( 'sendChatMessage', { text: text, roomId: roomId }, Utility.MeteorCallResultMessage ); }
}


    
