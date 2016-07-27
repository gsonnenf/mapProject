/**
 * Created by Greg on 5/6/2016.
 */
import "/server/utility_security_server"

Meteor.publish("allUserData", function () {
    denyAccessUnlessAdmin( this.userId );
    return Meteor.users.find({}, {fields: {'nested.things': 1}});
});

Meteor.publish("roles", function () {
    denyAccessUnlessAdmin( this.userId );
    return Meteor.roles.find();
});

Meteor.methods({
    getAllRoles: function () {
        denyAccessUnlessAdmin();
        return Roles.getAllRoles().fetch();
    },

    userIsInRole : function(userId, roles) {
        denyAccessUnlessAdmin();
        var isTrue = Roles.userIsInRole( userId, roles);
        console.log("User: " + userId + "is in role " + roles + ": " + isTrue);
        return isTrue;
    },

    addRoleAdmin : function(userId) {
        denyAccessUnlessAdmin();
        Roles.addUsersToRoles(userId, ['admin']);
        return 'success';
    },
    
    addRoleUser : function(userId) {
        denyAccessUnlessAdmin();
        Roles.addUsersToRoles(userId, ['user']);
    },
});

