export class Notification {
    _id: string;
    creationDate: Date;
    lastEditDate: Date;
    type: string;
    title: string;
    description: string;
    url: string;

    constructor(data?) {
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.type = data.type || '';
        this.title = data.title || '';
    }
}
