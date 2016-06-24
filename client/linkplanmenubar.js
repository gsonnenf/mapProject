/**
 * Created by Greg on 4/7/2016.
 */

LinkPlanMenubar = class LinkPlanMenubar {
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
        this.onNewPlan = new Utility.MulticastEvent();
        this.onSavePlan = new Utility.MulticastEvent();
        this.onSavePlanCopy = new Utility.MulticastEvent();
        this.onLoadPlan = new Utility.MulticastEvent();
        this.onDeletePlan = new Utility.MulticastEvent();


        //UI event bindings
        this.newPlanButton.click( ()=> {this.onNewPlan.callEvents();} );

        this.savePlanButton.click( () => {
            this.linkPlanManager.activeLinkPlan.name = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlan.callEvents(this.linkPlanManager.activeLinkPlan);
        });
        this.savePlanButton2.click( () => {
            this.linkPlanManager.activeLinkPlan.name = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlan.callEvents(this.linkPlanManager.activeLinkPlan);
        });

        this.savePlanCopyButton.click( ()=> {
            this.linkPlanManager.activeLinkPlan.name = this.planNameInputElement.val();
            this.linkPlanManager.activeLinkPlan.shared = this.planSharedInputElement.prop("checked");
            this.onSavePlanCopy.callEvents(this.linkPlanManager.activeLinkPlan);
        });

    }

    initialize({mapManager, linkPlanManager}) {
        var self = this;
        this.mapManager = mapManager;
        this.linkPlanManager = linkPlanManager;

        this.moveToUserLocationButton.click(() =>{ this.mapManager.moveToUserLocation() });
        //this.mapTypeButton.click(function (A, B) { self.mapManager.setMapType($(this).attr("value")); });

        //Event bindings
        this.onNewPlan.push( ()=> {this.linkPlanManager.createNewLinkPlan()});
        this.onSavePlan.push( (activeLinkPlan) => {this.linkPlanManager.saveLinkPlan()} );
        this.onSavePlanCopy.push( (activeLinkPlan) => {
            this.linkPlanManager.activeLinkPlan._id = null;
            this.linkPlanManager.activeLinkPlan.userId = null;
            this.linkPlanManager.saveLinkPlan();
        });
        this.onLoadPlan.push( (linkPlanId) => { this.linkPlanManager.loadLinkPlan(linkPlanId); });
        this.onDeletePlan.push( (linkPlanId) => { this.linkPlanManager.deleteLinkPlan(linkPlanId); });
        //var mapId = Utility.getUrlParameter('mapId');
        //if (mapId) this.loadPlanFromUuid({uuid: mapId});
    }

    setPlanNameList( planNameList ) {
        Utility.debugMessage("Setting Plan Names",0);

        $(".planListMenuElement").remove();
        for(let index in planNameList) {
            let planNameObject = planNameList[index];
            let menuElement;
            if (planNameObject.userId == Meteor.userId()) menuElement = this.userPlanListElement;
            else menuElement = this.sharedPlanListElement;


            let deleteElement = $("<i class='icon minus square'></i></div>");

            let containerElement = $("<div class='ui item planListMenuElement' style='display:flex;'>" +
                "<span style='flex:1'>" + planNameObject.name + "</span></div>");
            
            deleteElement.click( () => {
                this.onDeletePlan.callEvents(planNameObject._id);
            });

            containerElement.click( (event) => {
                if (event.target == deleteElement[0]) return;
                this.onLoadPlan.callEvents(planNameObject._id);
            });

            containerElement.append(deleteElement);
            containerElement.insertAfter(menuElement);
        }
    }

    setActivePlan(linkPlan) {
        this.planNameInputElement.val(linkPlan.name);
        this.planSharedInputElement.prop("checked", linkPlan.shared);
    }

    show () { this.menubarElement.css('display','flex'); }

    hide() { this.menubarElement.css('display','none'); }

};