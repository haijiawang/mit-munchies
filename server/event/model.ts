import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

/**
 * This file defines the properties stored in an Event
 */

// Type definition for Event on the backend
// TODO: Add title, phone, email
export type Event = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  coordinatorId: Types.ObjectId;
  dateCreated: Date; // for recordkeeping
  description: string;
  startdate: Date;
  enddate: Date;
  donationdate: Date;
  location: string;
  event: number;
  contact: string;
  images: Array<string>;
};

export type PopulatedEvent = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  coordinatorId: User;
  dateCreated: Date; // for recordkeeping
  description: string;
  startdate: Date;
  enddate: Date;
  donationdate: Date;
  location: string;
  event: number;
  contact: string;
  images: Array<string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Events stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const EventSchema = new Schema<Event>({
  // The coordinator userId
  coordinatorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the event was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The description of the event request
  description: {
    type: String,
    required: true
  },
  // The start date of the event
  startdate: {
    type: Date,
    required: true
  },
  // The end date of the event
  enddate: {
    type: Date,
    required: true
  },
  // The final date for which the event is accepting donations
  donationdate: {
    type: Date,
    required: true
  },
  // The location of the event
  location: {
    type: String,
    required: true
  },
  // The event flag (0 for request, 1 for event published)
  event: {
    type: Number,
    required: true
  },
  // The content of the event
  contact: {
    type: String,
    required: false // Not required but users can opt into using their profile contact information (required)
  },
  images: {
    type: [String],
    required: true
  }
});

const EventModel = model<Event>('Event', EventSchema);
export default EventModel;
