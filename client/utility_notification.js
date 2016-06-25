/**
 * Created by Greg on 4/13/2016.
 */

import "../common/utility"

// Observable

///MESSAGE SYSTEM **************************************************
Utility.isDebugConsole = true;
Utility.isDebugPnotify = true;
Utility.debugConsoleLevel = 0;
Utility.debugPnotifyLevel = 3;




PNotify.prototype.options.delay = 3000;
PNotify.prototype.options.stack = {"dir1": "down", "dir2": "right", "push": "top"};

Utility.MeteorCallResultMessage = function (error, result) {
    if (error) {
        console.log("Meteor Call Error.");
        console.log(error);
    }
    else{
        console.log("Meteor Call Success.");
        console.log(result);
    }
};

Utility.standardMessage = function ({title, message}) {
    console.log("Message: " + title + " - " + message);
    new PNotify({
        title: title,
        text: message,
    });
};

Utility.successMessage = function ({title, message}) {
    console.log("Success: " + title + " - " + message);
    new PNotify({
        title: title,
        text: message,
        type: "success"
    });
};

Utility.throwErrorMessage = function ({title, message}) {
    console.log("Error: " + title + " - " + message);
    new PNotify({
        title: title,
        text: message,
        type: 'error'
    });
    throw new Error(title + ": " + message);
};

Utility.errorMessage = function ({title, message}) {
    console.log("Error: " + title + " - " + message);
    new PNotify({
        title: title,
        text: message,
        type: 'error'
    });
};

Utility.debugMessage = function debugMessage(message, level) {
    if (level == null) level = 0;
    var title = "Debug: " + debugMessage.caller.name + " - ";
    if (this.isDebugConsole == true && level >= this.debugConsoleLevel) console.log(title + message);
    if (this.isDebugPnotify == true && level >= this.debugPnotifyLevel) new PNotify({
        title: title,
        text: message,
        type: 'info'
    });
};

Utility.debugErrorMessage = function debugErrorMessage(message) {
    var title = debugErrorMessage.caller.name;

    if (this.isDebugConsole == true) {
        console.log("Debug Error: " + title + message);
        console.trace();
    }

    if (this.isDebugPnotify == true) new PNotify({
        title: "Debug Error: " + title,
        text: message,
        type: 'error'
    });
};
