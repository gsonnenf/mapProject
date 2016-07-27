/**
 * Created by Greg on 6/27/2016.
 */

migrationList = (typeof migrationList == "undefined") ? [] : migrationList;

migrationList.push( new Migration({
    version: 1,
    identifierString: "Reset Database",
    description: "Adds states to database",
    up: ()=> {
        
    },
    down: ()=> {
        
    }
}));