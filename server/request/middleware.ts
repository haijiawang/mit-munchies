import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import RequestCollection from "./collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isRequestExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.requestId);
  const request = validFormat ? await RequestCollection.findOne(req.params.requestId) : '';
  if (!request) {
    res.status(404).json({
      error: `Request with request ID ${req.params.requestId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidRequestContent = (req: Request, res: Response, next: NextFunction) => {
  const {contact, description} = req.body as {contact: string, description: string};
  if (!description.trim()) {
    res.status(400).json({
      error: 'Request content must be at least one character long.'
    });
    return;
  }
 //TODO: DELETE THIS OR CHANGE NUMBER
  if (description.length > 140) {
    res.status(413).json({
      error: 'Request content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidRequestModifier = async (req: Request, res: Response, next: NextFunction) => {
  const request = await RequestCollection.findOne(req.params.requestId);
  const userId = request.author; //TODO
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' requests.'
    });
    return;
  }

  next();
};

export {
  isValidRequestContent,
  isRequestExists,
  isValidRequestModifier
};
