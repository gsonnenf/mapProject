/**
 * Created by Greg on 4/9/2016.
 */

MapSelectorTool = class MapSelectorTool {
    constructor() {
        this.selectBoxLayerName = "selectBoxLayer";
        this.selectBoxHighlightName = "selectBoxHighlightLayer";

        this.boundingBoxModeActive = false;
        this.updateDrawBoxEventTracker = (e) => { this.updateDrawBox(e); };
        this.lineLayerStyle = {
            color: '#000',
            width: 1
        };

        this.onSelectionComplete = new Utility.MulticastEvent();
    }

    initialize({mapManager, portalDb}) {
        this.mapManager = mapManager;
        this.portalDb = portalDb;

        this.geoJsonLine = this.mapManager.addLineList({
            layerName: this.selectBoxLayerName,
            lineSetList: [],
            propertiesList: [],
            lineStyle: this.lineLayerStyle
        });
        this.mapManager.onEvent({
            event: MapManager.Event.MouseDown,
            callback:(e) => { this.beginDrawBoxCallback(e); }
        });
        this.mapManager.onEvent({
            event: MapManager.Event.MouseUp,
            callback: (e) =>{ this.endDrawBoxCallback(e); }
        });
    }

    setBoundingBoxModeActive( isActive ) {
        if (isActive) {
            this.boundingBoxModeActive = true;
            this.mapManager.map.dragPan.disable();
            //this .mapManager.map.touchZoom.disable();
            //this.mapManager.map.scrollWheelZoom.disable();
            //this.mapManager.map.keyboard.disable();
        }
        else {
            this.mapManager.map.dragPan.enable();
            this.boundingBoxModeActive = false;
        }
    }

    beginDrawBoxCallback(event) {
        if (this.boundingBoxModeActive == false) return;
        this.startLngLat = event.lngLat;
        this.endLngLat = event.lngLat;

        this.mapManager.onEvent({
            event: MapManager.Event.MouseMove,
            callback: this.updateDrawBoxEventTracker
        });
    }

    endDrawBoxCallback(e) {
        if (this.boundingBoxModeActive == false) return;
        this.mapManager.removeEvent({
            event: MapManager.Event.MouseMove,
            callback: this.updateDrawBoxEventTracker
        });
        if (this.startLngLat == this.endLngLat) {
            this.geoJsonLine.data.features = [];
            this.mapManager.updateFeatureCollectionLayer({
                layerName: this.selectBoxLayerName,
                geoJsonFeatureCollection: this.geoJsonLine
            });
        }

        var portals = this.portalDb.queryPortalsInBoundingBox({latLng1: this.startLngLat, latLng2: this.endLngLat});
        console.log(portals);
        Utility.standardMessage({title: "Portals Selected", message: portals.length + " portals selected."});
        this.onSelectionComplete.callEvents(portals);

    };

    updateDrawBox(event) {

        this.endLngLat = event.lngLat;

        var lineSet = [];
        lineSet.push([this.startLngLat.lng, this.startLngLat.lat]);
        lineSet.push([event.lngLat.lng, this.startLngLat.lat]);
        lineSet.push([event.lngLat.lng, event.lngLat.lat]);
        lineSet.push([this.startLngLat.lng, event.lngLat.lat]);
        lineSet.push([this.startLngLat.lng, this.startLngLat.lat]);

        this.geoJsonLine.data.features = [];

        this.mapManager.addLineToFeatureCollectionLayer({
            layerName: this.selectBoxLayerName,
            lineSet: lineSet,
            properties: {id: 0},
            geoJsonLineFeatureCollection: this.geoJsonLine
        });
        //console.log(event);
    };

    queryPortals() {

    }
};