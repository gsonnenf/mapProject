/**
 * Created by Greg on 2/12/2016.
 */

export function MapManager() {

    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
    });

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Nvbm5lbmYiLCJhIjoiY2lrazFybW9pMDl0b3VjajczMTduY296dyJ9.F1hb5WbtxyTsq1n3LRt1lA';

    this.lastUserLocation = [0,0];

    this.map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
        //center: [-74.50, 40], // starting position
        //zoom: 15 // starting zoom
    });

    this.map.doubleClickZoom.disable();
};

MapManager.prototype.EnumMapType = {
    basic: 'basic',
    streets: 'streets',
    emerald: "emerald",
    bright: "bright",
    light: "light",
    dark: "dark",
    satellite: "satellite"
};

/**
 *
 * @param enumMapTypeElement
 */
MapManager.prototype.setMapType = function( enumMapTypeElement ) {
    this.map.setStyle('mapbox://styles/mapbox/' + enumMapTypeElement + '-v8');
};

/**
 *
 * @param callback
 */
MapManager.prototype.getUserLocation = function ( callback ) {
    var self = this;
    self.userLocationUpdated = false;
    var internalCallback = function (position) {
        self.userLocationUpdated = true;
        self.lastUserLocation = [position.coords.longitude, position.coords.latitude];
        callback(position);
    };
    navigator.geolocation.getCurrentPosition(internalCallback);
};

/**
 *
 * @param coords
 * @param zoom
 */
MapManager.prototype.moveToLocation = function (coords, zoom) {
    this.map.flyTo({center: coords, zoom: zoom});
};

/**
 *
 * @param callback
 */
MapManager.prototype.moveToUserLocation = function ( callback ) {
    var self = this;
    self.getUserLocation( function (position) {
        self.map.flyTo({center: self.lastUserLocation, zoom: 14});
        if (callback != null) callback(position);
    });
};

/**
 *
 */
MapManager.prototype.addGpsLocation = function () {

};

/**
 *
 */
MapManager.prototype.showUserPosition = function () {

};

MapManager.Event = {};
MapManager.Event.RightClick = 'rightclick';
MapManager.Event.MouseMove = 'mousemove';
MapManager.Event.MouseDown = 'mousedown';
MapManager.Event.MouseUp = 'mouseup';
MapManager.Event.LeftClick = 'click';
MapManager.Event.DoubleClick = 'dblclick';
MapManager.Event.DragStart = 'dragstart';
MapManager.Event.Drag = 'drag';
MapManager.Event.DragEnd = 'dragend';
/**
 * Wrapper function for mouse events on layers.
 * @param layerName
 * @param event
 * @param callback
 */

MapManager.prototype.onEvent = function ({ event, callback}) {
    var self = this;
    if (event == "rightclick"){
        self.map.on('mousedown', function (e) {
            if (e.originalEvent.button != 2) return;
            callback(e);
        });
    }
    else
        self.map.on(event, callback);
};

MapManager.prototype.removeEvent = function ({event, callback}) {
    this.map.off(event,callback); //TODO: Fix for 'rightclick;. Does not work with the rightclick hack in onEvent.
};

MapManager.prototype.onLayerEvent = function ({layerName, event, callback}) {
    var self = this;
    if (typeof layerName === 'string') layerName = [ layerName ];
    if (event == "rightclick"){
        self.map.on('mousedown', function (e) {
            if (e.originalEvent.button != 2) return;
            var features = self.map.queryRenderedFeatures(e.point, { layers: layerName });
            callback(features);
        });
    }
    else {
        self.map.on(event, function (e) {
            var features = self.map.queryRenderedFeatures(e.point, {layers: layerName});
            callback(features);
        });
    }
};

MapManager.prototype.setCursorOnLayerHover = function ({ layerName }) {
    var self = this;
    self.onLayerEvent({
        layerName: layerName,
        event: MapManager.Event.MouseMove,
        callback: function (features) { self.map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''; }
    })
};

