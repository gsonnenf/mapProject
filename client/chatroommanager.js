/**
 * Created by Greg on 6/3/2016.
 */

import "./widget_itemset.js"

ChatRoomManager = class ChatRoomManager {
    constructor() {
        this.chatRoomDb = new ChatRoomDbMeteor();
        this.roomSelectWidget = new WidgetItemSet({elementType: "a"});

        this.roomSelectWidget.addChildClass(("ui toggle button basic"));
        this.chatRoomNameElement = $('#publicRoomList');

        this.messageWidget = new MessageWidget({
            outputElement: $('#chatRoomMessageWindow'),
            inputElement: $('#chatRoomInput'),
            submitButton: $('#chatRoomSubmitButton')
        });

        this.messageUserWidget = new MessageUserWidget({ userMenuElement: $('#chatRoomUsersWindow') });

        this.messageWidget.onSendMessage.push( (text)=> {
            Meteor.call('sendChatMessage', {text: text, roomId: this.activeChatRoom._id }, Utility.MeteorCallResultMessage);
        });
    }

    initialize() {

        this.setRoomList();
        this.chatRoomDb.onRoomNamesAdded.push( ()=> { this.setRoomList(); });
        this.chatRoomDb.onRoomNamesRemoved.push( ()=> { this.setRoomList(); });
        this.chatRoomDb.onRoomNamesChanged.push( ()=> { this.setRoomList(); });
        this.chatRoomDb.onMessageAdded.push( (document )=> {this.messageWidget.printMessage( document );});

        this.chatRoomDb.activeRoomUsersDb.onAdded.push((user)=> {this.messageUserWidget.addUser(user);} )
        this.chatRoomDb.activeRoomUsersDb.onRemoved.push((user)=> {this.messageUserWidget.removeUser(user);} )

    }

    setRoomList() { this._setRoomList( this.chatRoomDb.getRoomList() );}

    _setRoomList(roomList) {
        Utility.debugMessage("Populating room list",3);

        this.roomList = roomList;
        console.log(roomList);
        for (let index in roomList) {
            let room = roomList[index];
            this.roomSelectWidget.addButton({
                text: room.name,
                onSelect: ()=> {
                    this.setChatRoom(room);
                    this.chatRoomDb.setActiveRoom({
                        roomId: room._id,
                        messageCallback: ()=> {
                            this.messageWidget.printMessageList(
                                this.chatRoomDb.getMessageList()
                                    .sort((element1, element2) => { return element1.createdAt - element2.createdAt} )
                            );
                        },
                        userCallback: ()=> {
                            this.messageUserWidget.addUserList( this.chatRoomDb.getUserList() );
                        }
                    });
                },
                onDeselect: ()=> { }
            });
        }

        this.roomSelectWidget.createChildren();
        this.roomSelectWidget.append(this.chatRoomNameElement);

        //this.roomSelectWidget.activeButton = this.buttonList[0];
        //this.roomSelectWidget.activeButton.onSelect();
        //this.roomSelectWidget.activeButton.element.addClass("active");
    }

    setChatRoom( room ){
        this.activeChatRoom = room;
        this.messageWidget.clearMessages();
        this.messageUserWidget.clearUserList();
        this.messageWidget.printText('<div>Joined room: '+ room.name + ' </div><div>&nbsp;</div>');
    }
};

