import * as mongoose from 'mongoose';
import {Office, OfficeMember} from '../../../common/office.model';

var MemberSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    email: String,
});

var OfficeMemberSchema = new mongoose.Schema({
    member: MemberSchema,
    roles: [String]
});

export const OfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    zipCode: String,
    city: String,
    price: Number,
    paymentTypes: [String],
    members: [OfficeMemberSchema],
    createdBy: String,
    updatedBy: String,
}, { timestamps: true });

export type OfficeType = Office & mongoose.Document;