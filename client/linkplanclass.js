/**
 * Created by Greg on 4/13/2016.
 */

LinkPlanClass = class LinkPlanClass {
    constructor({_id = null, userId = Meteor.userId(), name = "New Link Plan" , lineList = [], anchorList = [], shared = false} = []) {
        this._id = _id;
        this.userId = userId;
        this.name = name;
        this.lineList = lineList;
        this.anchorList = anchorList;
        this.shared = shared;
    }
};


