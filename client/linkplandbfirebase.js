class LinkPlanDbFirebase {

    constructor(portalManager) {
        this.PortalManager = portalManager;
        var firebaseAddress = "https://intense-torch-7786.firebaseio.com/";
        this.dbReference = new Firebase( firebaseAddress );
        this.linkPlanDataReference = this.dbReference.child("linkPlanData");
        this.linkPlanListReference = this.dbReference.child("linkPlanList");
        /* events */
        this.onLinkPlanListChange = [];
    }

    initialize() {
        var self = this;
        self.linkPlanListReference.on('value', function ( data ){
            console.log(data.val());
            for (let callback of self.onLinkPlanListChange) callback(data.val());
        });
    }

    fetchLinkPlan({uuid, callback}) {
        var uuidRef = this.linkPlanDataReference.child(uuid);
        uuidRef.once("value", function(snap) {
            var linkPlan = new LinkPlanClass ();
            linkPlan.unmarshall({linkPlanMarshall: snap.val()});
            callback( linkPlan );
        });
    }

    saveLinkPlan({linkPlan}) {
        var self = this;
        Utility.setUrlParameter( 'mapId',uuid );
        if (linkPlan.uuid == null) linkPlan.uuid = this.generateUUID ();
        self.linkPlanDataReference.update(linkPlan.marshall(), function () {console.log("Added linkplan to db: " + linkPlan.name); });
        self.linkPlanListReference.update(linkPlan.uuidNamePair(), function () { console.log("Added list element to db: " + linkPlan.name); });
    }


    marshall() {
        if (this.uuid == null) throw "UUID must be assigned before persisting";

        var linkIdList = [];
        var anchorIdList = [];
        for(let index in this.linkList) linkIdList.push( { portal1: this.linkList[index].portal1.guid, portal2: this.linkList[index].portal2.guid } );
        for(let index in this.anchorList) anchorIdList.push( this.anchorList[index].guid );

        var linkPlanSerial = {};
        linkPlanSerial[uuid] = {
            uuid: this.uuid,
            name: this.name,
            linkList: JSON.stringify(linkIdList),
            anchorList: JSON.stringify(anchorIdList)
        };
        return linkPlanSerial;
    }

    unmarshall( {linkPlanSerial} ){
        this.uuid = linkPlanSerial.uuid;
        this.name = linkPlanSerial.name;

        //Unpacks Links
        this.linkList = [];
        var linkIdList = JSON.parse(linkPlanSerial.linkList);
        for (let index in linkIdList) {
            this.linkList.push({
                portal1: this.PortalManager.getPortalById(linkIdList[index].portal1),
                portal2: this.PortalManager.getPortalById(linkIdList[index].portal2)
            });
        };

        //Unpacks Anchors
        this.anchorList = [];
        var anchorIdList = JSON.parse(linkPlanSerial.anchorList);
        for (let index in anchorIdList) this.anchorList( this.PortalManager.getPortalById(anchorIdList[index]) );
    }

    generateUUID () {
        function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}
