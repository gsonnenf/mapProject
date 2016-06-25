/**
 * Created by Greg on 6/3/2016.
 */

WidgetItemSet = class WidgetItemSet {
    constructor({elementType}) {
        this.elementType = elementType;
        this.buttonList = [];
        this.parentClass = [];
        this.childClass = [];
    }

    addParentClass( classText ) { this.parentClass.push(classText); }

    addChildClass( classText ) { this.childClass.push(classText); }

    addButton ({text=null, iconName=null, onSelect, onDeselect}) {
        this.buttonList.push({
            text: text,
            iconName: iconName,
            onSelect: onSelect,
            onDeselect: onDeselect
        });
    }

    createChildren() {
        var childClassText = "";

        for (let text of this.childClass) childClassText += text + " ";

        var elementOpen = "<" + this.elementType + " class='ui " + childClassText +"' >";
        var elementClose = "</" + this.elementType + ">";

        for (let button of this.buttonList){
            var elementText = elementOpen;

            if (button.iconName) elementText += "<i class='" + button.iconName + " icon'></i>";
            if (button.text) elementText += button.text;
            elementText += elementClose;

            button.element = $(elementText);

            if (button.iconName) button.element.addClass('icon');

            button.element.click(() => {
                if (this.activeButton == button) {
                    this.activeButton.element.addClass("active");
                    return;
                }
                Utility.debugMessage("Toolbar Mode changed.",0);
                if(this.activeButton) {
                    this.activeButton.onDeselect();
                    this.activeButton.element.removeClass("active");
                }
                button.onSelect();
                this.activeButton = button;
            });
        }
    }

    append(containerElement){
        var parentClassText = "";
        for (let text of this.parentClass) parentClassText += text + " ";
        this.containerElement = containerElement;
        this.containerElement.addClass( parentClassText );
        for( let button of this.buttonList){
            this.containerElement.append(button.element);
            button.element.state();
        }
    }
};
