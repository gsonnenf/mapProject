/**
 * Created by Greg on 6/25/2016.
 */

import "./security"
import "../common/collections"

Meteor.publish("BasePortalData", function () {
    denyAccessUnlessUser(this.userId);
    return BasePortalData.find();
});

Meteor.publish("LastUpdateTracker", function () {
    denyAccessUnlessUser(this.userId);
    return LastUpdateTracker.find();
});
