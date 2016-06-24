/**
 * Created by Greg on 5/22/2016.
 */

import './mapmanager.js'

PortalUi = class PortalUi {

    constructor() {

        this.markerLayerName = "PortalLayer";
        this.markerHighlightLayerName = "PortalHighlightLayer";
        this.selectPortalModeActive = true;
        
        //Styles
        this.markerLayerStyle = { color: '#778c94', radius: 7 };
        this.markerHighlightStyle = { color: '#3a469f', radius: 10 };

        //Events
        this.onPortalClick = [];
        this.onPortalHighlight = [];
    }

    initialize({ mapManager, portalDb }) {
        this.mapManager = mapManager;
        this.portalDb = portalDb;
        var pointList = [];
        var propertiesList = [];

        if (portalDb.isReady) {
            Utility.successMessage({ title:"Portals", message:"Portal Cache is recent." });
            this.drawPortals();
        }

        else {
            Utility.standardMessage({
                title:"Please Wait",
                message:"Updated Portal list is being downloaded. This will take several seconds."
            });
            portalDb.onReady.push( ()=>{
                Utility.successMessage({title:"SUCCESS",message:"Portal download has finished."});
                this.drawPortals();
            });
        }
    }
    drawPortals(){
        var self = this;
        var pointList = [];
        var propertiesList = [];
        //repacks portal data to type expected by mapManager
        for(let portal of self.portalDb.portalList) {
            pointList.push( portal.getPoint() );
            propertiesList.push({
                guid: portal.guid,
                name: portal.name
            });
        }

        this.geoJsonPortal = self.mapManager.addMarkers({
            layerName: self.markerLayerName,
            pointList: pointList,
            propertiesList: propertiesList,
            markerStyle : self.markerLayerStyle
        });

        this.geoJsonPortalHighlight = self.mapManager.addMarkers({
            layerName: self.markerHighlightLayerName,
            pointList: [],
            propertiesList: [],
            markerStyle : self.markerHighlightStyle
        });

        /************************************************
         * UI EVENT BINDINGS
         ***********************************************/

        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        // Changes cursor when hovering over feature
        self.mapManager.setCursorOnLayerHover({layerName: [self.markerLayerName ] });

        //adds popup when hovering over portal
        self.mapManager.onLayerEvent({
            layerName: self.markerLayerName,
            event: MapManager.Event.MouseMove,
            callback: function (features) {
                if (!features.length) {
                    popup.remove();
                    return;
                }
                var feature = features[0];
                popup.setLngLat(feature.geometry.coordinates)
                    .setText(feature.properties.name)
                    .addTo(self.mapManager.map);
            }
        });

        // left click event
        this.mapManager.onLayerEvent({
            layerName: self.markerLayerName,
            event: MapManager.Event.LeftClick,
            callback: function (features) { self.portalLayerClick(features); }
        });

        // always highlights a portal on right click
        self.mapManager.onLayerEvent({
            layerName: self.markerLayerName,
            event: MapManager.Event.RightClick,
            callback: function (features, eventData) {
                if (features.length == 0) return;
                var portal = self.portalDb.getPortalById(features[0].properties.guid);
                if (portal == this.selectedPortal) return;
                for (let callback of self.onPortalClick) callback(portal, true);
                self.selectPortalClickHandler(portal);
            }
        });

        //Event Bindings
        //this.onPortalClick.push( (portal) => { Utility.debugMessage("onPortalClick called."); });
        this.onPortalClick.push( (portal) => { if (this.selectPortalModeActive == true) this.selectPortalClickHandler(portal); });

    }
    
    portalLayerClick(features) {
        var portal = null;
        //console.log(features);
        if (features.length > 0) for (var feature of features) portal = this.portalDb.getPortalById(feature.properties.guid);

        if (portal) for (let index in this.onPortalClick) this.onPortalClick[index](portal);
        else if (this.selectPortalModeActive == true) {
            if (this.selectedPortal != null) this.portalHighlight(this.selectedPortal,false);
            this.selectedPortal = null;
            return;
        }
    };

    /**
     * selectPortalClickHandler: Sets this.selectedPortal and highlights the portal. Will also unselected
     * this.selectedPortal if one is already set.
     * @param portal
     */
    selectPortalClickHandler(portal){
        Utility.debugMessage("selectPortalClickHandlerCalled");

        //Unhighlights portal if portal is already selected.
        if (this.selectedPortal == portal) {
            this.portalHighlight(portal, false);
            this.selectedPortal = null;
            return;
        }
        //Unhighlights currently selected portal, highlights newly selected portal.
        if (this.selectedPortal != null) this.portalHighlight(this.selectedPortal,false);
        this.selectedPortal = portal;
        this.portalHighlight(portal,true);
        return;
    }

    /**
     * portalHighlight: Will add or remove a visual portal highlighting to the selected portal.
     * @param portal
     * @param isHighlighted
     */
    portalHighlight(portal, isHighlighted) {
        if (isHighlighted == true) {
            this.mapManager.addMarkerToFeatureCollectionLayer({
                layerName: this.markerHighlightLayerName,
                point: portal.getPoint(),
                properties: { guid: portal.guid },
                geoJsonFeatureCollection: this.geoJsonPortalHighlight
            });
            for (let callback of this.onPortalHighlight) callback(portal, true);
        }

        if (isHighlighted == false) {
            this.mapManager.removeMarkerFromFeatureCollectionLayer({
                layerName: this.markerHighlightLayerName,
                properties: {guid: portal.guid},
                geoJsonFeatureCollection: this.geoJsonPortalHighlight
            });
            for (let callback of this.onPortalHighlight) callback(portal , false);
        }
    }
}
