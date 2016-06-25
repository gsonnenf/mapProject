/**
 * Created by Greg on 5/7/2016.
 */

import '../common/model_portal.js';

PortalDb = class PortalDb {
     constructor() {
         Utility.debugMessage("PortalDbBaseConstructor Called.");
         this.portalListLocalId = 'portalListLocalId';
         this.PortalListLastUpdateTimeLocalId = 'PortalListLastUpdateTimeLocalId';
         this.doNotLoadFromCache = false;
         this.lastUpdateTimeLocal = this.getPortalListLastUpdateTimeLocal();

         this.portalList = this.getPortalListLocal();
         Utility.debugMessage((this.portalList) ? "Portals Loaded from local Cache." : "No portals in local Cache.");

         //Events
         this.onRemoved = new Utility.MulticastEvent(['document','lastUpdateTime']);
         this.onChanged = new Utility.MulticastEvent(['document','lastUpdateTime']);
         this.onAdded = new Utility.MulticastEvent(['document','lastUpdateTime']);

         this.onReady = new Utility.MulticastEvent();

         //Event bindings
         this.onRemoved.push( (portal, lastUpdateTime) => {
             var index = this.portalList.findIndex( (element) => { return (portal._id == element._id); });
             this.portalList.splice(index,1);
             this.lastUpdateTimeLocal = lastUpdateTime;
             this.storePortalListLocal();
             this.storePortalLastUpdateTimeLocal();
         });

         this.onChanged.push ( (portal, lastUpdateTime) => {
             var index = this.portalList.findIndex( (element) => { return (portal._id == element._id); });
             this.portalList[index] = new PortalModel(portal);
             this.lastUpdateTimeLocal = lastUpdateTime;
             this.storePortalListLocal();
             this.storePortalLastUpdateTimeLocal();
         });

         this.onAdded.push ( (portal, lastUpdateTime) => {
             this.portalList.push( new PortalModel(portal) );
             this.lastUpdateTimeLocal = lastUpdateTime;
             this.storePortalListLocal();
             this.storePortalLastUpdateTimeLocal();
         });

     };

    getPortalById( guid ) {
        return this.portalList.find( function (list) { return (list.guid == guid); });
    };

    getPortalListLastUpdateTimeLocal() {
        var json = window.localStorage.getItem(this.PortalListLastUpdateTimeLocalId)
        if (json == "undefined") return null;
        else return JSON.parse( window.localStorage.getItem(this.PortalListLastUpdateTimeLocalId) );
    };

    getPortalListLocal() {
        var portalObjectList = JSON.parse( window.localStorage.getItem(this.portalListLocalId) );
        var portalList = [];
        for (let index in portalObjectList) {
            let portal = portalObjectList[index];
            portalList.push(new PortalModel(portal));
        }
        return portalList;
    };

    storePortalLastUpdateTimeLocal(time = this.lastUpdateTimeLocal) {
        window.localStorage.setItem(this.PortalListLastUpdateTimeLocalId, time);
    };

    storePortalListLocal(portalList = this.portalList) {
        window.localStorage.setItem(this.portalListLocalId, JSON.stringify(portalList));
    };

    clearLocalCache() {
        window.localStorage.removeItem(this.portalListLocalId);
        window.localStorage.removeItem(this.PortalListLastUpdateTimeLocalId);

    };

    queryPortalsInBoundingBox({latLng1,latLng2}){
        var lowLat = (latLng1.lat < latLng2.lat) ? latLng1.lat : latLng2.lat;
        var highLat = (latLng1.lat > latLng2.lat) ? latLng1.lat : latLng2.lat;
        var lowLng = (latLng1.lng < latLng2.lng) ? latLng1.lng : latLng2.lng;
        var highLng = (latLng1.lng > latLng2.lng) ? latLng1.lng : latLng2.lng;

        var subsetPortalList = [];
        for(let portal of this.portalList)
            if (portal.lat >= lowLat && portal.lat <= highLat)
                if (portal.lng >= lowLng && portal.lng<= highLng) subsetPortalList.push(portal);

        return subsetPortalList;
    };
};

