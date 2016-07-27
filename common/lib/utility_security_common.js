/**
 * Created by Greg on 6/26/2016.
 */

isAdmin = (userId)=> {
    if (!userId) userId = Meteor.userId();
    return Roles.userIsInRole( userId, 'admin' );
};