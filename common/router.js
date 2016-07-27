Router.route( '/',
    function () {
        var currentUser = Meteor.userId();
        if (currentUser) this.render('ingressMapTool');
        else this.render( 'ingressLogin');
    }
);

Router.route('test',  function(){this.render('test');});

console.log("Routes Registered.")