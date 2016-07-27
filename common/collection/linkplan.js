/**
 * Created by Greg on 4/13/2016.
 */

import '/common/lib/accessmanager'

/* collections */
LinkPlanCollection = new Mongo.Collection('LinkPlanCollection');
LinkPlanAccessCollection = new Mongo.Collection('LinkPlanAccessCollection');
LinkPlanMessages = new Mongo.Collection('LinkPlanMessages');
/* Models */
LinkPlanModel = class LinkPlanModel {
    constructor({
        _id = null, 
        ownerId = Meteor.userId(),
        displayName = "New Link Plan" ,
        lineList = [], 
        anchorList = [],
        isPublic = false}=[]) 
    {
        this._id = _id;
        this.ownerId = ownerId;
        this.displayName = displayName;
        this.lineList = lineList;
        this.anchorList = anchorList;
        this.isPublic = isPublic;
    }
};


LinkPlanModel.schema = new SimpleSchema({
    ownerId: {
        type: String,
        //autoValue: ()=> { return Meteor.userId() }
    },
    displayName: {
        type: String,
        defaultValue: "New Link Plan",
        min: 3,
        max: 30,
    },
    lineList: {
        type: [Object]
    },
    "lineList.$.portal1": {
        type: String
    },
    "lineList.$.portal2": {
        type: String
    },

    anchorList: {
        type: [String]
    },
    isPublic: {
        type: Boolean
    }
});
 LinkPlanCollection.attachSchema(LinkPlanModel.schema);


LinkPlanMessageModel = class LinkPlanMessageModel {

};
LinkPlanMessageModel.schema = new SimpleSchema ({
    text: {
        type: String,
        min: 1,
        max: 500
    },
    userName: {
        type: String,
        autoValue: ()=> { return Meteor.user().profile.name }
    },
    userId: {
        type: String,
        min: 17,
        max: 17
    },
    linkPlanId: {
        type: String,
        min: 17,
        max:17
    },
    createdAt: {
        type: Date,
        autoValue: Date.now
    },
});

/* collections2 attachment */
LinkPlanMessages.attachSchema(LinkPlanMessageModel.schema);



