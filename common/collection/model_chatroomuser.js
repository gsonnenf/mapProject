/**
 * Created by Greg on 6/25/2016.
 */


ChatRoomUserModel = class ChatRoomUserModel {
    constructor({
        roomId,
        _id = null,
        name = Meteor.user().profile.name,
        userId = Meteor.userId(),
        profileId = Meteor.user().profileId,
        LastModified = Date.now()
     }) {
        this._id = _id;
        this.name = name;
        this.roomId = roomId;
        this.userId = userId;
        this.profileId = profileId;
        this.lastModified = lastModified;
    }

    update (roomId){
        this.roomId = roomId;
        this.lastModified = Date.now();
        this.name = Meteor.user().profile.name;
    }


};