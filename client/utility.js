/**
 * Created by Greg on 4/13/2016.
 */

if (typeof Utility === 'undefined') Utility = {};


// Observable
Utility.Observable = {};
Utility.Observable.ObservableList = [];

Utility.Observable.bindOnChanged = function( parent, childName, onChanged ) {
    Object.defineProperty( parent, 'onChanged_' + childName , {
        get: function() {return onChanged},
        set: function() { console.log("Cannot 'set' onChanged observable. To add an event use .push(), to remove observer call Utility.removeObservable()")},
        configurable: true
    });
};

Utility.setObservable = function( parent, childName ){
    var variable = parent[childName];
    var onChanged = new Utility.MulticastEvent(['variable','oldVariable']);
    Utility.Observable.ObservableList.push( {parent: parent, childName: childName, onChanged: onChanged} );
    Utility.Observable.bindOnChanged( parent, childName, onChanged );

    Object.defineProperty(parent, childName, {
        get: function() { return variable; },
        set: function(value) {
            var oldVariable = variable;
            variable = value;
            onChanged( variable, oldVariable );
        }, configurable: true
    });
    return onChanged;
};

Utility.removeObservable = function(parent, childName) {
    delete parent['onChanged_' + childName];
    var temp = parent[childName];
    delete parent[childName];
    parent[childName] = temp;
    var index = Utility.Observable.ObservableList.findIndex((element)=> {return (element.parent == parent && element.childName == childName) });
    if (index == -1) return;
    delete Utility.Observable.ObservableList[index];
};




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

///*************** URL SYSTEM ****************************************

Utility.getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
/*!
 query-string
 Parse and stringify URL query strings
 https://github.com/sindresorhus/query-string
 by Sindre Sorhus
 MIT License
 USAGE : queryString.push('my_param_key', 'some_new_value')
 */
(function () {
    'use strict';
    var queryString = {};

    queryString.parse = function (str) {
        if (typeof str !== 'string') {
            return {};
        }

        str = str.trim().replace(/^\?/, '');

        if (!str) {
            return {};
        }

        return str.trim().split('&').reduce(function (ret, param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            var key = parts[0];
            var val = parts[1];

            key = decodeURIComponent(key);
            // missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            val = val === undefined ? null : decodeURIComponent(val);

            if (!ret.hasOwnProperty(key)) {
                ret[key] = val;
            } else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            } else {
                ret[key] = [ret[key], val];
            }

            return ret;
        }, {});
    };

    queryString.stringify = function (obj) {
        return obj ? Object.keys(obj).map(function (key) {
            var val = obj[key];

            if (Array.isArray(val)) {
                return val.map(function (val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&') : '';
    };

    queryString.push = function (key, new_value) {
        var params = queryString.parse(location.search);
        params[key] = new_value;
        var new_params_string = queryString.stringify(params);
        history.pushState({}, "", window.location.pathname + '?' + new_params_string);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = queryString;
    } else {
        window.queryString = queryString;
    }
})();

Utility.setUrlParameter = function ( key, value ) { queryString.push (key, value); };


Utility.MonthTable = ['Jan', 'Feb', 'Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
Object.freeze(Utility.MonthTable);