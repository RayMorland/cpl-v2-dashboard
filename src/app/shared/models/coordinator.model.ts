export class Coordinator {
    _id: string;
    status: string;
    userId: string;
    stripeId: string;
    cognitoId: string;
    email: string;
    name: string;
    phone: string;
    creationDate: Date;
    lastEditDate: Date;
    coordinatorLogo: string;
    hq?: {
        province: string,
        city: string,
        street: string,
        postal: string,
        country: string
    };
    profile: object;
    settings: object;


    constructor(data?) {
        data = data || {};
        this._id = data._id || null;
        this.status = data.status || 'inactive';
        this.userId = data.userId || null;
        this.stripeId = data.stripeId || null;
        this.cognitoId = data.stripeId || null;
        this.email = data.email || null;
        this.name = data.name || null;
        this.phone = data.phone || null;
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.coordinatorLogo = data.coordinatorLogo || null;
        this.hq = data.hq || {
            province: null,
            city: null,
            street: null,
            postal: null,
            country: null
        };
        this.profile = data.profile || null;
        this.settings = data.settings || null;
    }
}