/****************************************/
/* Add and change lines
 ******************************************/

/**
 *
 * @param lineName
 * @param point1
 * @param point2
 * @param color
 */
MapManager.prototype.addLine = function ({ layerName, point1, point2, properties, lineStyle } ) {
    return this.addLineList({layerName: layerName, lineSetList: [[point1,point2]], propertiesList: [properties], lineStyle})
};

/**
 *
 * @param lineName
 * @param lineSetList
 * @param color
 */
MapManager.prototype.addLineList = function ( { layerName, lineSetList, propertiesList, lineStyle } ) {

    var geoJson = new MapManager.GeoJsonLineFeatureCollection( {lineSetList: lineSetList, propertiesList: propertiesList} );
    this.map.addSource(layerName, geoJson);
    this.map.addLayer( new MapManager.GeoJsonLineStyle({layerName: layerName, lineStyle: lineStyle}) );
    return geoJson;
};

MapManager.prototype.addLineToFeatureCollectionLayer = function({layerName, lineSet, properties, geoJsonLineFeatureCollection }) {
    geoJsonLineFeatureCollection.data.features.push( new MapManager.GeoJsonLine({ lineSet: lineSet, properties: properties }) );
    this.map.getSource(layerName).setData( geoJsonLineFeatureCollection.data );
};

MapManager.prototype.replaceLineListInFeatureCollectionLayer = function({layerName, lineSetList, propertiesList, geoJsonFeatureCollection }) {
    var featureList = [];
    for(let index in lineSetList)
        featureList.push( new MapManager.GeoJsonLine({ lineSet: lineSetList[index], properties: propertiesList[index] }) );
    geoJsonFeatureCollection.data.features = featureList;
    this.map.getSource(layerName).setData(geoJsonFeatureCollection.data);
};

MapManager.prototype.updateFeatureCollectionLayer = function ({layerName, geoJsonFeatureCollection}) {
    this.map.getSource(layerName).setData( geoJsonFeatureCollection.data );
};

MapManager.prototype.removeLineFromFeatureCollectionLayer = function( {layerName, properties, geoJsonFeatureCollection }) {
    var featureList = geoJsonFeatureCollection.data.features;
    var elementIndex = featureList.findIndex( function(feature) {
        for (let index in properties) if (feature.properties[index] != properties[index]) return false;
        return true;
    });
    if (elementIndex == -1) { console.log("Item was not found."); return; }

    geoJsonFeatureCollection.data.features.splice(elementIndex, 1);
    this.map.getSource(layerName).setData( geoJsonFeatureCollection.data );
};

/****************************************/
/* Add and change markers
 ******************************************/

MapManager.prototype.addMarker = function ({layerName, point, properties, markerStyle} ) {
    var geoJson = new MapManager.GeoJsonMarkerFeature({ point: point, properties: properties });
    this.map.addSource(layerName, geoJson);
    this.map.addLayer(new MapManager.GeoJsonMarkerStyle({layerName:layerName, markerStyle: markerStyle }));
    return geoJson;
};

/**
 *
 * @param markerCollectionName
 * @param markerList
 */
MapManager.prototype.addMarkers = function ({ layerName, pointList, propertiesList, markerStyle} ) {
    var geoJson = new MapManager.GeoJsonMarkerFeatureCollection( {pointList: pointList, propertiesList: propertiesList} );
    this.map.addSource(layerName, geoJson);
    this.map.addLayer( new MapManager.GeoJsonMarkerStyle({layerName:layerName, markerStyle: markerStyle }) );
    return geoJson;
};

MapManager.prototype.addMarkerToFeatureCollectionLayer = function({layerName, point, properties, geoJsonFeatureCollection }) {
    geoJsonFeatureCollection.data.features.push( new MapManager.GeoJsonMarker({ point: point, properties: properties }) );
    this.map.getSource(layerName).setData( geoJsonFeatureCollection.data );
};

