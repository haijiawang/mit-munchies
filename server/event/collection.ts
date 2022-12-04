import type {HydratedDocument, Types} from 'mongoose';
import type {Event} from './model';
import EventModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore events
 * stored in MongoDB, including adding, finding, updating, and deleting events.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Event> is the output of the EventModel() constructor,
 * and contains all the information in Event. https://mongoosejs.com/docs/typescript.html
 */
class EventCollection {
  /**
   * Add an event to the collection. Assumes valid formatting on dates has been checked by middleware. 
   *
   * @param {string} coordinatorId - The id of the coordinator of the event
   * @param {string} description - The description of the event request
   * @param {string} startrange - The start date of the event
   * @param {string} endrange - The end date of the event
   * @param {string} donationdate - The last day for accepting donations
   * @param {string} location - The location of the event
   * @param {string} contact - The preferred contact information for the event
   * @return {Promise<HydratedDocument<Event>>} - The newly created event
   */
  static async addOne(coordinatorId: Types.ObjectId | string, description: string, startrange: string,
    endrange: string, donationdate: string, location: string, contact: string): Promise<HydratedDocument<Event>> {
    const date = new Date();
    location.replace(/\s+/g, ''); // remove all whitespace
    const event = new EventModel({
      coordinatorId,
      dateCreated: date,
      description,
      startdate: new Date(startrange),
      enddate: new Date(endrange),
      donationdate: new Date(donationdate),
      location: location.toUpperCase(),
      event: 0,
      contact
    });
    await event.save(); // Saves event to MongoDB
    return event.populate('coordinatorId');
  }

  /**
   * Find an event by eventId
   *
   * @param {string} eventId - The id of the event to find
   * @return {Promise<HydratedDocument<Event>> | Promise<null> } - The event with the given eventId, if any
   */
  static async findOne(eventId: Types.ObjectId | string): Promise<HydratedDocument<Event>> {
    return EventModel.findOne({_id: eventId}).populate('coordinatorId');
  }

  /**
   * Get all the events in the database
   *
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
  static async findAll(): Promise<Array<HydratedDocument<Event>>> {
    // Retrieves events and sorts them by start date (decreasing)
    return EventModel.find({}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Get all the events in by given coordinator
   *
   * @param {string} username - The username of coordinator of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Event>>> {
    const coordinator = await UserCollection.findOneByUsername(username);
    return EventModel.find({coordinatorId: coordinator._id}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Get all the events in a given location
   *
   * @param {string} location - The location of the events (formatted as "CITY,ST")
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByLocation(location: string): Promise<Array<HydratedDocument<Event>>> {
    location.replace(/\s+/g, ''); // remove all whitespace
    return EventModel.find({location: location.toUpperCase()}).sort({startdate: -1}).populate('coordinatorId'); // standardize all uppercase
  }

  /**
   * Get all the events in a given location and within a given date range
   *
   * @param {string} startrange - The start date of the event date range
   * @param {string} endrange - The end date of the event date range
   * @param {string} location - TThe location of the events (formatted as "CITY,ST")
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByDateAndLocation(startrange: string, endrange: string = null, location: string): Promise<Array<HydratedDocument<Event>>> {
    location.replace(/\s+/g, ''); // remove all whitespace
    const start = new Date(startrange);
    if(endrange!==null && endrange!==(null as string)){
      const end = new Date(endrange);
      return EventModel.find({$and: [{location: location.toUpperCase()}, {$or: [{startdate:{$gte:start, $lt:end}}, {enddate:{$gte:start, $lt:end}}]}]}).sort({startdate: -1}).populate('coordinatorId'); // TODO: Double check date range
    }
    return EventModel.find({$and: [{location: location.toUpperCase()}, {startdate: {$gte:start}}]}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Get all the events in a given date range and by a specific coordinator
   *
   * @param {string} startrange - The start date of the event date range
   * @param {string} endrange - The end date of the event date range
   * @param {string} username - The username of coordinator of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByDateAndCoordinator(startrange: string, endrange: string = null, username: string): Promise<Array<HydratedDocument<Event>>> {
    const coordinator = await UserCollection.findOneByUsername(username);
    const start = new Date(startrange);
    if(endrange!==null && endrange!==(null as string)){
      const end = new Date(endrange);
      return EventModel.find({$and: [{coordinatorId: coordinator._id}, {$or: [{startdate:{$gte:start, $lt:end}}, {enddate:{$gte:start, $lt:end}}]}]}).sort({startdate: -1}).populate('coordinatorId'); // TODO: Double check date range
    }
    return EventModel.find({startdate: {$gte:start}}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Get all the events in a given location and with a given coordinator
   *
   * @param {string} location - TThe location of the events (formatted as "CITY,ST")
   * @param {string} username - The username of coordinator of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByLocationAndCoordinator(location: string, username: string): Promise<Array<HydratedDocument<Event>>> {
    location.replace(/\s+/g, ''); // remove all whitespace
    const coordinator = await UserCollection.findOneByUsername(username);
    return EventModel.find({$and: [{coordinatorId: coordinator._id}, {location: location.toUpperCase()}]}).sort({startdate: -1}).populate('coordinatorId'); // standardize all uppercase
  }

  /**
   * Get all the events in a given location, within a given date range, and by a given coordinator
   *
   * @param {string} startrange - The start date of the event date range
   * @param {string} endrange - The end date of the event date range
   * @param {string} location - TThe location of the events (formatted as "CITY,ST")
   * @param {string} username - The username of coordinator of the events
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByAllFilters(startrange: string, endrange: string = null, location: string, username: string): Promise<Array<HydratedDocument<Event>>> {
    location.replace(/\s+/g, ''); // remove all whitespace
    const coordinator = await UserCollection.findOneByUsername(username);
    const start = new Date(startrange);
    if(endrange!==null && endrange!==(null as string)){
      const end = new Date(endrange);
      return EventModel.find({$and: [{location: location.toUpperCase()}, {coordinatorId: coordinator._id}, {$or: [{startdate:{$gte:start, $lt:end}}, {enddate:{$gte:start, $lt:end}}]}]}).sort({startdate: -1}).populate('coordinatorId'); // TODO: Double check date range
    }
    return EventModel.find({$and: [{location: location.toUpperCase()}, {coordinatorId: coordinator._id}, {startdate: {$gte:start}}]}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Get all the events in a given location
   *
   * @param {string} startrange - The start date of the event date range
   * @param {string} endrange - The end date of the event date range
   * @return {Promise<HydratedDocument<Event>[]>} - An array of all of the events
   */
   static async findAllByDateRange(startrange: string, endrange: string = null): Promise<Array<HydratedDocument<Event>>> {
    const start = new Date(startrange);
    if(endrange!==null && endrange!==(null as string)){
      const end = new Date(endrange);
      return EventModel.find({$or: [{startdate:{$gte:start, $lt:end}}, {enddate:{$gte:start, $lt:end}}]}).sort({startdate: -1}).populate('coordinatorId'); // TODO: Double check date range
    }
    return EventModel.find({startdate: {$gte:start}}).sort({startdate: -1}).populate('coordinatorId');
  }

