/**
 * Created by Greg on 6/25/2016.
 */


ChatRoomUser = class ChatRoomUser {
    constructor({ _id=null, name, roomId, userId, profileId, lastModified}) {
        this._id = _id;
        this.name = name;
        this.roomId = roomId;
        this.userId = userId;
        this.profileId = profileId;
        this.lastModified = lastModified;
    }
};