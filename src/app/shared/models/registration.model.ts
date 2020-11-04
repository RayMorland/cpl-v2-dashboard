interface Fees {
  recordCertificate: {
    purchased: boolean;
    price: number;
  };
  meetFees: [
    {
      type: string;
      price: number;
    }
  ];
  merchandise: [
    {
      item: string;
      description: string;
      price: number;
    }
  ];
  total: number;
}

interface Movement {
  type: string;
  openingWeight: number;
  rackHeight: number;
  safetyHeight: number;
  rackPosition: string;
}

interface RegistrationEvent {
  type: string;
}

interface Division {
  name: string;
  ageClass: {
    min: number;
    max: number;
  };
}

interface Merchandise {
  item: string;
  description: string;
  price: number;
}

export class Registration {
  _id: string;
  creationDate: Date;
  lastEditDate: Date;
  meetId: string;
  memberId: string;
  status: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  gender: string;
  address: {
    street: string;
    province: string;
    country: string;
    postal: string;
    city: string;
  };
  competitionInfo: {
    weightClass: string;
    divisions: Division[];
    category: string;
    test: string;
    events: RegistrationEvent[];
    movements: Movement[];
  };
  fees: {
    recordCertificate: {
      purchased: boolean;
      price: number;
    };
    meetFees: [
      {
        type: string;
        price: number;
      }
    ];
    merchandise: Merchandise[];
    paymentIntent: string;
    paymentIntentStatus: string;
    feesPaid: boolean;
    total: number;
  };

  constructor(data?) {
    data = data || {};
    this._id = data._id || null;
    this.creationDate = data.creationDate || null;
    this.lastEditDate = data.lastEditDate || null;
    this.meetId = data.meetId || null;
    this.memberId = data.memberId || null;
    this.status = data.status || "unpaid";
    this.name = data.name || null;
    this.email = data.email || null;
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || null;
    this.competitionInfo = data.competitionInfo || {
      weightClass: null,
      divisions: [],
      category: "",
      test: "",
      events: [],
      movements: []
    };
    this.address = data.address || {
      street: "",
      province: "",
      country: "",
      postal: "",
      city: "",
    };
    this.fees = data.fees || {
      recordCertificate: {
        purchased: false,
        price: null,
      },
      meetFees: [],
      merchandise: [],
      feesPaid: false,
      total: null,
      paymentIntent: null,
      paymentIntentStatus: null,
    };
  }
}
