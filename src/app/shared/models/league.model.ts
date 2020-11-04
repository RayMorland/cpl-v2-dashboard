import { CplEvent } from "./event.model";

export class League {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  description: string;
  phone: string;
  email: string;
  genders:
    {
      name: string;
      weightClasses: [
        {
          name: string;
          weightRange: {
            min: number;
            max: number;
          };
        }
      ];
    }[];
  divisions:
    {
      name: string;
      ageClasses: [
        {
          min: number;
          max: number;
        }
      ];
    }[];
  tests:
    {
      type: string;
      price: number;
    }[];
  categories: string[];
  events: CplEvent[];
  movements: string[];
  recordCertificate: {
    price: number;
  };
  officials: {
    type: string;
    name: string;
  }[];

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.description = data.description || null;
    this.phone = data.phone || "";
    this.email = data.email || "";
    this.genders = data.genders || [];
    this.divisions = data.divisions || [];
    this.tests = data.tests || [];
    this.categories = data.categories || [];
    this.events = data.events || [];
    this.movements = data.movements || [];
    this.recordCertificate = data.recordCertificate || {};
    this.officials = data.officials || [];
  }
}
