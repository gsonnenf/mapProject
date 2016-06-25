/**
 * Created by Greg on 3/16/2016.
 */


class PortalTestDb extends PortalDb {
    constructor() {
        super();
        this.doNotLoadFromCache = false;
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

        if (localDbTime != null)
            if (localDbTime < (Date.now + 1000 * 60 * 60) && !this.doNotLoadFromCache) {
                this.getPortalListFromLocalStorage();
                callback(self.portalList);
                console.log('Portals loaded from Cache');
                return;
            }

        var gFireBaseUrl = "https://ingressportalscrape.firebaseio.com/new16j";
        var fbref = new Firebase(gFireBaseUrl);

        fbref.once('value', function (ev) {
            self.parseCodyFirebaseData(ev.val().geometries);
            self.storePortalListInLocalStorage();
            console.log('Portals loaded from FB and wrote to cache');
            callback(self.portalList);
        });
    }
}
