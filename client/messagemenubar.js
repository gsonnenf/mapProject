/**
 * Created by Greg on 6/13/2016.
 */

MessageMenubar = class MessageMenubar {
    constructor() {
        this.menubarElement = $('#messageMenubar');
        this.menubarContainer = $("#menubarContainer");
        this.menubarElement.css('display','none');
        this.menubarContainer.append(this.menubarElement);
    }

    show() {
        this.menubarElement.css('display','flex');
    }

    hide() {
        this.menubarElement.css('display','none');
    }
};