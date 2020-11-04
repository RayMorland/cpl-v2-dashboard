export class RecordGroup {
    _id: string;
    creationDate: Date;
    lastEditDate: Date;
    resultFileLink: string;
    level: string;
    gender: string;
    drugTest: string;
    division: string;
    ageClasses: string[];
    category: string;
    weightClasses: [
      {
        name: string;
        weight: string;
      }
    ];
    recordType: string;
    records: [];

    constructor(data?) {
        data = data || {};
        this._id = data._id || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.resultFileLink = data.resultFileLink || '';
        this.level = data.level || '';
        this.gender = data.gender || '';
        this.drugTest = data.drugTest || '';
        this.division = data.division || '';
        this.ageClasses =  data.ageClasses || [];
        this.category = data.category || '';
        this.weightClasses = data.weightClasses || [];
        this.records = data.records || [];
    }
}