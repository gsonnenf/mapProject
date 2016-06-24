/**
 * Created by Greg on 5/7/2016.
 */

PortalDbMeteor = class PortalDbMeteor extends PortalDb {
    constructor() {
        super();
        Utility.debugMessage("PortalDbMeteor Constructor called.");

        this.basePortalDataDb = new DbMeteor({meteorCollection: BasePortalData, queryObject: {} });
        this.LastUpdateCursor = LastUpdateTracker.find({key: "BasePortalData"});
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];

        this.isReady = true;

        if (this.lastUpdateTimeMeteor != this.lastUpdateTimeLocal) {
            this.isReady = false;
            subscriptionReady.addCallbackOnReady({
                callback: ()=> {
                    this.loadPortalsFromServer();
                    this.isReady = true;
                    this.onReady();
                },
                subscriptionNames: ['BasePortalData']
            });
        }

        subscriptionReady.addCallbackOnReady({
            callback: ()=> {
                this.basePortalDataDb.onAdded.push((document) => { this.onAdded(document, document.lastUpdateTime); console.log("Portal added");});
                this.basePortalDataDb.onChanged.push( (document) => { this.onChanged(document, document.lastUpdateTime); });
                this.basePortalDataDb.onRemoved.push( (document) => { this.onRemoved(document, this.LastUpdateCursor.fetch()['time'] ); });
            } ,
            subscriptionNames: ['BasePortalData']
        });
    }

    loadPortalsFromServer() {
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];
        Utility.debugMessage("PortalDbMeteor - Portals loaded from server.");
        this.portalList = [];
        var portalList = this.basePortalDataDb.getAllDocuments();
        for (let index in portalList) {
            var portal = portalList[index];
            this.portalList.push(new Portal({
                name: portal.name,
                guid: portal._id,
                lat: portal.lat,
                lng: portal.lng,
                imgUrl: portal.imgUrl,
                ingressId: portal.ingressUid
            }));
        }

        this.storePortalListLocal();
        this.storePortalLastUpdateTimeLocal(this.lastUpdateTimeMeteor);
    }

    retrievePortals() {
        this.portalList = this.basePortalDataDb.getAllDocuments();
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];
    }

};
