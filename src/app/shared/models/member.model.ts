import { Membership } from "./membership.model";

export class Member {
    _id: string;
    userId: string;
    stripeId: string;
    cognitoId: string;
    status: string;
    email: string;
    creationDate: Date;
    lastEditDate: Date;
    personal?: {
        firstName?: string,
        lastName?: string,
        dob: Date,
        gender: string,
        phone: string,
        homeGym: string,
        coach: string,
        address: {
            street: string,
            province: string,
            country: string,
            postal: string,
            city: string
        }
    };
    membership: {
        membershipId: Membership,
        planId: string,
        stripeSubscription: string,
        feePaid: boolean,
        startDate: Date,
        endDate: Date,
        status: string,
        current_period_end: Date
    };
    // lifterPreferences: {
    //     weightClass: string,
    //     division: string,
    //     tested: boolean,
    //     category: string,
    //     events: string[]
    // };
    profile: {
        profilePicture: string,
        tagline: string,
        description: string,
        settings: [{

        }]
    };

    constructor(data?) {
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate || null;
        this.lastEditDate = data.lastEditDate || null;
        this.userId = data.userId || '';
        this.stripeId = data.stripeId || '';
        this.cognitoId = data.cognitoId || '';
        this.status = data.status || '';
        this.email = data.email || '';
        this.membership = data.membership ||  {
            stripeSubscription: '',
            membershipId: null,
            planId: null,
            startDate: null,
            endDate: null,
            current_period_end: null,
            status: ''
        };
        this.personal = data.personal ||  {
            firstName: '',
            lastName: '',
            dob: null,
            gender: '',
            phone:  '',
            homeGym: '',
            coach: '',
            address: {
                street: '',
                province: '',
                country: '',
                postal: '',
                city: ''
            }
        };
        // this.lifterPreferences =  {
        //     weightClass: data.lifterPreferences.weightClass || '',
        //     division: data.lifterPreferences.division || '',
        //     tested: data.lifterPreferences.tested || '',
        //     category: data.lifterPreferences.category || '',
        //     events: data.lifterPreferences.events || '',
        // };
        this.profile = data.profile || {
            profilePicture: '',
            tagline: '',
            description: '',
            settings: [{
            }]
        };
    }
}
