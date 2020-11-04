export class Media {
    _id: string;
    creationDate: Date;
    lastEditDate: Date;
    title: string;
    description: string;
    url: string;

    constructor(data?){
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.title = data.title || '';
    }
}