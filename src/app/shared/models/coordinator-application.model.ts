export class CoordinatorApplication {
    _id: string;
    creationDate: Date;
    lastEditDate: Date;
    status: string;
    coordinator: string;
    email: string;

    constructor(data?) {
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.status = data.status || '';
        this.coordinator = data.coordinator || '';
        this.email = data.email || '';
    }
}