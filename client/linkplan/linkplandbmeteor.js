/**
 * Created by Greg on 5/17/2016.
 */
import {MulticastEvent} from "/common/lib/chimerapatterns"
import {DbMeteor} from "/client/lib/db_framework/dbmeteor"
import "/client/lib/utility/notification"
import "/common/collection/linkplan"

 export class LinkPlanDbMeteor {
    
    constructor({portalDb}){
        this.portalDb = portalDb;
        
        this.onLinkPlanAdded = new MulticastEvent();
        this.onLinkPlanRemoved = new MulticastEvent();

        this.linkPlanCursor = LinkPlanCollection.find();
        this.linkPlanCursor.observe({
            added: (doc)=>{ this.onLinkPlanAdded.callEvent(doc)},
            removed: (doc)=>{ this.onLinkPlanRemoved.callEvent(doc)}
        });

        this.onLinkPlanAdded( ()=> {console.log("onLinkPlanAdded") });
        this.onLinkPlanRemoved( ()=> {console.log("onLinkPlanRemoved") });

        this.onActiveLinkPlanChanged = new MulticastEvent();
        this.onActiveLinkPlanDeleted = new MulticastEvent();
    }
    
    setActiveLinkPlan(linkPlan) {
        var planId = linkPlan._id;
        if (this.activeLinkPlanHandle) this.activeLinkPlanHandle.stop();
        this.activeLinkPlanHandle = null;
        if (planId == null) return;
        this.activeLinkPlanCursor = LinkPlanCollection.find( {_id: planId} );
        this.activeLinkPlanHandle = this.activeLinkPlanCursor.observe({
            changed: (document) => { this.onActiveLinkPlanChanged.callEvent(document); },
            removed: (document) => { this.onActiveLinkPlanDeleted.callEvent(document); }
        });
    }

    getLinkPlanNameList () { return this.linkPlanCursor.fetch(); }

    getLinkPlan(linkPlanId ) {
        var linkPlanObject = LinkPlanCollection.findOne( { _id: linkPlanId } );
        if (!linkPlanObject) Utility.throwErrorMessage({title: 'Get Link Plan', Message:"Link Plan not found."});
        Utility.successMessage({title: "Success", message:'Link Plan: "' + linkPlanObject.displayName + '" successfully loaded.'});
        console.log(linkPlanObject);
        return this.unMarshallLinkPlan(linkPlanObject);
    }

    insertLinkPlan( linkPlan ){
        if (linkPlan.dirty) { Utility.standardMessage({title:"Save", message:"Link Plan currently being saved, try again in a couple seconds."}); return; }
        linkPlan.dirty = true;
        Meteor.call( "insertLinkPlan",
            this.marshallLinkPlan(linkPlan),
            (error, result) => {
                if (error) Utility.throwErrorMessage({title: "Insert Error", message: error});
                Utility.successMessage({title: "Insert Successful", message: "Link plan was successfully saved."});
                linkPlan._id = result;
                linkPlan.dirty = false;
        });
    }

    updateLinkPlan( linkPlan ) {
        Meteor.call("updateLinkPlan",
            this.marshallLinkPlan(linkPlan),
            (error, result) => {
                if (error) Utility.throwErrorMessage({title: "Update Error", message: error});
                Utility.successMessage({title: "Update Successful", message: "Link plan was successfully updated."});
            });
    }

    deleteLinkPlan(linkPlanId ) { 
        Meteor.call(
            "deleteLinkPlan", 
            linkPlanId, 
            (error,result) => {
                if (error) Utility.throwErrorMessage({title: "Update Error", message: error});
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
        console.log(linkPlanObject);
        return linkPlanObject;
    }

    unMarshallLinkPlan( linkPlanObject ) {
        var linkPlan = new LinkPlanModel(linkPlanObject);
        linkPlan.anchorList = this.unMarshallAnchorList(linkPlanObject.anchorList);
        linkPlan.lineList = this.unMarshallLineList(linkPlanObject.lineList);
        return linkPlan;
    }

    marshallAnchorList(anchorList) {
        var anchorIdList = [];
        anchorList.forEach( (element)=>{ anchorIdList.push(element.guid)});
        return anchorIdList;
    }

    unMarshallAnchorList(anchorIdList) {
        var anchorList = [];
        anchorIdList.forEach( (element)=> {anchorList.push( this.portalDb.getPortalById(element) )});
        return anchorList;
    }

    marshallLineList(lineList) {
        var lineIdList = [];
        lineList.forEach( (line)=>{
            lineIdList.push({
            portal1: line.portal1.guid,
            portal2: line.portal2.guid
            });
        });
        return lineIdList;
    }

    unMarshallLineList(lineIdList) {
        var lineList = [];
        lineIdList.forEach( (lineId)=>{
            lineList.push({
                portal1: this.portalDb.getPortalById(lineId.portal1),
                portal2: this.portalDb.getPortalById(lineId.portal2)
            });
        });
        return lineList;
    }

};