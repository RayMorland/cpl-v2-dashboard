import {CplEvent} from './event.model';

interface Item {
    type: string;
    price: number;
}

export class Meet {
  _id: string;
  coordinator: {
    _id: string;
    name: string;
    stripeId: string;
  };
  status: string;
  creationDate?: Date;
  lastEditDate?: Date;
  releaseDate?: Date;
  title?: string;
  subtitle: string;
  description?: string;
  images?: string[];
  dates?: [
    {
      start?: Date;
      end?: Date;
    }
  ];
  eventInfo?: {
    categories?: string[];
    events?: CplEvent[];
    testing?: Item[];
  };
  weighInInfo?: {
    info?: string;
    link: string;
    times?: {
      start?: Date;
      end?: Date;
    };
    location?: {
      name?: string;
      address?: {
        street?: string;
        city?: string;
        province?: string;
        country?: string;
        postal?: string;
      };
    };
  };
  venue?: {
    info?: string;
    link?: string;
    location?: {
      name?: string;
      address?: {
        street?: string;
        city?: string;
        province?: string;
        country?: string;
        postal?: string;
      };
    };
  };
  accommodation?: {
    info?: string;
    link?: string;
    location?: {
      name?: string;
      address?: {
        street?: string;
        city?: string;
        province?: string;
        country?: string;
        postal?: string;
      };
    };
  };
  registrationFormLink?: string;
  capacity?: number;
  registrationClosingDate?: Date;
  registrationClosed?: boolean;
  additionalInfo?: string;
  resultsDocumentUrl?: string;
  tags: [];
  merchandise: [
    {
      item: string;
      description: string;
      price: number;
    }
  ];
  fees: {
    type: string;
    price: number;
  };

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.coordinator = data.coordinator || {
      _id: null,
      name: null,
      stripeId: null,
    };
    this.status = data.status || "inactive";
    this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
    this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
    this.releaseDate = data.releaseDate ? new Date(data.releaseDate) : null;
    this.title = data.title || null;
    this.subtitle = data.subtitle || null;
    this.description = data.description || null;
    this.images = data.images || [];
    this.dates = data.dates || [];
    this.weighInInfo = data.weighInInfo || {
      info: null,
      link: null,
      time: null,
      location: {
        name: null,
        address: {
          street: null,
          city: null,
          province: null,
          country: null,
          postal: null,
        },
      },
    };
    this.eventInfo = data.eventInfo || {
      categories: [],
      events: [],
      testing: [],
    };
    this.venue = data.venue || {
      info: null,
      link: null,
      location: {
        name: null,
        address: {
          street: null,
          city: null,
          province: null,
          country: null,
          postal: null,
        },
      },
    };
    this.accommodation = data.accommodation || {
      info: null,
      link: null,
      location: {
        name: null,
        address: {
          street: null,
          city: null,
          province: null,
          country: null,
          postal: null,
        },
      },
    };
    this.registrationFormLink = data.registrationFormLink || null;
    this.capacity = data.capacity || null;
    this.registrationClosingDate = data.registrationClosingDate
      ? new Date(data.registrationClosingDate)
      : null;
    this.registrationClosed = data.registrationClosed ? true : false;
    this.additionalInfo = data.additionalInfo || null;
    this.resultsDocumentUrl = data.resultsDocumentUrl || null;
    this.tags = [];
    this.merchandise = data.merchandise || null;
    this.fees = data.fees || null;
  }
}
