/**
 * Created by Greg on 6/27/2016.
 */

FriendCollection = new Mongo.Collection("FriendRequestCollection");
FriendCollection = new Mongo.Collection("FriendCollection");

FriendListModel = class FriendListModel{
    constructor({userId=null, friendIdList=[]}) {
        this.ownerId = userId;
        this.friendIdList = [];
    }
};

FriendListModel.schema = new SimpleSchema({
    ownerId: {
        type: String
    },
    friendIdList: {
        type: [String]
    }
});


