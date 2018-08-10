/**
 * Created by Greg on 6/25/2016.
 */

import "/server/utility_security_server"
import "/common/collection/collections"

Meteor.publish("BasePortalData", function () {
    console.log("portal pub");
    denyAccessUnlessUserPub(this.userId);
    return BasePortalData.find();
});

Meteor.publish("LastUpdateTracker", function () {
    denyAccessUnlessUserPub(this.userId);
    return LastUpdateTracker.find();
});

console.log("Portal and update published");