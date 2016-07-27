/**
 * Created by Greg on 6/25/2016.
 */

import {AccessManager} from '/common/lib/accessmanager'
import '/common/collection/linkplan'

import '/server/utility_security_server'
import '/server/utility_db_log'


var lpAccessManager = new AccessManager({
    accessCollection:LinkPlanAccessCollection, 
    documentCollection: LinkPlanCollection,
    options: {autoAssignOwner: true, autoDelete: true}
});
var permEnum = AccessManager.DefaultPermEnum;


var pubs = lpAccessManager.securePublish("linkPlan",function(){return this.userId},[permEnum.Owner,permEnum.Read,permEnum.Modify]);
//pubs.accessPub.aspect.onMethodEntry.push( ()=>{});
//pubs.documentPub.aspect.onMethodEntry.push(()=>{denyAccessUnlessUser(this.userId)});


Meteor.publish("LinkPlanMessages", function( linkPlanId ) {
    denyAccessUnlessUserPub(this.userId);
    denyAccessUnlessPermAny(lpAccessManager, linkPlanId, this.userId, [permEnum.Owner,permEnum.Read,permEnum.Modify] );
    return LinkPlanMessages.find({linkPlanId: linkPlanId}, {sort: {createdAt: -1} });
});

Meteor.methods({
    insertLinkPlan: function (newLinkPlan) {
        denyAccessUnlessUser();
        console.log(newLinkPlan);
        var linkPlan = {
            ownerId: Meteor.userId(),
            displayName: newLinkPlan.displayName,
            isPublic: newLinkPlan.isPublic,
            lineList: newLinkPlan.lineList,
            anchorList: newLinkPlan.anchorList,
        };
        LinkPlanCollection.insert(linkPlan);
    },

    updateLinkPlan: function (updatedLinkPlan) {
        denyAccessUnlessUser();
        denyAccessUnlessPermAny(lpAccessManager, updatedLinkPlan._id, Meteor.userId(), [permEnum.Owner,permEnum.Modify] );

        LinkPlanCollection.update({
            _id: updatedLinkPlan._id},
            { $set : {
                displayName: updatedLinkPlan.displayName,
                anchorList: updatedLinkPlan.anchorList,
                lineList: updatedLinkPlan.lineList,
                isPublic: updatedLinkPlan.isPublic,
            }},
            Utility.standardServerDbCallback);
        return updatedLinkPlan;
    },

    deleteLinkPlan: function (linkPlanId) {
        denyAccessUnlessUser();
        denyAccessUnlessPermAny(lpAccessManager, linkPlanId, Meteor.userId(), [permEnum.Owner] );
        var linkPlanObject = LinkPlanCollection.findOne({_id: linkPlanId});
        LinkPlanCollection.remove({_id: linkPlanId}, Utility.standardServerDbCallback);
        return linkPlanObject.name;
    },

    sendLinkPlanMessage: function ({text, linkPlanId}) {
        denyAccessUnlessUser();
        denyAccessUnlessPermAny(lpAccessManager, linkPlanId,  Meteor.userId(), [permEnum.Owner,permEnum.Modify] );

        LinkPlanMessages.insert({
            text: text,
            linkPlanId: linkPlanId,
            createdAt: Date.now(),
            userName: Meteor.user().profile.name
        });
    },
});

