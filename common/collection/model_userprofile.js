/**
 * Created by Greg on 6/25/2016.
 */

UserProfileModel = class UserProfileModel {
    constructor({picUrl, location, aboutInfo, contactInfo, team}){
        this.picUrl = picUrl;
        this.location = location;
        this.contactInfo = contactInfo;
        this.aboutInfo = aboutInfo;
        this.team = team;
    }
};