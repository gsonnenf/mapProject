/**
 * Created by Greg on 3/16/2016.
 */


export class PortalImportFirebase {
    constructor() {
        super();
    }

    parseCodyFirebaseData(fbList) {
        this.portalList = [];
        for (let index in fbList) {
            var element = fbList[index];
            var portal = new PortalModel({
                name: element.properties.name,
                imgUrl: element.properties.img,
                guid: index,
                lng: element.coordinates[0],
                lat: element.coordinates[1],
            });

            if (portal.imgUrl == null) portal.imgUrl = "default-portal-image.png";
            self.portalList.push(portal);
        }
    };

    retrievePortalsFromDatabase(callback, cache) {

        var localDbTime = window.localStorage.getItem(this.portalListLastUpdateStorageId);

        var gFireBaseUrl = "https://ingressportalscrape.firebaseio.com/new16j";
        var fbref = new Firebase(gFireBaseUrl);

        fbref.once('value', function (ev) {
            self.parseCodyFirebaseData(ev.val().geometries);
            //self.storePortalListInLocalStorage();
            console.log('Portals loaded from FB and wrote to cache');
            //callback(self.portalList);
        });
    }

    writePortalsToDb() {
        for(let portal in this.portalList) {
            BasePortalData.insert({
                name: portal.name,
                imgUrl: portal.imgUrl,
                guid: portal.guid,
                lng: portal.lng,
                lat: poratl.lat,
                ingressId: null
            });       
        }
    }


}
