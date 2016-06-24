import "./linkplandbmeteor.js";
import "./portalui.js";
import "./linkplanui.js";
import "./chatroommanager.js"
import "./subscriptionready.js"



initialize = function initialize() {

    //Subscribe to database
    subscriptionReady = new SubscriptionReady();
    Meteor.subscribe("allUserData");
    Meteor.subscribe("roles");
    subscriptionReady.subscribe('LinkPlanData');
    subscriptionReady.subscribe('LastUpdateTracker');
    subscriptionReady.subscribe('ChatRoomNames');
    subscriptionReady.subscribe('BasePortalData');
    
    //initialize Semantic UI elements
    //$('.ui.button.toggle').each(function () { $(this).state(); });
    $('.dropdown').dropdown();


    //
    mapManager = new MapManager();
    mapManager.moveToUserLocation();
    linkPlanManager = new LinkPlanManager();
    messageMenubar = new MessageMenubar();
    mainMenuSelector = new MainMenuSelector({linkPlanManager:linkPlanManager, messageMenubar:messageMenubar});
    chatRoomManager = new ChatRoomManager();

    messageSidebar = new MessageTabWidget({linkPlanManager:linkPlanManager});
    messageSidebar.show();

    

    subscriptionReady.addCallbackOnReady({
        callback:()=> { chatRoomManager.initialize();},
        subscriptionNames: ['ChatRoomNames']
    });

    subscriptionReady.addCallbackOnReady({
        callback: ()=> {
            portalDb = new PortalDbMeteor();
           //if (mapManager.map.loaded()) {
                console.log("init link plan manager");
               linkPlanManager.initialize({mapManager: mapManager, portalDb: portalDb});
            //}
            //else
                mapManager.map.once('style.load', () => {
                    console.log("init link plan manager 2");
                    linkPlanManager.initialize({mapManager: mapManager, portalDb: portalDb});
                });
        },
        subscriptionNames: ['LastUpdateTracker','LinkPlanData']
    });

    console.log("initialized");
};