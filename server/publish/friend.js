/**
 * Created by Greg on 7/8/2016.
 */

Meteor.publish("FriendList", function() {
    denyAccessUnlessUserPub(this.userId);
    return FriendCollection.find({ownerId: this.userId});
});

Meteor.publish("FriendStatus", function() {
    FriendCollection.find({ownerId: this.userId}).forEach()

});
Meteor.methods({
    'friend.request': function( friendId ){
        
    
    },
    'friend.acceptRequest': function (friendRequest){

    },
    'friend.removeFriend': function(friendId){
        
    },
    
});
