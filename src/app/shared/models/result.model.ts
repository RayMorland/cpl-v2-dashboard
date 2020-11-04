import { Lift } from "./lift.model";

export class Result {
  _id: string;
  status: string;
  creationDate: Date;
  lastEditDate: Date;
  registrationId: string;
  name: string;
  memberId: string;
  memberName: string;
  meetId: string;
  meetTitle: string;
  resultDate: Date;
  gender: string;
  testing: string;
  divisions: {
    name: string,
    ageClass: {
      min: number,
      max: number
    }
  }[];
  category: string;
  events: string[];
  weightClass: string;
  weightAtWeighIn: number;
  lifts: Lift[];
  total: number;
  totalRecord: boolean;
  totalRecordId: string;
  wilksScore: number;

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.status = data.status || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.registrationId = data.registrationId || null;
    this.memberId = data.memberId || null;
    this.memberName = data.memberName || null;
    this.meetId = data.meetId || null;
    this.meetTitle = data.meetTitle || null;
    this.resultDate = data.resultDate || null;
    this.gender = data.gender || null;
    this.testing = data.testing || null;
    this.divisions = data.divisions || [];
    this.category = data.category || null;
    this.events = data.events || [];
    this.weightClass = data.weightClass || null;
    this.weightAtWeighIn = data.weightAtWeighIn || null;
    this.lifts = data.lifts || [];
    this.total = data.total || null;
    this.totalRecord = data.totalRecord || false;
    this.totalRecordId = data.totalRecordId || null;
    this.wilksScore = data.wilksScore || null;
  }
}
