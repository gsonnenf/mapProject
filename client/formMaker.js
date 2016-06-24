/**
 * Created by Greg on 2/6/2016.
 */
/*

function DatabaseManager( firebaseAddress, databaseName ) {
    //this.DbReference = new Firebase( firebaseAddress );
    this.DbReference = new Firebase("https://intense-torch-7786.firebaseio.com/");

}

*/





/***
 *
 * @param parameters
 * @returns {Element}
 */

/*
DatabaseManager.prototype.createRadioForm = function ( parameters )
{
    var self = this;

    // parameters list
    var cssStyleName = parameters.cssStyleName;
    var formName = parameters.formName;
    var formId = parameters.formId;
    var displayName = parameters.displayName;
    var optionsList = parameters.optionList;
    var firebaseSubAddress = parameters.FirebaseSubAddress;

    // Create form elements
    var form = document.createElement("form");
    var fieldSet = document.createElement("fieldset");
    var legend = document.createElement("legend");

    form.appendChild(fieldSet);
    fieldSet.appendChild( legend );

    form.id = formId;
    legend.innerText = displayName;

    for ( var key in optionsList) {
        var optionData = optionsList[key];
        var option = document.createElement("INPUT");
        option.type = "radio";
        option.name = formName;
        option.value = optionData.value;
        //option.innerHTML = optionData.text;
        fieldSet.appendChild(option);
        fieldSet.appendChild(document.createTextNode( optionData.text));
        fieldSet.appendChild(document.createElement('br'));
    }

    //Css settings
    form.style = "display:inline:";
    fieldSet.style = "display:inline:";


    form.retrieveFirebaseElement = function ( elementKey ) {
        //retrieve element from the firebase db.
        //Place those elements into the
        ref.on("value", function(snapshot) {
            console.log(snapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
    form.submitFirebaseElement = function ( elementKey ) {

    }

    return form;
}

DatabaseManager.prototype.persistOption = function( form ){

}

*/
/*
PortalManager.prototype.InitializePortalBaseDataListFromDb = function() {
    var self = this;
    var DbCallback = function(data) {
        self.PortalBaseDataList = data.val();
        if (self.PortalBaseDataList == null) self.PortalBaseDataList = {};
        console.log("Portal Cache returned");
        self.EndJob();
    };
    this.AddJob( function () { self.PortalBaseDataReference.once("value", DbCallback); });
};

// Adds a portal to our database. Will not add if it is already in our cache unless overwrite is true.
PortalManager.prototype.AddPortal = function(node, overwrite) {
    var self = this;
    this.AddJob( function () {
        if (self.PortalBaseDataList[btoa(node.guid)] != undefined && !overwrite) { console.log('portal exists: ' + node.guid); self.EndJob(); return; }

        var updateTime = Date.now();

        var nodeBaseData = {};
        nodeBaseData[btoa(node.guid)] = {
            updateTime: updateTime,
            guid: node.guid,
            lat: node.lat,
            lng: node.lng
        };
        self.PortalBaseDataReference.update( nodeBaseData, function() {console.log("Added portal to db: " + node.guid); self.EndJob();} );
        self.PortalBaseDataList[btoa(node.guid)] = nodeBaseData[btoa(node.guid)];
    });
};*/