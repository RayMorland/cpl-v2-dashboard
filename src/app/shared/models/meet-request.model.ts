export class MeetRequest {
    _id: string;
    meetId: string;
    coordinatorId: string;
    creationDate: Date;
    lastEditDate: Date;
    title: string;
    submissions: [{
        date: Date,
        rejectInfo: {
            date: Date,
            reason: string,
            message: string
        }
    }];
    approvalDate: Date;
    meetApproved: boolean;

    constructor(data?) {
        data = data || {};
        this._id = data._id || '';
        this.meetId = data.meetId || '';
        this.coordinatorId = data.coordinaotrId || '';
        this.creationDate = data.creationDate ? new Date(data.creationDate) : null;
        this.lastEditDate = data.lastEditDate ? new Date(data.lastEditDate) : null;
        this.title = data.title || '';
        this.submissions = data.submissions || [];
        this.approvalDate = data.approvalDate || null;
        this.meetApproved = data.meetApproved || false;
    }
}