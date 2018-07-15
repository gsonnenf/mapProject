/**
 * Created by Greg on 6/1/2016.
 */
import {WidgetIconToggleButtonSet} from "/client/lib/widget_framework/widget_icontogglebuttonset"
import "./messagemenubar"

export class MainMenuSelector extends WidgetIconToggleButtonSet {
    constructor({linkPlanManager,messageMenubar}) {
        super();
        this.linkPlanManager = linkPlanManager;
        this.messageMenubar = messageMenubar;

        this.chatRoomNameElementId = 'mainMenuSelector';

        super.addParentClass("sitemodeselector");
        super.addChildClass("sitemodeselector");

        super.addButton ({
            iconName: "home",
            onSelect: ()=> { $('#content1').css('display','flex'); },
            onDeselect: ()=> {$('#content1').css('display','none');}
        });

        super.addButton ({
            iconName: "world",
            onSelect: ()=> {
                $('#map').css('display','flex');
                this.linkPlanManager.show();
            },
            onDeselect: ()=> {
                $('#map').css('display','none');
                this.linkPlanManager.hide();
            }
        });

        super.addButton ({
            iconName: "comments",
            onSelect: ()=> {
                $('#content3').css('display','flex');
                this.messageMenubar.show();
            },
            onDeselect: ()=> { 
                $('#content3').css('display','none');
                this.messageMenubar.hide();
            }
        });

        super.createChildren();
        super.append(this.chatRoomNameElementId);

        this.activeButton = this.buttonList[1];
        this.activeButton.onSelect();
        this.activeButton.element.addClass("active");
    }
}