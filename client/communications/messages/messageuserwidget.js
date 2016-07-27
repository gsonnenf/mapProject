/**
 * Created by Greg on 6/20/2016.
 */

export class MessageUserWidget {
    constructor({ userMenuElement}) {
        this.userMenuElement = userMenuElement;
        this.userElementList = [];
    }

    /***************************************************************
     * USER LIST FUNCTIONALITY
     **************************************************************/

    clearUserList() {
        this.userMenuElement.empty();
        this.userElementList = [];
    }

    addUserList( userList ) {
        userList.forEach( (user)=>{ this.addUser(user);} );
    }

    addUser( user ) {
        var index = this.userElementList.findIndex( ( userElement )=>{ user._id == userElement.user._id });
        if (index != -1) return; //User already in chat

        var element = this.createUserElement(user);
        var newUserElement = {user:user, element: element };

        this.userElementList.forEach( (userElement)=>{
            if ( user.name.toLowerCase() >= userElement.user.name.toLowerCase() ) return;
            this.userElementList.splice(index+1, 0, newUserElement);
            element.insertBefore(userElement.element);
            return;
        });
        this.userElementList.push(newUserElement);
        this.userMenuElement.append(newUserElement.element);
    }

    removeUser( user ) {
        let index = this.userElementList.findIndex( ( userElement )=>{ user._id == userElement.user._id });
        if (index == -1) {return;}
        this.userElementList[index].element.remove();
        this.userElementList.splice(index,1);
    }

    createUserElement( user ) {
        return $('<div>' + user.name + '</div>');
    }
}