import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Request on the backend
export type Request = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: Types.ObjectId;
  contact: string;
  description: string;
  dateCreated: Date;
  color: string;
  size: string;
  images: Array<string>
};

export type PopulatedRequest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: User;
  contact: string;
  description: string;
  dateCreated: Date;
  color: string;
  size: string;
  images: Array<string>
};

// Mongoose schema definition for interfacing with a MongoDB table
// Request stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RequestSchema = new Schema<Request>({
  // The author username
  author: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
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
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The color of the item
  color: {
    type: String,
    required: true
  },
  // The size of the item
  size: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  }
});

const RequestModel = model<Request>('Request', RequestSchema);
export default RequestModel;
