/**
 * Created by Greg on 6/18/2016.
 */


ChatMessageModel = class ChatMessageModel {
    constructor({ roomId, text,
        _id= null,
        userId = Meteor.userId(),
        profileId = Meteor.user().profileId,
        displayName = Meteor.user().profile.name,
        createdAt = Date.now()
    }) {
            this._id = _id;
            this.roomId = roomId;
            this.displayName = displayName;
            this.text = text;
            this.userId = userId;
            this.profileId = profileId;
            this.createdAt = createdAt;
    }
    
 
};