MapManager.prototype.removeMarkerFromFeatureCollectionLayer = function( {layerName, properties, geoJsonFeatureCollection } ) {

    var featureList = geoJsonFeatureCollection.data.features;
    var elementIndex = featureList.findIndex( function(feature) {
        for (let index in properties) if (feature.properties[index] != properties[index]) return false;
        return true;
    });
    if (elementIndex == -1) { console.log("Item was not found."); return; }

    geoJsonFeatureCollection.data.features.splice(elementIndex, 1);
    this.map.getSource(layerName).setData( geoJsonFeatureCollection.data );
};


/**********************************************************************************************************************
GeoJSON generation methods for lines and markers.
 **********************************************************************************************************************/

MapManager.GeoJsonLineFeature = function ({pointSet, properties}) {
    this.type = "geojson";
    this.data = new MapManager.GeoJsonLine( { pointSet: pointSet, properties: properties });
};

MapManager.GeoJsonLineFeatureCollection = function ({lineSetList, propertiesList = []}) {
    this.type = "geojson";
    this.data = {};
    this.data.type = "FeatureCollection";
    this.data.features = [];
    for (let i in lineSetList)
        this.data.features.push( new MapManager.GeoJsonLine({lineSet: lineSetList[i],properties: propertiesList[i]}) );
};

MapManager.GeoJsonLine = function ({lineSet, properties}) {
    this.type = "Feature";
    this.geometry = {};
    this.geometry.type = "LineString";
    this.geometry.coordinates = lineSet;
    //"marker-symbol": "car"
    this.properties = properties;
};


MapManager.GeoJsonMarkerFeatureCollection = function ({pointList, propertiesList = []}) {
    this.type = "geojson";
    this.data = {};
    this.data.type = "FeatureCollection";
    this.data.features = [];
    for (let index in pointList)
        this.data.features.push( new MapManager.GeoJsonMarker( {point: pointList[index], properties: propertiesList[index]}) );
};

MapManager.GeoJsonMarkerFeature = function ({point, properties}) {
    this.type = "geojson";
    this.data = new MapManager.GeoJsonMarker({point: point, properties: properties});
};


MapManager.GeoJsonMarker = function ({point,properties}) {
    this.type = "Feature";
    this.geometry = {};
    this.geometry.type = "Point";
    this.geometry.coordinates = point;
    this.properties = properties;
};

MapManager.GeoJsonFeature = function (feature) {
    this.type = "geojson";
    this.data = feature;
};

MapManager.GeoJsonFeatureCollection = function (featureList) {
    this.type = "geojson";
    this.data = {};
    this.data.type = "FeatureCollection";
    this.data.features = featureList;
};


/**********************************************************************************************************************
 Methods for creating layers Json
 **********************************************************************************************************************/

MapManager.GeoJsonMarkerStyle = function ( {layerName, markerStyle} ) {
    if (typeof markerStyle.radius === 'undefined') markerStyle.radius = 20;

    this.id = layerName;
    this.source = layerName;
    this.type = "circle";
    this.interactive = true;
    //"type": "symbol",
    this.layout = {
        //"icon-image": "{marker-symbol}-15",
        //"text-field": "{title}",
        //"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        //"text-offset": [0, 0.6],
        //"text-anchor": "top"
    };

    this.paint = {
        "circle-radius": markerStyle.radius,
        "circle-color": markerStyle.color,
        "circle-opacity": 0.7
    };
};


MapManager.GeoJsonLineStyle = function({ layerName, lineStyle } ) {
    if (typeof lineStyle.color === 'undefined') lineStyle.color = "#888";

    this.id = layerName;
    this.source = layerName;
    this.type = "line";
    this.interactive = true;
    this.layout = {
        "line-join": "round",
        "line-cap": "round"
    };
    this.paint = {
        "line-color": lineStyle.color,
        "line-width": lineStyle.width
    };
};


