/**
 * Created by Greg on 7/7/2016.
 */

export class AccessClientJoin {
    constructor({documentCollection,accessCollection, joinPub, docCallbacks}) {
        this.documentCollection = documentCollection;
        this.accessCollection = accessCollection;
        if(joinPub) this.subscribe({joinPub:joinPub, docCallbacks:docCallbacks});
    }

    subscribe({joinPub=null, docPub=null, accessPub=null}, docCallbacks = undefined) {
        if (joinPub) {
            accessPub = joinPub + 'Access';
            docPub = joinPub + 'Document';
        }
        if(!(accessPub && docPub)) throw Error("Subscription needs publication name parameters.");


        var self = this;
        var temp = docCallbacks.onReady;
        docCallbacks.onReady = function(){
            var accessObserver = self.accessCollection.find().observe({
                added: (doc)=> {
                    if (!accessObserver) return;
                    var oldHandle = self.documentHandle;
                    self.documentHandle = Meteor.subscribe(docPub,{ onReady: ()=>{ oldHandle.stop(); }});
                },
                removed: ()=> {
                    var oldHandle = self.documentHandle;
                    self.documentHandle = Meteor.subscribe(docPub,{ onReady: ()=>{oldHandle.stop(); }});
                }
            });
            if(temp) temp.apply(this,arguments);
        };

        Meteor.subscribe(accessPub, {
            onReady: ()=> {
                console.log(this.accessCollection.find().fetch());
                this.documentHandle = Meteor.subscribe(docPub, docCallbacks);
            }
        });
        //TODO: Close handle on stops etc.
    }
}