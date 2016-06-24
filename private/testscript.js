/**
 * Created by Greg on 3/12/2016.
 */

planManagerTest();
//markerConnectTest();
//addLinesAndLinesOnClick();
//addHundredLineSingleLayer();
//addHundredLineLayers();
//addLineOnClick();
//addMarkerOnClick();
//testDrawMarkerAtUserLocation();
//testDrawLine();
//testDrawSimpleLineAtUserLocation();


/**
 * Test ability to add 100 layers with 1 line each. 15 seconds to load and slight lag, probably better to add 100 lines as a feature collection?
 */



function markerConnectTest() {
    var basePoint = null;
    var geoJson = null;
    mapManager.moveToUserLocation();
    mapManager.getUserLocation(function () {
        var basePoint = mapManager.lastUserLocation;
        var testPointList = [];
        var testPointIdList = [];

        for (let i = 0; i < 10; i++) {
            testPointList.push([basePoint[0] + 0.1 * Math.random(), basePoint[1] + 0.1 * Math.random()]);
            testPointIdList.push({id:i});

        }


        mapManager.map.on('style.load', function () {
            mapManager.addMarkers({layerName: "markerLayer", pointList: testPointList, propertiesList: testPointIdList});
            mapManager.setCursorOnLayerHover({layerName:"markerLayer",radius: 7.5 });
            mapManager.setCallbackOnLayerClick({layerName:"markerLayer",radius: 7.5, callback: function( err, features) {console.log(features[0]);} });
            //mapManager.addLineList()
        });
    });
}

function MarkerConnector()
{
    var line1 = null;
    var line2 = null;

    this.MarkerClick = function (){


        var marker = features[0];
        line1 = marker;
        var coords = marker.geometry.coordinates;
        var id = marker.properties.id;
    };


    this.drawLine = function(mapManager,layerName) {
        if (typeof line1 === 'undefined' || typeof line2 ==='undefined') {
            console.log("Called drawLine() with invalid points");
            return;
        }
        mapManager.addLineToFeatureCollectionLayer({layerName, lineSet, properties, geoJsonLineFeatureCollection }

            [line1.geometry.coordinates,line2.geometry.coordinates])
    };


};


function addLinesAndLinesOnClick () {
    var basePoint = null;
    var geoJson = null;
    mapManager.moveToUserLocation();
    mapManager.getUserLocation( function () {
        var testPoint1 = mapManager.lastUserLocation;
        var testPoint2 = [testPoint1[0] + .01, testPoint1[1] + .01];

        var basePoint = testPoint1;
        mapManager.map.on('style.load', function () {
            //mapManager.addLine('testLine',testPoint1,testPoint2,'#888');

            var lineList = [];
            var linePropertyList = [];
            for (var i = 0; i < 10; i++) {
                let t1 = [testPoint1[0], testPoint1[1]];
                let t2 = [testPoint2[0], testPoint2[1]];
                t1[0] += i * .001;
                //t2[0] += i * .001;
                lineList.push([t1, t2]);
                linePropertyList.push({id: i});
            }
            geoJson = mapManager.addLineList( lineList, linePropertyList,"testLineSet", { color: "#E88",interactive: true});

            mapManager.bindLineClickToCallback('testLineSet', 30, function (err, features) {
                if (features.length == 0) return;
                if (err) {console.log(err); return;}


                console.log(features);

            });


        });

        mapManager.map.on('click', function (e) {
            //mapManager.addLineToFeatureCollectionLayer( [testPoint1,[e.lngLat.lng, e.lngLat.lat]], {id:'dynamic'},'testLineSet', geoJson );
        });
    });


};

