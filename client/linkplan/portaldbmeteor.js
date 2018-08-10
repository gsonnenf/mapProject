/**
 * Created by Greg on 5/7/2016.
 */
import {DbMeteor} from "/client/lib/db_framework/dbmeteor"
import {PortalDb} from "./portaldb" 


export class PortalDbMeteor extends PortalDb {
    constructor() {
        super();
        var self = this;
        Utility.debugMessage("PortalDbMeteor Constructor called.");

        this.basePortalDataDb = new DbMeteor({meteorCollection: BasePortalData, queryObject: {} });
        this.LastUpdateCursor = LastUpdateTracker.find({key: "BasePortalData"});       
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];

        

        if (this.lastUpdateTimeMeteor != this.lastUpdateTimeLocal) {
            this.isReady = false;
            subscriptionReady.subscribe('BasePortalData');
            subscriptionReady.addReadyCallback({
                callback: ()=> {
                    self.loadPortalsFromServer();
                    self.isReady = true;
                    //this.onReady.CallEvent();
                },
                subscriptionNames: ['BasePortalData']
            });
        }

        else this.isReady = true;
        /*
        subscriptionReady.addReadyCallback({
            callback: ()=> {
                this.basePortalDataDb.onAdded.push((document) => { this.onAdded(document, document.lastUpdateTime); console.log("PortalModel added");});
                this.basePortalDataDb.onChanged.push( (document) => { this.onChanged(document, document.lastUpdateTime); });
                this.basePortalDataDb.onRemoved.push( (document) => { this.onRemoved(document, this.LastUpdateCursor.fetch()['time'] ); });
            } ,
            subscriptionNames: ['BasePortalData']
        });
        */

    }

    loadPortalsFromServer() {
        console.log('Loading Portals from server....')
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];
        Utility.debugMessage("PortalDbMeteor - Portals loaded from server.");
        this.portalList = [];
        var portalList = this.basePortalDataDb.getAllDocuments();
        for (let index in portalList) {
            var portal = portalList[index];
            this.portalList.push(new PortalModel({
                name: portal.name,
                guid: portal._id,
                lat: portal.lat,
                lng: portal.lng,
                imgUrl: portal.imgUrl,
                ingressId: portal.ingressUid
            }));
        }
        console.log('Finished loading portals from server.');

        this.storePortalListLocal();
        this.storePortalLastUpdateTimeLocal(this.lastUpdateTimeMeteor);
    }

    retrievePortals() {
        this.portalList = this.basePortalDataDb.getAllDocuments();
        this.lastUpdateTimeMeteor = LastUpdateTracker.findOne({key: "BasePortalData"})['time'];
    }

};
