/**
 * Created by Greg on 3/16/2016.
 */
import '../common/model_linkplan.js';
import './linkplanui';

LinkPlanManager = class LinkPlanManager {
    constructor(){
        this.isInitialized = false;
        this.onLinkPlanChanged = new Utility.MulticastEvent(['linkPlan']);
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
        this.toolBar = new Toolbar({linkPlanManager: this});

        //mapSelectorTool = new MapSelectorTool({mapManager: mapManager, portalManager: portalManager});
        //mapSelectorTool.initializeLayers();
        //ingressLayerManager = new IngressLayerManager({mapManager: mapManager});
        //ingressLayerManager.initializeLayers();
        
        this.linkPlanMenubar.initialize({mapManager: mapManager, linkPlanManager: this});
        this.portalUi.initialize({mapManager: mapManager, portalDb: portalDb});
        this.linkPlanUi.initialize({mapManager: mapManager, portalUi: this.portalUi});
        this.portalDisplayUi.initialize({linkPlanManager:this});
        this.mapSelectorTool.initialize({mapManager: mapManager, portalDb: portalDb});
        this.linkPlanList = this.linkPlanDb.fetchLinkPlanList();
        this.createNewLinkPlan();


        //Binds Menubar Link plan menu to db
        this.linkPlanMenubar.setPlanNameList( this.linkPlanDb.fetchLinkPlanNameList() );
        this.linkPlanDb.onLinkPlanNameListChanged.push( ()=>{ this.linkPlanMenubar.setPlanNameList( this.linkPlanDb.fetchLinkPlanNameList() )});

    }

    createNewLinkPlan() {
        this.activeLinkPlan = new LinkPlanModel();
        this.linkPlanUi.setLineList( this.activeLinkPlan.lineList );
        this.toolBar.setAnchorList( this.activeLinkPlan.anchorList );
        this.linkPlanMenubar.setActivePlan(this.activeLinkPlan);
        this.linkPlanDb.setActiveLinkPlan(this.activeLinkPlan);
        this.onLinkPlanChanged({linkPlan: this.activeLinkPlan});
    }

    loadLinkPlan( id ) {
        var plan = this.linkPlanDb.fetchLinkPlan(id);
        this.activeLinkPlan = plan;
        this.linkPlanUi.setLineList( this.activeLinkPlan.lineList );
        this.toolBar.setAnchorList( this.activeLinkPlan.anchorList );
        this.linkPlanMenubar.setActivePlan(this.activeLinkPlan);
        this.linkPlanDb.setActiveLinkPlan(this.activeLinkPlan);
        this.onLinkPlanChanged({linkPlan: this.activeLinkPlan});
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
};
