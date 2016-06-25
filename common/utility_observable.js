/**
 * Created by Greg on 6/25/2016.
 */

import "./utility"
import "./utility_multicast"

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
    var onChanged = new Utility.MulticastFunction(['variable','oldVariable']);
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
