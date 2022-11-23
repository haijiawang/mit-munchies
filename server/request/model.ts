import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Request on the backend
export type Request = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: string;
  contact: string;
  description: string;
  startDate: Date;
  endDate: Date;
  dateCreated: Date;
};

export type PopulatedRequest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: string;
  contact: string;
  description: string;
  startDate: Date;
  endDate: Date;
  dateCreated: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Request stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RequestSchema = new Schema<Request>({
  // The author username
  author: {
    // Use Types.ObjectId outside of the schema
    type: String,
    required: true,
  },
  // The contact of the user
  contact: {
    // Use Types.ObjectId outside of the schema
    type: String,
    required: true,
  },
  // The description of the request
  description: {
    // Use Types.ObjectId outside of the schema
    type: String,
    required: true,
  },
  // The date the post is open for
  startDate: {
    type: Date,
    required: true
  },
  // The end date of the request
  endDate: {
    type: Date,
    required: true
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  }
});

const RequestModel = model<Request>('Request', RequestSchema);
export default RequestModel;
