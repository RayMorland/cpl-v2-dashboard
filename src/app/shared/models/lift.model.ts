interface Attempt {
  weight: number;
  success: boolean;
}

export class Lift {
  _id: string;
  status: string;
  gender: string;
  memberId: string;
  meetId: string;
  testing: string;
  category: string;
  events: string[];
  divisions: {
    name: string;
    ageClass: {
      min: number;
      max: number;
    };
  }[];
  weightClass: string;
  liftType: string;
  rackPosition: string;
  rackHeight: number;
  startingWeight: number;
  attempt1: Attempt;
  attempt2: Attempt;
  attempt3: Attempt;
  highestWeight: number;
  isRecord: Boolean;
  records: string[];
  resultId: string;

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.status = data.status || null;
    this.memberId = data.memberId || null;
    this.meetId = data.meetId || null;
    this.gender = data.gender || null;
    this.testing = data.testing || null;
    this.category = data.category || null;
    this.events = data.events || [];
    this.divisions = data.divisions || [];
    this.weightClass = data.weightClass || null;
    this.liftType = data.liftType || null;
    this.rackPosition = data.rackPosition || null;
    this.rackHeight = data.rackHeight || null;
    this.startingWeight = data.startingWeight || null;
    this.attempt1 = data.attempt1 || null;
    this.attempt2 = data.attempt2 || null;
    this.attempt3 = data.attempt3 || null;
    this.highestWeight = data.highestWeight || null;
    this.isRecord = data.singleLiftRecord || null;
    this.records = data.singleLiftRecordId || null;
    this.resultId = data.resultId || null;
  }
}
