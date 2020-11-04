export class Plan {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  membershipId: string;
  active: boolean;
  name: string;
  stripeId: string;
  amount: number;
  interval: string;
  intervalCount: string;

  constructor(data?) {
    this._id = data._id || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.membershipId = data.membershipId || null;
    this.active = data.active || false;
    this.name = data.name || null;
    this.stripeId = data.stripeId || null;
    this.amount = data.amount || null;
    this.interval = data.interval || null;
    this.intervalCount = data.intervalCount || null;
  }
}
