/**
 * Created by Greg on 6/15/2016.
 */
import {DbActiveSubscriptionMeteor} from "/client/lib/db_framework/dbactivesubscriptionmeteor"

export class LinkPlanMessageDbMeteor {
    constructor() {
        this.linkPlanMessageDb = new DbActiveSubscriptionMeteor({meteorCollection: ChatRoomMessages, publishName:"LinkPlanMessages"});
        this.onMessageAdded = this.linkPlanMessageDb.onMessageAdded;
        this.activeLinkPlan = null;
    }

    getLinkPlanMessageList() {
        return this.linkPlanMessageDb.getAllDocuments();
    }

    setLinkPlan( {linkPlan, callback} ) {
        this.activeLinkPlan = linkPlan;
        this.linkPlanMessageDb.setActiveDocuments({ params: linkPlan._id, callback: callback});
        this.activeLinkPlan = linkPlan;
    }
    
    sendMessage( message ) {
        Meteor.call('sendLinkPlanMessage', {text: message, linkPlanId:this.activeLinkPlan._id} );
    }

};
