import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import EventCollection from '../event/collection';

const states = new Set<string>([ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 
'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 
'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']);

/**
 * Checks if a user with userId as coordinator id in req.query exists
 */
 const isCoordinatorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.coordinator) {
    res.status(400).json({
      error: 'Provided coordinator username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.coordinator as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.coordinator as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the start and end dates of an event in req.query are valid. 
 */
 const isValidDatesQuery = async (req: Request, res: Response, next: NextFunction) => {
  if(!req.query.startrange){
    res.status(400).json({
      error: `No start date provided for finding events.`
    });
    return;
  }

  const start = new Date(req.query.startrange.toString());
  if (!(start instanceof Date) || isNaN(start.getTime())){ // is startrange valid
    res.status(404).json({
      error: `Start date ${req.query.startrange} for event is not a valid date.`
    });
    return;
  }

  if(req.query.endrange!==undefined && req.query.endrange!==(null as string)){
    const end = new Date(req.query.endrange.toString());
    if (!(end instanceof Date) || isNaN(end.getTime())){ // is endrange valid
      res.status(404).json({
        error: `End date ${req.query.endrange} for event is not a valid date.`
      });
      return;
    }

    if (end.getTime() < new Date().getTime()){ // has end date already passed
      res.status(404).json({
        error: `End date ${req.query.endrange} is earlier than today's date ${new Date().toString()}.`
      });
      return;
    }

    if (end.getTime() < start.getTime()){ // is end date earlier than start date
      res.status(404).json({
        error: `End date ${req.query.endrange} is earlier than start date ${req.query.startrange}.`
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the start and end dates of an event in req.body are valid. 
 */
 const isValidDatesBody = async (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.startrange){
    res.status(400).json({
      error: `No start date provided for finding events.`
    });
    return;
  }

  const start = new Date(req.body.startrange.toString());
  if (!(start instanceof Date) || isNaN(start.getTime())){ // is startrange valid
    res.status(404).json({
      error: `Start date ${req.body.startrange} for event is not a valid date.`
    });
    return;
  }

  if(req.body.endrange!==undefined && req.body.endrange!==(null as string)){
    const end = new Date(req.body.endrange.toString());
    if (!(end instanceof Date) || isNaN(end.getTime())){ // is endrange valid
      res.status(404).json({
        error: `End date ${req.body.endrange} for event is not a valid date.`
      });
      return;
    }

    if (end.getTime() < new Date().getTime()){ // has end date already passed
      res.status(404).json({
        error: `End date ${req.body.endrange} is earlier than today's date ${new Date().toString()}.`
      });
      return;
    }

    if (end.getTime() < start.getTime()){ // is end date earlier than start date
      res.status(404).json({
        error: `End date ${req.body.endrange} is earlier than start date ${req.body.startrange}.`
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the location in req.query for an event is valid. 
 */
const isValidLocation = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.location){
    res.status(400).json({
      error: `No event location provided.`
    });
    return;  
  }

  const [city, st] = req.query.location.toString().split(',');
  if (!city.trim() || !st.trim()){
    res.status(404).json({
      error: `Incomplete location details provided.`
    });
    return;  
  }

  if (!states.has(st)){
    res.status(404).json({
      error: `Location state is not a valid state.`
    });
    return;  
  }

  next();
};

/**
 * Checks if the appropriate fields have been filled in for each required parameter of an event. 
 */
const isValidContent = (req: Request, res: Response, next: NextFunction) => {
  const {description, startdate, enddate, donationdate, location, contact} = req.body as {description: string, 
    startdate: string, enddate: string, donationdate: string, location: string, contact: string};

  if (!description.trim() || !startdate.trim() || !enddate.trim() || !donationdate.trim() ||
  !location.trim() || !contact.trim()) {
    res.status(400).json({
      error: 'Required event information missing.'
    });
    return;
  }

  next();
};

/**
 * Checks if the provided donation date is valid. 
**/
const isValidDonationDate = async (req: Request, res: Response, next: NextFunction) => {
  if(!req.body.donationdate){
    res.status(400).json({
      error: `No donation date provided for the event.`
    });
    return;
  }

  const date = new Date(req.body.donactiondate.toString());
  if (!(date instanceof Date) || isNaN(date.getTime())){ 
    res.status(404).json({
      error: `Donation date ${req.body.donationdate} for event is not a valid date.`
    });
    return;
  }

  next();
};

/**
 * Checks if a event with eventId in req.params exists.
 */
 const isEventExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.eventId);
  const event = validFormat ? await EventCollection.findOne(req.params.eventId) : '';
  if (!event) {
    res.status(404).json({
      error: `Event with event ID ${req.params.eventId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the coordinator of the event whose eventId is in req.params
 */
 const isValidCoordinator = async (req: Request, res: Response, next: NextFunction) => {
  const event = await EventCollection.findOne(req.params.eventId);
  const userId = event.coordinatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' events.'
    });
    return;
  }

  next();
};

/**
 * Checks if the event flag provided is a valid value (0, 1)
 */
 const isValidEventFlag = async (req: Request, res: Response, next: NextFunction) => {
  const {event} = req.body.event as {event: number};
  if (!(event === 0 || event === 1)) {
    res.status(404).json({
      error: `Event flag ${req.body.event} is not a valid flag.`
    });
    return;
  }

  next();
};

export {
  isCoordinatorExists,
  isValidDatesQuery,
  isValidDatesBody,
  isValidLocation,
  isValidContent,
  isValidDonationDate,
  isEventExists,
  isValidCoordinator,
  isValidEventFlag
};
