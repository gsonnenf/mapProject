/**
 * Created by Greg on 6/1/2016.
 */

WidgetIconToggleButtonSet = class WidgetIconToggleButtonSet {
    constructor() {
        this.parentElement = null;
        this.buttonList = [];
        this.parentClass = [];
        this.childClass = [];
    }

    addParentClass( classText ) { this.parentClass.push(classText); }

    addChildClass( classText ) { this.childClass.push(classText); }

    addButton ({iconName, onSelect, onDeselect}) {
        this.buttonList.push({
            iconName: iconName,
            onSelect: onSelect,
            onDeselect: onDeselect
        });
    }
    
    createChildren() {
        var childClassText = "";

        for (let text of this.childClass) childClassText += text + " ";

        for (let button of this.buttonList){
            button.element = $('<button class="'+ childClassText +
                'ui toggle button icon">' +
                '<i class="' + button.iconName + ' icon"></i>' +
                '</button>');

            button.element.click(() => { this.triggerButton( button ); });
        }
    }

    triggerButton( button ) {
        if (this.activeButton == button) {
            this.activeButton.element.addClass("active");
            return;
        }
        Utility.debugMessage("Toolbar Mode changed.",0);
        if (this.activeButton) {
            this.activeButton.onDeselect();
            this.activeButton.element.removeClass("active");
        }
        button.element.addClass("active");
        button.onSelect();
        this.activeButton = button;
    };


    append(containerElementId){
        var parentClassText = "";
        for (let text of this.parentClass) parentClassText += text + " ";
        this.containerElement = $('#' + containerElementId);
        this.containerElement.addClass( parentClassText + "ui buttons" );
        for( let button of this.buttonList){
            this.containerElement.append(button.element);
        }
    }
};