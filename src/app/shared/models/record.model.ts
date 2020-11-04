export class Record {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  recordDate: Date;
  overthrownDate: Date;
  currentRecord: boolean;
  memberId: string;
  memberName: string;
  meetId: string;
  meetName: string;
  resultId: string;
  division: {
    ageClass: { min: number; max: number };
    name: string;
  };
  level: string;
  category: string;
  competition: string;
  testing: string;
  gender: string;
  weightClass: {
    name: string;
    weightRange: { min: number; max: number };
  };
  ageClass: string;
  event: string;
  weight: number;
  nationalRecord: {
    isNationalRecord: boolean;
  };
  provincialRecord: {
    isProvincialRecord: boolean;
    province: string;
  };

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
    this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
    this.memberId = data.memberId || null;
    this.memberName = data.memberName || '';
    this.meetId = data.meetId || null;
    this.meetName = data.meetName || "";
    this.resultId = data.resultId || null;
    this.recordDate = data.recordDate ? new Date(data.recordDate) : null;
    this.overthrownDate = data.overthrownDate
      ? new Date(data.overthrownDate)
      : null;
    this.currentRecord = data.currentRecord || false;
    this.division = data.division || {};
    this.level = data.level || "";
    this.category = data.category || "";
    this.testing = data.tested || "";
    this.competition = data.competition || "";
    this.gender = data.gender || "";
    this.weightClass = data.weightClass || "";
    this.ageClass = data.ageClass || "";
    this.event = data.event || "";
    this.weight = data.weight || null;
    this.nationalRecord = data.nationalRecord || {};
    this.provincialRecord = data.provincialRecord || {};
  }
}
