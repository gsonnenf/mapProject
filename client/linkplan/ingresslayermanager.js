/**
 * Created by Greg on 4/6/2016.
 */

export function IngressLayerManager({mapManager}) {

    var frameSwapButtonToggleState = 0;
    $("#frameSwapButton").click(function () {
        if (frameSwapButtonToggleState == 0) {
            frameSwapButtonToggleState = 1;
            $('#frameID').css('z-index', "1000");
        }
        else {
            frameSwapButtonToggleState = 0;
            $('#frameID').css('z-index', "-1000");
        }
    });


    var self = this;
    this.mapManager = mapManager;
    //this.markerLayerName = "ExplorerMarkerLayer";
    //this.markerHighlightLayerName = "ExplorerMarkerHighlightLayer";
    this.lineLayerBlueName = "lineLayerBlue";
    this.lineLayerGreenName = "lineLayerGreen";

    this.lineLayerBlueStyle = {
        color:'#0000ff',
        width: 2
    };

    this.lineLayerGreenStyle = {
        color:'#33cc33',
        width: 2
    };

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    self.blueLineIdCounter = 0;
    self.blueLineList = [];
    self.isMapLoaded = false;
    // Listen to message from child window
    eventer(messageEvent,function(e) {
        var origin = e.origin || e.originalEvent.origin;

        if (origin !== "https://www.ingress.com/intel") return;
        console.log("eventer:" + e.data);
        var pointSet = JSON.parse(e.data);

        var point1 = [pointSet[0].lng,pointSet[0].lat];
        var point2 = [pointSet[1].lng,pointSet[1].lat];

        self.blueLineList.push([point1, point2]);
        if (!self.isMapLoaded) return; //Will draw on load event
        self.mapManager.addLineToFeatureCollectionLayer({
            layerName: self.lineLayerBlueName,
            lineSet: [point1, point2],
            properties: {id: self.blueLineIdCounter++},
            geoJsonLineFeatureCollection: self.geoJsonLineBlue
        });
    },false);

};

IngressLayerManager.prototype.initializeLayers = function () {
    var self = this;
    self.isMapLoaded = true;

    self.geoJsonLineBlue = self.mapManager.addLineList({
        layerName: self.lineLayerBlueName,
        lineSetList: [],
        propertiesList: [],
        lineStyle: self.lineLayerBlueStyle
    });

    self.geoJsonLineGreen = self.mapManager.addLineList({
        layerName: self.lineLayerGreenName,
        lineSetList: [],
        propertiesList: [],
        lineStyle: self.lineLayerGreenStyle
    });

    for (let element of self.blueLineList) {
        self.mapManager.addLineToFeatureCollectionLayer({
            layerName: this.lineLayerBlueName,
            lineSet: element,
            properties: {id: self.blueLineIdCounter++},
            geoJsonLineFeatureCollection: this.geoJsonLineBlue
        });
    }


};