function addHundredLineSingleLayer() {
    if (typeof addLineTestCounter === 'undefined') addLineTestCounter = 0;
    mapManager.moveToUserLocation();
    mapManager.getUserLocation( function () {
        var testPoint1 = mapManager.lastUserLocation;
        var testPoint2 = [testPoint1[0] + .01, testPoint1[1] + .01];
        mapManager.map.on('load', function () {
            var lineSetList = [];
            for (var i = 0; i < 100; i++) {
                let t1 = [testPoint1[0], testPoint1[1]];
                let t2 = [testPoint2[0], testPoint2[1]];
                t1[0] += i * .001;
                t2[0] += i * .001;
                lineSetList.push([t1, t2]);
            }
            mapManager.addLineSet("testLineSet", lineSetList, "#888");
        });
    });

}
function addHundredLineLayers() {

    if (typeof addLineTestCounter === 'undefined') addLineTestCounter = 0;
    mapManager.moveToUserLocation();
    mapManager.getUserLocation( function () {
        var testPoint1 = mapManager.lastUserLocation;
        var testPoint2 = [testPoint1[0] +.01, testPoint1[1] +.01];
        mapManager.map.on('load', function () {
            for(var i = 0; i < 100; i++) {

                let t1 = [ testPoint1[0],testPoint1[1] ];
                let t2 = [ testPoint2[0],testPoint2[1] ];
                t1[0] += i*.001;
                t2[0] += i*.001;
                mapManager.addLine("testLine" + addLineTestCounter++, t1, t2, "#888");
                //mapManager.addLine("testLine" + addLineTestCounter++, testPoint1, testPoint2, "#888");

            }
        });
    });
}


function addLineOnClick() {
    if (typeof addLineTestList === 'undefined') addLineTestList = [];
    if (typeof addLineTestCounter === 'undefined') addLineTestCounter = 0;
    mapManager.map.on('click', function (e) {
        addLineTestList.push([e.lngLat.lng, e.lngLat.lat]);
        if (addLineTestList.length < 2) return;
        mapManager.addLine("testLine" + addLineTestCounter++, addLineTestList[0], addLineTestList[1], "#888");
        addLineTestList.shift();
    });
}

function addMarkerOnClick() {
    if (typeof addMarkerTestCounter === 'undefined') addMarkerTestCounter = 0;
    mapManager.map.on('click', function (e) {
        console.log(e);
        mapManager.addMarkers("testMarker" + addMarkerTestCounter++,[ [e.lngLat.lng,e.lngLat.lat] ] );
        /*
        mapManager.map.featuresAt(e.point, {
            radius: 7.5, // Half the marker size (15px).
            includeGeometry: true,
            layer: 'markers'
        }, function (err, features) {

            if (err || !features.length) {
                popup.remove();
                return;
            }

            var feature = features[0];

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(feature.geometry.coordinates)
                .setHTML(feature.properties.description)
                .addTo(map);
        });
        */
    });

}
function testDrawMarkerAtUserLocation(){
    mapManager.moveToUserLocation();

    mapManager.getUserLocation( function () {
        var testPoint1 = mapManager.lastUserLocation;
        var testPoint2 = [testPoint1[0] +.01, testPoint1[1] +.01];
        mapManager.map.on('load', function () { mapManager.addMarkers("testMarkers",[testPoint1,testPoint2]); });
    })
}


function testDrawLine() {

    mapManager.moveToLocation( [-122.486052, 37.830348], 15);

    mapManager.map.on('load', function () {
        mapManager.map.addSource("route", {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-122.48369693756104, 37.83381888486939],
                        [-122.48348236083984, 38.83317489144141],
                    ]
                }
            }
        });

        mapManager.map.addLayer({
            "id": "route",
            "type": "line",
            "source": "route",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#888",
                "line-width": 8
            }
        });
    });
}

function testDrawSimpleLineAtUserLocation() {

    mapManager.moveToUserLocation();

    mapManager.getUserLocation( function () {
    var testPoint1 = mapManager.lastUserLocation;
    var testPoint2 = [testPoint1[0] +.01, testPoint1[1] +.01];
    mapManager.map.on('style.load', function () { mapManager.addLine("testLine",testPoint1, testPoint2, "#888"); });
    })
};