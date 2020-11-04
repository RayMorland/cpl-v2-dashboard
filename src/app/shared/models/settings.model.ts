export class Settings {
    _id: string;
    lastEditDate: Date;

    constructor(data?){
        data = data || {};
        this._id = data._id || '';
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
    }
}