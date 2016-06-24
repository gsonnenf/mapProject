/**
 * Created by Greg on 5/21/2016.
 */

import './utility.js';
import './mapmanager.js';
import './portalui.js';

LinkPlanUi = class LinkPlanUi {
    constructor() {
        this.lineLayerName = "LinkPlanLineLayer";
        this.lineList = null;
        this.lineIndexCounter = 0;
        this.drawLinesModeActive = false;

        this.lineLayerStyle = {
            color: '#f2c805',
            width: 3
        };

        //Events
        this.onDrawLinesBetweenPortals = [];
        this.onRemoveLine = [];
    }

    initialize({mapManager, portalUi}) {

        this.mapManager = mapManager;
        this.portalUi = portalUi;

        this.geoJsonLine = this.mapManager.addLineList({
            layerName: this.lineLayerName,
            lineSetList: [],
            propertiesList: [],
            lineStyle: this.lineLayerStyle
        });


        /************************************************
         * UI EVENT BINDINGS
         ***********************************************/

        this.mapManager.onLayerEvent({
            layerName: this.lineLayerName,
            event: MapManager.Event.LeftClick,
            callback:  (features) => { this.lineLayerClick(features); }
        });
        
        this.mapManager.setCursorOnLayerHover({layerName: [ this.lineLayerName ] });

        //Event Bindings
        this.onDrawLinesBetweenPortals.push( ({portal1, portal2}) => { Utility.debugMessage("onDrawLinesBetweenPortals called"); });
        this.portalUi.onPortalClick.push( (portal) => { if (this.drawLinesModeActive == true) this.drawLinesClickHandler(portal); });
    }
    
    /************************
     Click handlers
     ***************************/

    lineLayerClick(features) {
        if (this.drawLinesModeActive == false) return;
        var lineId = null;
        //TODO: only remove line if portal is not being clicked on.
        if (features.length > 0) for (var feature of features) this.removeLine(feature.properties.lineIndex);
    }

    /**
     * drawLinesClickHandler: Draws lines between the this.selectedPortal and the parameter portal.
     * @param portal - The portal to draw lines too.
     */
    drawLinesClickHandler(portal) {
        if (portal == null) return;
        if (this.portalUi.selectedPortal == null) { Utility.debugMessage("Error attempting to create lines with no base portal"); return; }
        if (this.portalUi.selectedPortal == portal) { Utility.debugMessage("Base portal same as next portal"); return; }
        this.addLine({portal1: this.portalUi.selectedPortal, portal2: portal});
    }
    
    addLine({portal1, portal2 }) {
        //returns if line is a duplicate
        for(let index in this.lineList) {
            var element = this.lineList[index];
            if ((portal1.guid == element['portal1'].guid) &&  (portal2.guid == element['portal2'].guid)
                || (portal2.guid == element['portal1'].guid) &&  (portal1.guid == element['portal2'].guid)){
                Utility.debugMessage("Duplicate Lines detected.");
                return;
            };
        }

        var lineIndex = this.lineIndexCounter++;
        var line = {portal1: portal1, portal2: portal2};
        this.lineList[lineIndex] = line;

        this.mapManager.addLineToFeatureCollectionLayer({
            layerName: this.lineLayerName,
            lineSet: [portal1.getPoint(), portal2.getPoint()],
            properties: { lineIndex: lineIndex },
            geoJsonLineFeatureCollection: this.geoJsonLine
        });

        for (let index in this.onDrawLinesBetweenPortals) this.onDrawLinesBetweenPortals[index]({portal1: portal1, portal2: portal2});
    }

    removeLine( lineIndex ) {
        this.mapManager.removeLineFromFeatureCollectionLayer({
            layerName: this.lineLayerName,
            properties: { lineIndex: lineIndex },
            geoJsonFeatureCollection:this.geoJsonLine
        });

        delete this.lineList[lineIndex];
        for (let index in this.onRemoveLine) this.onRemoveLine[index](lineIndex);
    }
    
    setLineList( lineList ) {
        this.lineIndexCounter = 0;
        this.lineList = lineList;

        var lineSetList = [];
        var propertiesList = [];

        for( let index in lineList) {
            var line = lineList[index];
            var lineIndex = this.lineIndexCounter++;
            this.lineList[lineIndex] = line;

            lineSetList.push([line.portal1.getPoint(), line.portal2.getPoint()]);
            propertiesList.push({lineIndex: lineIndex});
        }

        this.mapManager.replaceLineListInFeatureCollectionLayer({
            layerName: this.lineLayerName,
            lineSetList: lineSetList,
            propertiesList: propertiesList,
            geoJsonFeatureCollection: this.geoJsonLine});
    }
    
    getLinesConnectedToPortal( portal ) {
        var portalLineList = [];
        for (let index in this.lineList) {
            var line = this.lineList[index];
            if (line.portal1 == portal || line.portal2 == portal) portalLineList[index] = line;
        }
        return portalLineList;
    }
};