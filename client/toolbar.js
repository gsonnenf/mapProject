/**
 * Created by Greg on 4/13/2016.
 */

Toolbar = class Toolbar extends WidgetIconToggleButtonSet{
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
            onSelect: ()=> { linkPlanManager.portalUi.selectPortalModeActive = true;},
            onDeselect:()=> { linkPlanManager.portalUi.selectPortalModeActive = false;}
        });

        super.addButton({
            iconName: 'write',
            onSelect: ()=> { linkPlanManager.linkPlanUi.drawLinesModeActive = true; },
            onDeselect:()=> { linkPlanManager.linkPlanUi.drawLinesModeActive = false;}
        });

        super.addButton({
            iconName: 'crop',
            onSelect: ()=> { linkPlanManager.mapSelectorTool.setBoundingBoxModeActive(true);  },
            onDeselect:()=> { linkPlanManager.mapSelectorTool.setBoundingBoxModeActive(false); }
        });

        super.createChildren();
        super.append(this.portalToolSelectorId);

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
        for (let index in anchorList) this.addAnchorHtml(anchorList[index]);
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
