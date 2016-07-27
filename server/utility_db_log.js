/**
 * Created by Greg on 6/28/2016.
 */
import "/common/lib/utility"

var logAll = function logAll(error, result) {
    if (error) {console.log(logAll.caller + ": " + error.toString() ); return};
    console.log(logAll.caller + ": " + result.toString() );
}

var logErrors = function logErrors (error, result) {
    if (error) {console.log(logAll.caller + ": " + error.toString() ); return};
    console.log(logAll.caller + ": " + result.toString() );
};

Utility.standardServerDbCallback = logAll;