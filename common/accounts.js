/**
 * Created by Greg on 5/7/2016.
 */

AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
});

AccountsTemplates.addField({
    _id: 'name',
    type: 'text',
    displayName: 'RL Name',
    placeholder: {
        signUp: "Name Here"
    },
    required: true,
});

AccountsTemplates.addField({
    _id: 'ingressName',
    type: 'text',
    displayName: 'Ingress Name',
    placeholder: {
        signUp: "Ingress Name Here"
    },
    required: true,
});

AccountsTemplates.addField({
    _id: "team",
    type: "select",
    displayName: "Ingress Team",
    select: [
        {
            text: "Blue",
            value: "blue",
        }, {
            text: "Green",
            value: "green",
        },
    ],
});

//TODO: Fix the real problem of app not working after logged in unless reloaded
//if (Meteor.isClient) Accounts.onLogout(function() { location.reload(); });
