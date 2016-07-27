/**
 * Created by Greg on 4/7/2016.
 */

import {MulticastEvent} from "/common/lib/chimerapatterns"

export class LinkPlanMenubar {
    constructor() {
        this.menubarElement = $( '#linkPlanMenubar' );
        this.menubarContainer = $("#menubarContainer");
        this.menubarElement.css('display','none');
        this.menubarContainer.append(this.menubarElement);
        
        //Other elements

        this.moveToUserLocationButton = $('#moveToUserLocationButton');
        //this.mapTypeButton = $('.mapTypeButton');

        // Link Plan menus
        /*****************/
        this.planNameInputElement = $("#planNameElement");
        this.planSharedInputElement = $("#planSharedElement");
        this.savePlanButton2 = $("#savePlanButton2");
        
        this.newPlanButton = $("#newPlanButton");
        this.savePlanButton = $('#savePlanButton');
        this.savePlanCopyButton = $("#savePlanCopyButton");

        this.userPlanListElement = $("#userPlanListElement");
        this.sharedPlanListElement = $("#sharedPlanListElement");

        //events
        this.onNewPlan = new MulticastEvent(this,'onNewPlan');
        this.onSavePlan = new MulticastEvent(this,'onSavePlan');
        this.onSavePlanCopy = new MulticastEvent(this,'onSavePlanCopy');
        this.onLoadPlan = new MulticastEvent(this,'onLoadPlan');
        this.onDeletePlan = new MulticastEvent(this,'onDeletePlan');
        
        //UI event bindings
        this.newPlanButton.click( ()=> {this.onNewPlan.callEvent();} );

        this.savePlanButton.click( () => {
            this.linkPlanManager.activeLinkPlan.displayName = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlan.callEvent(this.linkPlanManager.activeLinkPlan);
        });
        this.savePlanButton2.click( () => {
            this.linkPlanManager.activeLinkPlan.displayName = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlan.callEvent(this.linkPlanManager.activeLinkPlan);
        });
        this.savePlanCopyButton.click( ()=> {
            this.linkPlanManager.activeLinkPlan.displayName = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlanCopy.callEvent(this.linkPlanManager.activeLinkPlan);
        });

    }

    initialize({mapManager, linkPlanManager}) {
        this.mapManager = mapManager;
        this.linkPlanManager = linkPlanManager;

        this.moveToUserLocationButton.click(() =>{ this.mapManager.moveToUserLocation() });
        //this.mapTypeButton.click(function (A, B) { self.mapManager.setMapType($(this).attr("value")); });

        //Event bindings
        this.onNewPlan.push( ()=> {this.linkPlanManager.createNewLinkPlan()});
        this.onSavePlan.push( () => {this.linkPlanManager.saveLinkPlan()} );
        this.onSavePlanCopy.push( () => {
            this.linkPlanManager.activeLinkPlan._id = null;
            this.linkPlanManager.activeLinkPlan.ownerId = null;
            this.linkPlanManager.saveLinkPlan();
        });
        this.onLoadPlan.push( (linkPlanId) => { this.linkPlanManager.loadLinkPlan(linkPlanId); });
        this.onDeletePlan.push( (linkPlanId) => { this.linkPlanManager.deleteLinkPlan(linkPlanId); });
        //var mapId = Utility.getUrlParameter('mapId');
        //if (mapId) this.loadPlanFromUuid({uuid: mapId});
    }

    show () { this.menubarElement.css('display','flex'); }
    hide() { this.menubarElement.css('display','none'); }

    setPlanNameList( planNameList ) {
        Utility.debugMessage("Setting Plan Names", 0);

        $(".planListMenuElement").remove();

        planNameList.forEach( (planNameObject)=> {
            let menuElement;
            if (planNameObject.ownerId == Meteor.userId()) menuElement = this.userPlanListElement;
            else menuElement = this.sharedPlanListElement;

            let deleteElement = $("<i class='icon minus square'></i></div>");

            let containerElement = $("<div class='ui item planListMenuElement' style='display:flex;'>" +
                "<span style='flex:1'>" + planNameObject.displayName + "</span></div>");

            deleteElement.click( () => { this.onDeletePlan.callEvent(planNameObject._id); });

            containerElement.click((event) => {
                if (event.target == deleteElement[0]) return;
                this.onLoadPlan.callEvent(planNameObject._id);
            });

            containerElement.append(deleteElement);
            containerElement.insertAfter(menuElement);
        });
    }

    setActivePlan(linkPlan) {
        this.planNameInputElement.val(linkPlan.displayName);
        this.planSharedInputElement.prop("checked", linkPlan.isPublic);
    }
};