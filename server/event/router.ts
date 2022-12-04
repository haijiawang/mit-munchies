import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import EventCollection from './collection';
import * as userValidator from '../user/middleware';
import * as eventValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the events
 *
 * @name GET /api/events
 *
 * @return {EventResponse[]} - A list of all the events sorted in descending
 *                      order by event start date
 */
/**
 * Get events by coordinator.
 *
 * @name GET /api/events?coordinator=username
 *
 * @return {EventResponse[]} - An array of events created by user with username, coordinator
 * @throws {400} - If coordinator is not given
 * @throws {404} - If coordinator is not a recognized username of any user
 *
 */
/**
 * Get events occurring within a given date range.
 *
 * @name GET /api/events?startrange=start&endrange=end
 *
 * @return {EventResponse[]} - An array of events occurring within a given date range
 * @throws {400} - If startrange is not given (if endrange is not given, assume no end date)
 * @throws {404} - If startrange or endrange is invalid
 * @throws {404} - If startrange is past the current date
 *
 */
/**
 * Get events by location.
 *
 * @name GET /api/events?location=location
 *
 * @return {EventResponse[]} - An array of events taking place at location
 * @throws {400} - If location is not given
 * @throws {404} - If location is invalid (i.e. improperly formatted as city,state(two-letter abbreviation))
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.coordinator !== undefined || req.query.startrange !== undefined
      || req.query.location !== undefined) { // any query parameter supplied
      next();
      return;
    }
    // All events on or after today's date
    const allEvents = await EventCollection.findAllByDateRange(new Date().toString());
    const response = allEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  }, 
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.startrange === undefined || req.query.location === undefined || req.query.coordinator === undefined) {
      next();
      return;
    }
    eventValidator.isCoordinatorExists; 
    eventValidator.isValidDatesQuery;
    eventValidator.isValidLocation;

    // Filter by location, date, and coordinator
    let end = (req.query.endrange !== undefined) ? req.query.endrange : null;
    const events = await EventCollection.findAllByAllFilters(req.query.startrange as string, end as string, 
      req.query.location as string, req.query.coordinator as string);
    const response = events.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => { 
    if (req.query.startrange !== undefined || req.query.location === undefined || req.query.coordinator === undefined) {
      next();
      return;
    }
    eventValidator.isCoordinatorExists; 
    eventValidator.isValidLocation;

    // Filter by location and coordinator
    const events = await EventCollection.findAllByLocationAndCoordinator(req.query.location as string, req.query.coordinator as string);
    const response = events.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => { 
    if (req.query.startrange === undefined || req.query.location !== undefined || req.query.coordinator === undefined) {
      next();
      return;
    }
    eventValidator.isCoordinatorExists; 
    eventValidator.isValidDatesQuery;

    // Filter by dates and coordinator
    let end = (req.query.endrange !== undefined) ? req.query.endrange : null;
    const events = await EventCollection.findAllByDateAndCoordinator(req.query.startrange as string, end as string, req.query.coordinator as string);
    const response = events.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => { 
    if (req.query.startrange === undefined || req.query.location === undefined || req.query.coordinator !== undefined) {
      next();
      return;
    }
    eventValidator.isValidLocation; 
    eventValidator.isValidDatesQuery;

    // Filter by location and dates
    let end = (req.query.endrange !== undefined) ? req.query.endrange : null;
    const events = await EventCollection.findAllByDateAndLocation(req.query.startrange as string, end as string, req.query.location as string);
    const response = events.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.startrange !== undefined || req.query.location !== undefined) {
      next();
      return;
    }
    eventValidator.isCoordinatorExists; 

    // Events by coordinator
    const coordinatorEvents = await EventCollection.findAllByUsername(req.query.coordinator as string);
    const response = coordinatorEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.location !== undefined) {
      next();
      return;
    }
    eventValidator.isValidDatesQuery; 

    // Events by date
    let end = (req.query.endrange !== undefined) ? req.query.endrange : null;
    const dateEvents = await EventCollection.findAllByDateRange(req.query.startrange as string, end as string);
    const response = dateEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  },
  // Events by location
  async (req: Request, res: Response) => {
    eventValidator.isValidLocation; 

    const locEvents = await EventCollection.findAllByLocation(req.query.location as string);
    const response = locEvents.map(util.constructEventResponse);
    res.status(200).json(response);
  },
);

/**
 * Create a new event.
 *
 * @name POST /api/events
 *
 * @param {string} startdate - Start date of the event formatted as "yyyy-mm-dd"
 * @param {string} enddate - End date of the event formatted as "yyyy-mm-dd"
 * @param {string} location - The location of the event
 * @param {string} description - The description of the items the coordinator is looking for to be donated
 * @param {string} contact - The contact method (phone or email) by which the coordinator wants to setup donation drop offs
 * @param {string} donationdate - Last date for accepting donations, formatted as "yyyy-mm-dd"
 * @return {EventResponse} - The created event
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the any of the event content is empty
 * @throws {404} - If the startdate or enddate are invalid, or is enddate is distinctly earlier than startdate
 * @throws {404} - If the donationdate is invalid
 * @throws {404} - If the location state abbreviation does not exist
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isValidContent, 
    eventValidator.isValidDatesBody,
    eventValidator.isValidDonationDate,
    eventValidator.isValidLocation
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const event = await EventCollection.addOne(userId, req.body.description, req.body.startdate, req.body.enddate,
      req.body.donactiondate, req.body.location, req.body.contact);

    res.status(201).json({
      message: 'Your event was created successfully.',
      event: util.constructEventResponse(event)
    });
  }
);

/**
 * Delete an event
 *
 * @name DELETE /api/events/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not the coordinator of the event
 * @throws {404} - If the eventId is not valid
 */
