/**
 * Created by Greg on 6/15/2016.
 */

MessageTabWidget = class MessageTabWidget {
    constructor({linkPlanManager}) {

        linkPlanManager.onLinkPlanChanged.push( ({linkPlan}) => { this.setActiveLinkPlan(linkPlan);} );
        //***************************************************************************************
        this.toolbarElement = $('#messageBoxContainer');
        this.linkPlanMessageTab = $('#linkPlanMessageTab');
        this.linkPlanMessageBox = $('#linkPlanMessageBox');
        this.linkPlanMessageHeader = $('#linkPlanMessageHeader');

        //Sets up the presentation of the message box
        this.toolbarElement
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('setting', 'dimPage', false)
            .sidebar('setting', 'closable', false);

        this.linkPlanMessageTab.append(this.linkPlanMessageBox);

        this.linkPlanMessageTab.click(()=> { this.linkPlanMessageBox.css('display','flex'); });
        this.linkPlanMessageHeader.click( (event )=> {
            this.linkPlanMessageBox.css('display','none');
            event.stopPropagation();
        });

        //***************************************************************************************
        // Sets functionality of the message box.
        this.messageWidget = new MessageWidget({
            inputElement: $("#linkPlanMessageInput"),
            outputElement: $("#linkPlanMessageWindow"),
            submitButton: $("#linkPlanMessageSubmitButton")
        });

        this.messageDb = new DbActiveSubscriptionMeteor({
            meteorCollection: LinkPlanMessages,
            publishName: "LinkPlanMessages"
        });

        this.activeLinkPlan = null;

        this.messageWidget.onSendMessage.push((text)=> {
            if (this.activeLinkPlan == null) { Utility.debugErrorMessage("No active linkplan, this shouldn't happen."); return;}
            if (this.activeLinkPlan._id == null) {
                Utility.standardMessage({
                    title: "Message not sent",
                    message: "Please save link plan before using discussion."
                });
                return;
            }
            Meteor.call('sendLinkPlanMessage', {text: text, linkPlanId: this.activeLinkPlan._id }, Utility.MeteorCallResultMessage);
        });

        this.messageDb.onAdded.push( (message) => {this.messageWidget.printMessage(message) });
    }

    setActiveLinkPlan( linkPlan ) {
        this.messageWidget.clearMessages();
        this.messageWidget.printText("Link Planner: " + linkPlan.name);
        this.activeLinkPlan = linkPlan;
        if (! linkPlan._id ) {
            Utility.setObservable(linkPlan, '_id').push( ()=> {
                    Utility.removeObservable(linkPlan, '_id');
                    this.setActiveLinkPlan(linkPlan);
            });
        }
        else this.messageDb.setActiveDocuments({
            params: linkPlan._id,
            callback: ()=>{ this.messageWidget.printMessageList(
                this.messageDb.getAllDocuments()
                    .sort((element1, element2) => { return element1.createdAt - element2.createdAt} )
            )}
        });
    }

    hide() { this.toolbarElement.sidebar('hide'); }
    show() { this.toolbarElement.sidebar('show'); }

};
