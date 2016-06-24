/**
 * Created by Greg on 5/22/2016.
 */

Portal = class Portal {
    constructor({guid, lat, lng, name, imgUrl, ingressId}) {
        this.lat = lat;
        this.lng = lng;
        this.name = name;
        this.guid = guid;
        this.imgUrl = imgUrl;
        this.ingressId =ingressId;
    }

    getPoint() {
        return [this.lng,this.lat];
    };
};