router.delete(
  '/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isEventExists, 
    eventValidator.isValidCoordinator 
  ],
  async (req: Request, res: Response) => {
    await EventCollection.deleteOne(req.params.eventId);
    res.status(200).json({
      message: 'Your event was deleted successfully.'
    });
  }
);

/**
 * Modify an event.
 *
 * @name PATCH /api/events/:id
 *
 * @param {string} startdate - Start date of the event formatted as "yyyy-mm-dd"
 * @param {string} enddate - End date of the event formatted as "yyyy-mm-dd"
 * @param {string} location - The location of the event
 * @param {string} description - The description of the items the coordinator is looking for to be donated
 * @param {string} contact - The contact method (phone or email) by which the coordinator wants to setup donation drop offs
 * @param {string} donationdate - Last date for accepting donations, formatted as "yyyy-mm-dd"
 * @return {EventResponse} - The updated event
 * @throws {403} - If the user is not logged in or is not the coordinator of the event
 * @throws {400} - If the any of the event content is empty
 * @throws {404} - If the startdate or enddate are invalid, or is enddate is distinctly earlier than startdate
 * @throws {404} - If the donationdate is invalid
 * @throws {404} - If the location state abbreviation does not exist
 */
/**
 * Modify an event's status
 *
 * @name PATCH /api/events/:id
 *
 * @param {number} event - Status of the event to update
 * @return {EventResponse} - The updated event
 * @throws {400} - If all fields are empty
 * @throws {403} - if the user is not logged in or not the coordinator of the event
 * @throws {404} - If the eventId is not valid
 */
router.patch(
  '/:eventId?',
  [
    userValidator.isUserLoggedIn,
    eventValidator.isValidCoordinator
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.event !== undefined) {
      next();
      return;
    }

    eventValidator.isValidContent; 
    eventValidator.isValidDatesBody;
    eventValidator.isValidDonationDate;
    eventValidator.isValidLocation;

    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const event = await EventCollection.updateOne(userId, req.body.description, req.body.startdate, req.body.enddate,
      req.body.donationdate, req.body.location, req.body.contact);

    res.status(200).json({
      message: 'Your event was updated successfully.',
      event: util.constructEventResponse(event)
    });
  },
  async (req: Request, res: Response) => {
    eventValidator.isValidEventFlag; 

    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const event = await EventCollection.updateEventOne(userId, req.body.event);

    res.status(200).json({
      message: 'Your event was updated successfully.',
      event: util.constructEventResponse(event)
    });
  },
);

export { router as eventRouter };
