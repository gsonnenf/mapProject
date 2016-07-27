/**
 * Created by Greg on 3/22/2016.
 */
import {MulticastEvent} from '/common/lib/chimerapatterns'
import "/client/lib/utility/notification"

export class PortalDisplayUi {
    constructor() {

        this.portalInfoBox = $('#portalDisplayInfoBox');
        this.portalImageElement = $("#sideBarPortalImage");
        this.portalNameElement = $("#sideBarPortalName");
        this.portalLatElement = $("#sideBarPortalLat");
        this.portalLngElement = $("#sideBarPortalLng");
        this.portalGuidElement = $("#sideBarPortalGuid");

        this.portalLineDisplay = $('#sidebarPortalLineDisplay');
        this.hideSideBarElement = $('#hideSidebarElement');
        this.sideBarElement = $('#portalDisplaySideBarElement');

        this.activePortal = null;

        this.sideBarElement
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('setting', 'dimPage', false)
            .sidebar('setting', 'closable', false);

        this.hideSideBarElement.click(() => { this.hide() });
        this.sideBarElement.click( (event )=> { if (event.target.id == "portalDisplaySideBarElement") this.hide(); });
        //Events
        this.onLineDelete = new MulticastEvent(this,'onLineDelete');

    }

    initialize({linkPlanManager}) {
        this.linkPlanManager = linkPlanManager;

        //Event bindings

        this.linkPlanManager.portalUi.onPortalHighlight.push( (portal, isHighlighted) => {
            if (!isHighlighted){this.clearPortalDisplay(); return;}
            this.displayPortal(portal);
        });

        this.onLineDelete.push( (lineId) => { Utility.debugMessage("onLineDelete fired for lineId:" + lineId) });
        this.onLineDelete.push( (lineId) => { this.linkPlanManager.linkPlanUi.removeLine(lineId); });
        this.linkPlanManager.linkPlanUi.onRemoveLine.push(() =>{ this.displayLineListForActivePortal(); });
        this.linkPlanManager.linkPlanUi.onDrawLinesBetweenPortals.push( () => { this.displayLineListForActivePortal(); });
    }

    show() { this.sideBarElement.sidebar('show'); }
    hide() { this.sideBarElement.sidebar('hide'); }

    clearPortalDisplay() {
        this.portalInfoBox.hide();
        this.portalImageElement.attr("src","");
        this.portalNameElement.text("No PortalModel Selected");
        this.portalLatElement.text("");
        this.portalLngElement.text("");
        this.portalGuidElement.text("");
        this.activePortal = null;
        this.portalLineDisplay.empty();
    }

    displayPortal(portal) {
        this.show();
        this.portalInfoBox.show();
        if (portal.imgUrl == null) portal.imgUrl= "";
        this.portalImageElement.attr("src",portal.imgUrl);
        this.portalNameElement.text(portal.name);
        this.portalLatElement.text(portal.lat);
        this.portalLngElement.text(portal.lng);
        this.portalGuidElement.text(portal.guid);
        this.activePortal = portal;
        this.displayLineListForActivePortal();
    };

    displayLineListForActivePortal() { this.displayLineListForPortal( this.activePortal ); }

    displayLineListForPortal( portal ) { this.displayLineList( portal, this.linkPlanManager.linkPlanUi.getLinesConnectedToPortal(portal) ); }

    displayLineList( portal, portalLineList ) {
        this.portalLineDisplay.empty();
        for (let index in portalLineList) {
            let element = portalLineList[index];
            var name = (portal.name == element.portal1.name) ? element.portal2.name : element.portal1.name;
            this.portalLineDisplay.append(
                '<div class="ui raised segment"><span>'
                + name + '</span> <span style="float:right;">' +
                '<i class="remove circle icon removeportallink" portalIndex="'+index +'"></i></span></div>'
            );
        }

        $('.removeportallink').click( (eventObject) => {
            var lineId = parseInt($(eventObject.target).attr('portalIndex'));
            this.onLineDelete.callEvent(lineId);
        });
    };
};