  /**
   * Update an event with new content
   *
   * @param {string} eventId - The id of the event to be updated
   * @param {string} description - The new description of the event
   * @param {string} startdate - The new starting date of the event
   * @param {string} enddate - The new ending date of the event
   * @param {string} donationdate - The new final date for accepting donations
   * @param {string} location - The new location of the event
   * @param {string} contact - The new contact information for the event
   * @return {Promise<HydratedDocument<Event>>} - The newly updated event
   */
  static async updateOne(eventId: Types.ObjectId | string, description: string = null, startdate: string = null,
    enddate: string = null, donationdate: string = null, location: string = null, contact: string = null): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    if(description !== null && description !== "") event.description = description;
    if(startdate !== null && startdate !== "") event.startdate = new Date(startdate);
    if(enddate !== null && enddate !== "") event.enddate = new Date(enddate);
    if(donationdate !== null && donationdate !== "") event.donationdate = new Date(donationdate);
    if(location !== null && location !== "") event.location = location;
    if(contact !== null && contact !== "") event.contact = contact;
    await event.save();
    return event.populate('coordinatorId');
  }

  /**
   * Update an event with new content
   *
   * @param {string} eventId - The id of the event to be updated
   * @param {number} eventflag - The status to push the event to
   * @return {Promise<HydratedDocument<Event>>} - The newly updated event
   */
   static async updateEventOne(eventId: Types.ObjectId | string, eventflag: number): Promise<HydratedDocument<Event>> {
    const event = await EventModel.findOne({_id: eventId});
    event.event = eventflag;
    await event.save();
    return event.populate('coordinatorId');
  }

  /**
   * Delete a event with given eventId.
   *
   * @param {string} eventId - The eventId of event to delete
   * @return {Promise<Boolean>} - true if the event has been deleted, false otherwise
   */
  static async deleteOne(eventId: Types.ObjectId | string): Promise<boolean> {
    const event = await EventModel.deleteOne({_id: eventId});
    return event !== null;
  }

  /**
   * Delete all the events by the given coordinator
   *
   * @param {string} coordinatorId - The id of coordinator of events
   */
  static async deleteMany(coordinatorId: Types.ObjectId | string): Promise<void> {
    await EventModel.deleteMany({coordinatorId});
  }
}

export default EventCollection;
