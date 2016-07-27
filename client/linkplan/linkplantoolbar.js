/**
 * Created by Greg on 4/13/2016.
 */
import {WidgetIconToggleButtonSet} from "/client/lib/widget_framework/widget_icontogglebuttonset"

export class LinkPlanToolBar extends WidgetIconToggleButtonSet{
    constructor({linkPlanManager}) {
        super();
        
        this.linkPlanManager = linkPlanManager;
        this.toolBarElement = $('#toolbarMenuElement');
        this.portalToolSelectorId = 'portalToolSelector';

        // sets up toolbar as sidebar
        this.toolBarElement
            .sidebar('setting', 'transition', 'overlay')
            .sidebar('setting', 'dimPage', false)
            .sidebar('setting', 'closable', false);
            //.sidebar('show');

        super.addButton({
            iconName: 'bullseye',
            onSelect: ()=> { this.linkPlanManager.portalUi.selectPortalModeActive = true;},
            onDeselect:()=> { this.linkPlanManager.portalUi.selectPortalModeActive = false;}
        });

        super.addButton({
            iconName: 'write',
            onSelect: ()=> { this.linkPlanManager.linkPlanUi.drawLinesModeActive = true; },
            onDeselect:()=> { this.linkPlanManager.linkPlanUi.drawLinesModeActive = false;}
        });

        super.addButton({
            iconName: 'crop',
            onSelect: ()=> { this.linkPlanManager.mapSelectorTool.setBoundingBoxModeActive(true);  },
            onDeselect:()=> { this.linkPlanManager.mapSelectorTool.setBoundingBoxModeActive(false); }
        });

        super.createChildren();
        super.append( this.portalToolSelectorId );

        this.activeButton = this.buttonList[0];
        this.activeButton.onSelect();
        this.activeButton.element.addClass("active");


        // On successful selection, triggers a change back to normal portal select mode.
        linkPlanManager.mapSelectorTool.onSelectionComplete.push( ()=> { super.triggerButton( this.buttonList[0]); });

        //Adds anchors to toolbars
        this.anchorList = [];
        $("#setAnchorElement").click(() => { this.addAnchor( this.linkPlanManager.portalDisplayUi.activePortal );});
    }

    hide() { this.toolBarElement.sidebar('hide'); }

    show() { this.toolBarElement.sidebar('show'); }

    addAnchor( portal ){
        if (this.anchorList.find( (element)=> { return element == portal })) { Utility.debugMessage("Duplicate anchor."); return; }
        this.anchorList.push(portal);
        this.addAnchorHtml(portal);
    };

    setAnchorList( anchorList) {
        $('#anchorToolbarElement').empty();
        this.anchorList = anchorList;
        anchorList.forEach( (element)=>{this.addAnchorHtml(element)} );
    };

    addAnchorHtml( portal ){
        var thumbnailId = "anchorThumbnail" + portal.guid;
        $('#anchorToolbarElement').append('<img id="' + thumbnailId + '" class = "ui segment" style="height:38px;padding:0;margin:0;border:0;margin-left:2px;" src="' + portal.imgUrl + '"/>');

        var element = $('#' + thumbnailId);
        element.click( (event)=> { this.linkPlanManager.portalUi.selectPortalClickHandler(portal); });
        element.contextmenu( (event)=> {
            element.remove();
            var index = this.anchorList.findIndex( (element) => {return element == portal} );
            this.anchorList.splice(index,1);
        }) ;
    }
};
