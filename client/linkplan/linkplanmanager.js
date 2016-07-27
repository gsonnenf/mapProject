/**
 * Created by Greg on 3/16/2016.
 */
;
import {MulticastEvent} from "/common/lib/chimerapatterns"
import '/common/collection/linkplan.js'
import './linkplanui';
import {LinkPlanMenubar} from './linkplanmenubar'
import {LinkPlanToolBar} from './linkplantoolbar'
import {LinkPlanDbMeteor} from './linkplandbmeteor'
import {PortalUi} from './portalui'
import {LinkPlanUi} from './linkplanui'
import {PortalDisplayUi} from './portaldisplayui'
import {MapSelectorTool} from './mapselectortool'


export class LinkPlanManager {
    constructor(){
        this.isInitialized = false;
        this.onLinkPlanChanged = new MulticastEvent(this, 'onLinkPlanChanged');
    }

    initialize({mapManager, portalDb}) {
        if (this.isInitialized == true) return;
        this.isInitialized = true;
        this.mapManager  = mapManager;
        this.portalDb = portalDb;
        this.linkPlanMenubar = new LinkPlanMenubar();

        this.linkPlanDb = new LinkPlanDbMeteor({portalDb: portalDb});
        this.portalUi = new PortalUi();

        this.linkPlanUi = new LinkPlanUi();
        this.portalDisplayUi = new PortalDisplayUi();
        this.mapSelectorTool = new MapSelectorTool();
        this.toolBar = new LinkPlanToolBar({linkPlanManager: this});
        
        //ingressLayerManager = new IngressLayerManager({mapManager: mapManager});
        //ingressLayerManager.initializeLayers();
        
        this.linkPlanMenubar.initialize({mapManager: mapManager, linkPlanManager: this});
        this.portalUi.initialize({mapManager: mapManager, portalDb: portalDb});
        this.linkPlanUi.initialize({mapManager: mapManager, portalUi: this.portalUi});
        this.portalDisplayUi.initialize({linkPlanManager:this});
        this.mapSelectorTool.initialize({mapManager: mapManager, portalDb: portalDb});
        this.createNewLinkPlan();

        //Binds Menubar Link plan menu to db
        this.linkPlanMenubar.setPlanNameList( this.linkPlanDb.getLinkPlanNameList() );
        this.linkPlanDb.onLinkPlanAdded.push( ()=>{ this.linkPlanMenubar.setPlanNameList( this.linkPlanDb.getLinkPlanNameList() )});
        this.linkPlanDb.onLinkPlanRemoved.push( ()=>{ this.linkPlanMenubar.setPlanNameList( this.linkPlanDb.getLinkPlanNameList() )});
    }

    createNewLinkPlan() {
        this.activeLinkPlan = new LinkPlanModel();
        this.linkPlanUi.setLineList( this.activeLinkPlan.lineList );
        this.toolBar.setAnchorList( this.activeLinkPlan.anchorList );
        this.linkPlanMenubar.setActivePlan(this.activeLinkPlan);
        this.linkPlanDb.setActiveLinkPlan(this.activeLinkPlan);
        this.onLinkPlanChanged.callEvent({linkPlan: this.activeLinkPlan});
    }

    loadLinkPlan( id ) {
        this.activeLinkPlan = this.linkPlanDb.getLinkPlan(id);
        this.linkPlanUi.setLineList( this.activeLinkPlan.lineList );
        this.toolBar.setAnchorList( this.activeLinkPlan.anchorList );
        this.linkPlanMenubar.setActivePlan(this.activeLinkPlan);
        this.linkPlanDb.setActiveLinkPlan(this.activeLinkPlan);
        this.onLinkPlanChanged.callEvent({linkPlan: this.activeLinkPlan});
    }

    saveLinkPlan() {
        if (!this.activeLinkPlan) Utility.throwErrorMessage({title: "Error", message: "Link plan is null."});
        if (this.activeLinkPlan._id) this.linkPlanDb.updateLinkPlan( this.activeLinkPlan );
        else this.linkPlanDb.insertLinkPlan( this.activeLinkPlan );
    }

    deleteLinkPlan(linkPlanId) {
        //TODO: close link plan if it is current link plan.
        this.linkPlanDb.deleteLinkPlan(linkPlanId);
    }
    
    hide() {
        this.toolBar.hide();
        this.portalDisplayUi.hide();
        this.linkPlanMenubar.hide();
    }
    
    show() {
        this.toolBar.show();
        this.mapManager.map.resize();
        this.linkPlanMenubar.show();
    }
}
