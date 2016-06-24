/**
 * Created by Greg on 5/17/2016.
 */

LinkPlanDbMeteor = class LinkPlanDbMeteor {
    constructor({portalDb}){
        this.portalDb = portalDb;
        
        this.linkPlanNameListCursor = LinkPlanData.find( {},{fields: {name: 1, userId: 1, shared: 1} });
        this.linkPlanListCursor = LinkPlanData.find( {} );
        
        this.onLinkPlanNameListChanged = new Utility.MulticastEvent();
        this.onActiveLinkPlanChanged = new Utility.MulticastEvent();
        this.onActiveLinkPlanDeleted = new Utility.MulticastEvent();

/*
        this.linkPlanListCursor.observe({
            added: (document) => { this.onLinkPlanListChanged.callEvents(document); },
            changed: (document) => { this.onLinkPlanListChanged.callEvents(document); },
            removed: (document) => { this.onLinkPlanListChanged.callEvents(document); },
        });
*/
        this.linkPlanNameListCursor.observe({
            added: (document) => { this.onLinkPlanNameListChanged.callEvents(document); },
            removed: (document) => { this.onLinkPlanNameListChanged.callEvents(document); },
            changed: (document) => { this.onLinkPlanNameListChanged.callEvents(document); },
        });
    }
    
    setActiveLinkPlan(linkPlan) {
        var planId = linkPlan._id;
        if (this.activeLinkPlanHandle) this.activeLinkPlanHandle.stop();
        this.activeLinkPlanHandle = null;
        if (planId == null) return;
        this.observedLinkPlanCursor = LinkPlanData.find( {_id: planId} );
        this.activeLinkPlanHandle = this.observedLinkPlanCursor.observe({
            changed: (document) => { this.onActiveLinkPlanChanged.callEvents(document); },
            removed: (document) => { this.onActiveLinkPlanDeleted.callEvents(document); }
        });
        
    }

    fetchLinkPlanNameList () { return this.linkPlanNameListCursor.fetch(); }

    fetchLinkPlanList () { return this.linkPlanListCursor.fetch(); }

    fetchLinkPlan( linkPlanId ) {
        var linkPlanObject = LinkPlanData.findOne( { _id: linkPlanId } );
        if (linkPlanObject == null || linkPlanObject == []) Utility.throwErrorMessage({title:"Link Plan Fetch not found."});
        Utility.successMessage({title: "Success", message:'Link Plan: "' + linkPlanObject.name + '" successfully loaded.'});
        return this.unMarshallLinkPlan(linkPlanObject);
    }

    insertLinkPlan( linkPlan ){
        if (linkPlan.dirty) { Utility.standardMessage("Link Plan currently being saved, try again in a couple seconds."); return; };
        linkPlan.dirty = true;
        Meteor.call( "insertLinkPlan",
            this.marshallLinkPlan(linkPlan),
            (error, result) => {
                if (error) { Utility.errorMessage({title: "LinkPlanError", message: error}); return; }
                Utility.successMessage({title: "Insert Successful", message: "Item was successfully inserted."});
                linkPlan._id = result;
                linkPlan.dirty = false;
        });
    }
    
    updateLinkPlan( linkPlan ) {
        Meteor.call("updateLinkPlan",
            this.marshallLinkPlan(linkPlan),
            (error, result) => {
                if (error) { Utility.errorMessage({title: "LinkPlanError", message: error}); return; }
                Utility.successMessage({title: "Update Successful", message: "Item was successfully updated."});
            });
    }

    deleteLinkPlan(linkPlanId ) { 
        Meteor.call(
            "deleteLinkPlan", 
            linkPlanId, 
            (error,result) => {
                if (error) { Utility.errorMessage({title: "Delete Error", message: error}); return; }
                Utility.successMessage({title:"Delete Successful", message: "Link Plan: " + result + " was successfully delete."});
        });
    }

    /*********************
    INTERNAL METHODS
     *********************/
    marshallLinkPlan( linkPlan ){
        var linkPlanObject = Object.assign({},linkPlan);
        linkPlanObject.anchorList = this.marshallAnchorList(linkPlan.anchorList);
        linkPlanObject.lineList = this.marshallLineList(linkPlan.lineList);
        return linkPlanObject;
    }

    unMarshallLinkPlan( linkPlanObject ) {
        var linkPlan = new LinkPlanClass(linkPlanObject);
        linkPlan.anchorList = this.unMarshallAnchorList(linkPlanObject.anchorList);
        linkPlan.lineList = this.unMarshallLineList(linkPlanObject.lineList);
        return linkPlan;
    }

    marshallAnchorList(anchorList) {
        var anchorIdList = [];
        for (let index in anchorList) anchorIdList.push(  anchorList[index].guid );
        return anchorIdList;
    }

    unMarshallAnchorList(anchorIdList) {
        var anchorList = [];
        for(let index in anchorIdList) anchorList.push( this.portalDb.getPortalById(anchorIdList[index]) );
        return anchorList;
    }

    marshallLineList(lineList) {
        var lineIdList = [];
        for(let index in lineList) {
            var line = lineList[index];
            lineIdList.push({
                portal1: line.portal1.guid,
                portal2: line.portal2.guid
            });
        }
        return lineIdList;
    }

    unMarshallLineList(lineIdList) {
        var lineList = [];
        for(let index in lineIdList) {
            var lineId = lineIdList[index];
            lineList.push({
                portal1: this.portalDb.getPortalById(lineId.portal1),
                portal2: this.portalDb.getPortalById(lineId.portal2)
            });
        }
        return lineList;
    }

};