export class ImportDatabase {

    static ImportPortals() {
        BasePortalData.remove({});
        let portalList = JSON.parse( Assets.getText('PortalData.json') );

        for(let key in portalList.geometries) {
            let element = portalList.geometries[key];          
            let portal = new PortalModel({
                name: element.properties.name,
                imgUrl: element.properties.img,
                guid: key,
                lng: element.coordinates[0],
                lat: element.coordinates[1],
            });

            if (portal.imgUrl == null) portal.imgUrl = "default-portal-image.png";
            
            BasePortalData.insert(portal);          
        }
        
        LastUpdateTracker.insert({key: "BasePortalData", time:  new Date().getTime() });
    }
    
    static createRoles() {
        
    }

}