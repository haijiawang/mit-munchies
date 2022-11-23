import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import {Types} from "mongoose";
import {PopulatedRequest} from "./model";

// Update this if you add a property to the Freet type!
type RequestResponse = {
  _id: string;
  author: string;
  contact: string;
  description: string;
  startDate: string;
  endDate: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructRequestResponse = (request: HydratedDocument<Request>): RequestResponse => {
  const requestCopy: PopulatedRequest = {
    ...request.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...requestCopy,
    _id: requestCopy._id.toString(),
    author:requestCopy.author,
    contact: requestCopy.contact,
    description: requestCopy.description,
    startDate: requestCopy.startDate,
    endDate: requestCopy.endDate,
    dateCreated: requestCopy.dateCreated
  };
};

export {
  constructRequestResponse
};
