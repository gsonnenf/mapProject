
import {SubscriptionReady} from "/client/lib/utility/subscriptionready"
import {MapManager} from '/client/linkplan/mapmanager'
import {LinkPlanManager} from '/client/linkplan/linkplanmanager'
import {MessageMenubar} from '/client/communications/messagemenubar'
import {MainMenuSelector} from '/client/communications/mainmenuselector'
import {ChatRoomManager} from '/client/communications/chatroom/chatroommanager'
import {MessageTabWidget} from '/client/communications/messages/messagetabwidget'
import {PortalDbMeteor} from '/client/linkplan/portaldbmeteor'
import {AccessClientJoin} from '/client/lib/accessclientjoin'
import {AsyncNotifier} from '/common/lib/chimerapatterns'
subscriptionReady = new SubscriptionReady();

initialize = function initialize() {

    //Subscribe to database
    Meteor.subscribe("allUserData");
    Meteor.subscribe("roles");

    clientJoin = new AccessClientJoin({
        documentCollection:LinkPlanCollection,
        accessCollection:LinkPlanAccessCollection
    });
    
    var linkPlanNotifier = new AsyncNotifier();
    clientJoin.subscribe({joinPub: 'linkPlan'},{onReady: linkPlanNotifier.registerCallback(()=>{console.log("linkPlan subscription finished.") }) });
    Meteor.subscribe('LastUpdateTracker',{ onReady: linkPlanNotifier.registerCallback(()=>{console.log("lastUpdateTracker subscription finished.") }) });

    subscriptionReady.subscribe('ChatRoomNames');

    //initialize Semantic UI elements
    //$('.ui.button.toggle').each(function () { $(this).state(); });
    $('.dropdown').dropdown();

    var mapManager = new MapManager();
    mapManager.moveToUserLocation();
    linkPlanManager = new LinkPlanManager();
    var messageMenubar = new MessageMenubar();
    
    var chatRoomManager = new ChatRoomManager();

    var messageSidebar = new MessageTabWidget({linkPlanManager:linkPlanManager});
    messageSidebar.show();


    subscriptionReady.addReadyCallback({
        subscriptionNames: ['ChatRoomNames'],
        callback:()=> { chatRoomManager.initialize(); }
    });

    linkPlanNotifier.onCompleted( ()=> {
        console.log("Link Plan Notfier completing...")
        var portalDb = new PortalDbMeteor();

        //if (mapManager.map.loaded()) {
        console.log("init link plan manager");
        linkPlanManager.initialize({mapManager: mapManager, portalDb: portalDb});
        //}
        //else
        mapManager.map.once('style.load', () => {
            console.log("init link plan manager 2");
            linkPlanManager.initialize({mapManager: mapManager, portalDb: portalDb});
        });

        var mainMenuSelector = new MainMenuSelector({linkPlanManager:linkPlanManager, messageMenubar:messageMenubar});
    });
    linkPlanNotifier.start();


    //subscriptionReady.subscribe('BasePortalData');
    console.log("initialized");
};