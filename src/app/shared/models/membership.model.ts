import { Plan } from './plan.model';

export class Membership {
  _id: string;
  stripeId: string;
  creationDate: Date;
  lastEditDate: Date;
  name: string;
  description: string;
  plans: Plan[];
  status: string;
  attributes: string[];

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.name = data.name || null;
    this.description = data.description || null;
    this.status = data.status || 'inactive';
    this.plans = data.plans || [];
    this.attributes = data.attributes || [];
  }
}
