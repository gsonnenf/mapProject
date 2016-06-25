/**
 * Created by Greg on 6/25/2016.
 */

import "./security"
import "../common/collections"

Meteor.publish("LinkPlanData", function () {
    denyAccessUnlessUser(this.userId);
    if ( isAdmin(this.userId) ) return LinkPlanData.find();
    else return LinkPlanData.find( { $or: [{userId: this.userId},{shared: true}]} );
});


Meteor.publish("LinkPlanMessages", function( linkPlanId ) {
    denyAccessUnlessUser(this.userId);
    var linkPlan = LinkPlanData.findOne( { _id: linkPlanId } );
    if ( !userHasSharedAccess(this.userId, linkPlan) ) accessDenied();
    return LinkPlanMessages.find({linkPlanId: linkPlanId}, {sort: {createdAt: -1} });
});


Meteor.methods({
    sendLinkPlanMessage: function ({text, linkPlanId}) {
        denyAccessUnlessUser();
        var linkPlan = LinkPlanData.findOne({_id: linkPlanId});
        if (!userHasSharedAccess(Meteor.userId(), linkPlan)) accessDenied();

        LinkPlanMessages.insert({
            text: text,
            linkPlanId: linkPlanId,
            createdAt: Date.now(),
            userName: Meteor.user().profile.name
        });

    },

// LINK PLAN CODE
    insertLinkPlan: function (linkPlan) {
        denyAccessUnlessUser();

        var linkPlanObject = new LinkPlan({
            userId: this.userId,
            shared: linkPlan.shared,
            name: linkPlan.name,
            anchorList: linkPlan.anchorList,
            lineList: linkPlan.lineList
        });

        return LinkPlanData.insert(linkPlanObject);
    },

    updateLinkPlan: function (linkPlan) {
        denyAccessUnlessUser();
        if (isAdmin()) {
            var linkPlanObject = LinkPlanData.findOne({_id: linkPlan._id});
            if (!linkPlanObject) throw new Meteor.Error(404, 'Record not Found.');
            LinkPlanData.update({_id: linkPlan._id}, linkPlan);
            return linkPlan;
        }
        else {
            var linkPlanObject = LinkPlanData.findOne({_id: linkPlan._id, userId: this.userId});
            if (!linkPlanObject) throw new Meteor.Error(403, 'Access Denied.');
            linkPlanObject.shared = linkPlan.shared;
            linkPlanObject.name = linkPlan.name;
            linkPlanObject.anchorList = linkPlan.anchorList;
            linkPlanObject.linkList = linkPlan.linkList;

            LinkPlanData.update({_id: linkPlan._id}, linkPlanObject);
            return linkPlanObject;
        }
    },

    deleteLinkPlan: function (linkPlanId) {
        denyAccessUnlessUser();
        if (isAdmin()) {
            var linkPlanObject = LinkPlanData.findOne({_id: linkPlanId});
            if (!linkPlanObject) throw new Meteor.Error(404, 'Record not Found.');
        }
        else {
            var linkPlanObject = LinkPlanData.findOne({_id: linkPlanId, userId: this.userId});
            if (!linkPlanObject) throw new Meteor.Error(403, 'Access Denied.');
        }

        LinkPlanData.remove(linkPlanObject);
        return linkPlanObject.name;
    },
});