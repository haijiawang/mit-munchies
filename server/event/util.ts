import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Event, PopulatedEvent } from '../event/model';

type EventResponse = {
  _id: string;
  coordinatorId: string;
  dateCreated: string;
  description: string;
  startdate: string;
  enddate: string;
  donationdate: string;
  location: string;
  event: string; // TODO: Possibly need to change to number, if it can be processed by frontend
  contact: string;
  images: Array<string>;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Event object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Event>} event - An event
 * @returns {EventResponse} - The event object formatted for the frontend
 */
const constructEventResponse = (event: HydratedDocument<Event>): EventResponse => {
  const eventCopy: PopulatedEvent = {
    ...event.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const { username } = eventCopy.coordinatorId;
  delete eventCopy.coordinatorId;
  return {
    ...eventCopy,
    _id: eventCopy._id.toString(),
    coordinatorId: username,
    dateCreated: formatDate(event.dateCreated),
    description: eventCopy.description,
    startdate: formatDate(eventCopy.startdate),
    enddate: formatDate(eventCopy.enddate),
    donationdate: formatDate(eventCopy.donationdate),
    location: eventCopy.location, // TODO: Format if necessary (add space between city and state)
    event: eventCopy.event.toString(),
    contact: eventCopy.contact,
    images: eventCopy.images
  };
};

export {
  constructEventResponse
};
