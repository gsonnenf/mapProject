/**
 * Created by Greg on 6/18/2016.
 */


MessageWidget = class MessageWidget {
    constructor({inputElement,outputElement,submitButton }) {

        this.inputElement = inputElement;
        this.outputElement = outputElement;
        this.submitButton = submitButton;
        
        this.onSendMessage = new Utility.MulticastFunction();

        this.recentMessageDifferential = 1000*60*60*24;

        this.submitButton.click( ()=> { this.sendMessage(); });
        this.inputElement.keydown( (event)=> {
            if(event.keyCode == 13 && !( event.ctrlKey || event.shiftKey) ) {
                event.preventDefault();
                this.sendMessage();
            }
        });
    }

    /***************************************************************
     * CHAT FUNCTIONALITY
     *************************************************************/

    sendMessage() {
        this.onSendMessage( this.inputElement.val() );
        this.inputElement.val("");
    }

    scrollToEnd() {
        this.outputElement[0].scrollTop = this.outputElement[0].scrollHeight;
        //this.outputElement.stop().animate({ scrollTop: this.outputElement[0].scrollHeight }, 100);
    }

    clearMessages() {
        this.outputElement.empty();
    }

    printText( text ){
        var element = $('<div class="chatMessage"><span class="message">'+ text + '</span></div>');
        this.outputElement.append( element );
        this.scrollToEnd();


    }

    printMessageList( messageList ){
        for(let index in messageList) this.printMessage( messageList[index] );
    }

    printMessage( message ) {
        var nameClass = (Meteor.user().profile.userName == message.userName) ? "self" : "user";
        var time = new Date(message.createdAt);
        var currentTime = Date.now();
        var isRecent = ( (currentTime - this.recentMessageDifferential) < time);

        if (isRecent)
            var timeElement = $('<span>['+ ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2) + '] </span>');
        else
            var timeElement = $('<span>['+ Utility.MonthTable[time.getMonth()] +" "+ time.getDate() + '] </span>');
        //var time = Date(message.dateCreated);
        //console.log(time.getDate());
        var nameElement = $('<span class="'+ nameClass + '">' + message.userName + ': </span>');
        nameElement.click(()=>{});

        var element = $('<div class="chatMessage"><span class="message">'+ message.text + '</span></div>');
        element.prepend(nameElement);
        element.prepend(timeElement);

        this.outputElement.append( element );
        this.scrollToEnd();
    }
    
};