/**
 * Created by Greg on 2/6/2016.
 */


/*
 var form1Options = [
 {value: 0, text: "option 0", tooltip: "this is my tool tip"},
 {value: 1, text: "option 1"},
 {value: 2, text: "option 2"},
 {value: "three", text: "option 3"}
 ];

 var databaseManager = new DatabaseManager();

 var form1Element = databaseManager.createRadioForm({
 displayName: "test Form",
 formName: "FormName1",
 formId: "FormId1",
 optionsList: form1Options
 });

 //window.onload = function (){//document.body.appendChild(form1Element);};
 //oncontextmenu="return false;"
 */

function PortalManager( firebaseAddress) {
    var firebaseAddress = "https://intense-torch-7786.firebaseio.com/";

this.DbReference = new Firebase( firebaseAddress );
this.PortalBaseDataReference = this.DbReference.child("PortalBaseData");
this.PortalExtensionDataReference = this.DbReference.child("PortalExtensionData");
this.UserNodeDataReference = this.DbReference.child("UserPortalData");
this.Schema = {};

};

PortalManager.prototype.PortalListItem.Schema = {
    lastQueryTime: null,
    key: null,
    portalStaticInfo: {},
    poralStatusInfo: {},
    portalUserData: {}
}


PortalList.PortalUserData.Schema = {
    lastUpdated: null,
    Distance: 0,
    Terrain: 0,
    Signal: 0,
    Misc: 0
}

PortalDataSchema.prototype.PortalStatusInfo = {
    lastUpdate: null,
    alignment : PortalAlignmentEnum.neutral,
    level: 0,
    Slot1: TableModification.Empty,
    Slot2: TableModification.Empty,
    Slot3: TableModification.Empty,
    Slot4: TableModification.Empty
}




portalUserData.Submit = function() {
    var nodeBaseData = {};
};
self.PortalBaseDataReference.update( nodeBaseData, function() {console.log("Added portal to db: " + node.guid); self.EndJob();} );
self.PortalBaseDataList[btoa(node.guid)] = nodeBaseData[btoa(node.guid)];
}

var TableAlignment = {
    neutral : 0,
    Blue : 1,
    Green : 2
};

var TableModification = {
    Empty : null,
    CommonShield : "CS",
    RareShield : "RS",
    VeryRareShield : "VRS",
    AxaShield : "AXA",
    CommonHeatsink : "CH",
    RareHeatsink : "RH",
    VeryRareHeatsink : "VRH",
    CommonMultihack : "CM",
    RareMultihack : "RM",
    VeryRareMultihack : "VRM",
    CommonLinkAmp : "CL",
    RareLinkAmp : "RL",
    VeryRareLinkAmp : "VRL",
}

PortalDataSchema.prototype.PortalStatusInfo = {
    lastUpdate: null,
    alignment : PortalAlignmentEnum.neutral,
    level: 0,
    Slot1: TableModification.Empty,
    Slot2: TableModification.Empty,
    Slot3: TableModification.Empty,
    Slot4: TableModification.Empty
}


PortalFormTemplate.DistanceForm = '<form id="portalDistanceForm" style="display:inline"> \
<fieldset style="display:inline;" data-role="collapsible">\
<legend>PortalModel Road Distance</legend>\
    <input type="radio" name="roadDistance" value="0" checked> Unknown <br>\
    <input type="radio" name="roadDistance" value="1"> PortalModel Center Near Road <br>\
    <input type="radio" name="roadDistance" value="2"> PortalModel accesible from road <br>\
    <input type="radio" name="roadDistance" value="3"> Requires Car exit. <br>\
    <input type="radio" name="roadDistance" value="4"> 1-4 minute walk. <br>\
    <input type="radio" name="roadDistance" value="5"> 5-15 minute walk. <br>\
    <input type="radio" name="roadDistance" value="6"> 15-30 minute walk. <br>\
    <input type="radio" name="roadDistance" value="7"> 30-60 min minute walk. <br>\
    <input type="radio" name="roadDistance" value="8"> 1+ hour walk. <br>\
</fieldset></form>';


PortalFormTemplate.Terrain = '<form id="portalTerrainForm" style="display:inline"> \
<fieldset style="display:inline;" data-role="collapsible">\
<legend>PortalModel Terrain</legend>\
    <input type="radio" name="portalTerrain" value="0" checked> Unknown <br>\
    <input type="radio" name="portalTerrain" value="1" > Road/City <br>\
    <input type="radio" name="portalTerrain" value="1" > Difficult Road <br>\
    <input type="radio" name="portalTerrain" value="2" > Walking Trail <br>\
    <input type="radio" name="portalTerrain" value="3" > Off-Trail <br>\
</fieldset></form>';

PortalFormTemplate.CellularSignal = '<form id="CellularSignalForm" style="display:inline"> \
<fieldset style="display:inline;" data-role="collapsible">\
<legend>Cell Phone Signal</legend>\
    <input type="radio" name="CellularSignal" value="0" checked> Unknown <br>\
    <input type="radio" name="CellularSignal" value="1" > Strong <br>\
    <input type="radio" name="CellularSignal" value="1" > Intermittent\weak <br> \
    <input type="radio" name="CellularSignal" value="2" > Single Carrier - Weak<br>\
    <input type="radio" name="CellularSignal" value="3" > Requires Cell Booster - Strong <br>\
    <input type="radio" name="CellularSignal" value="4" > Requires Cell Booster - Weak <br>\
    <input type="radio" name="CellularSignal" value="5" > Requires Satellite Modem <br>\
</fieldset></form>';

PortalFormTemplate.MiscOptions = '<form id="MiscOptionsForm" style="display:inline">\
<fieldset style="display:inline;" data-role="collapsible">\
<legend>Misc Options</legend>\
    <input type="checkbox" name="Winter" > Gated/Closed for Winter <br>\
    <input type="checkbox" name="Summer" > Gated/Closed for Summer <br>\
    <input type="checkbox" name="Night" > Awkward/Difficult Night Access <br>\
    <input type="checkbox" name="Special" > Requires Special circumstances to enter <br>\
</fieldset></form>';




map.on('click', function (e) {
    map.featuresAt(e.point, {layer: 'portals', radius: 10, includeGeometry: true}, function (err, features) {
        if (err || !features.length)
            return;
        var feature = features[0];
        //console.log(features)
        var pop = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML( `${feature.properties.name}
              <br>
              <img src="${feature.properties.img}"/ width=200 height=200>
              <a href="https://www.ingress.com/intel?ll=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}&z=17" target="IITC">
                open in ingress/intel
              </a>
              ` +
                "<div style='display:inline' >" +
                PortalFormTemplate.Distance +
                PortalFormTemplate.Terrain +
                PortalFormTemplate.CellularSignal +
                PortalFormTemplate.MiscOptions +
                "<div>"
            ).addTo(map);
        pop._container.style.maxWidth="1500px";
    });
});



