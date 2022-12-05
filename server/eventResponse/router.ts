import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import EventResponseCollection from './collection';
import * as userValidator from '../user/middleware';
import * as eventValidator from '../event/middleware';
import * as eventResponseValidator from './middleware';
// import * as freetValidator from '../freet/middleware';
import * as util from './util';
import { constructEventResponseResponse } from 'server/eventResponse/util';

const router = express.Router()

/**
 * Get all response for a request item 
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const allResponses = await EventResponseCollection.findAll();
        allResponses.map(util.constructEventResponseResponse);
        res.status(200).json(allResponses);
    }
)

/**
 * Get all response for a request item 
 */
router.get(
    '/:eventId?',
    [
        userValidator.isUserLoggedIn,
        eventValidator.isEventExists
    ],
    async (req: Request, res: Response) => {
        const allResponses = await EventResponseCollection.findByEventId(req.params.requestId);
        allResponses.map(util.constructEventResponseResponse);
        res.status(200).json(allResponses);
    }
)

/**
 * Get all responses for a specified user
 */
router.get(
    '/:userId?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserIdExists
    ],
    async (req: Request, res: Response) => {
        const allResponses = await EventResponseCollection.findByAuthorId(req.params.userId);
        allResponses.map(util.constructEventResponseResponse);
        res.status(200).json({
            responses: allResponses
        });
    }
)

/**
 * Create a new response to an event 
 */
router.post(
    '/:eventId?',
    [
        userValidator.isUserLoggedIn,
        eventValidator.isEventExists,
        eventResponseValidator.isValidResponseContent
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const response = await EventResponseCollection.addOne({ author: userId, contact: req.body.contact, description: req.body.description, eventId: req.params.eventId.toString() });
        res.status(201).json({
            message: 'Your response was created successfully.',
            response: util.constructEventResponseResponse(response)
        });
    }
)

/** 
 * Delete all responses belongong to an eventId
 */
router.delete(
    '/:eventId?',
    [
        userValidator.isUserLoggedIn,
        eventValidator.isEventExists
    ],
    async (req: Request, res: Response) => {
        await EventResponseCollection.deleteByEventId(req.params.eventId);
        res.status(200).json({
            message: 'All responses for this request were deleted successfully'
        })
    }
)

/** 
 * Delete all responses belonging to an author 
 */
router.delete(
    '/:userId?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserIdExists
    ],
    async (req: Request, res: Response) => {
        await EventResponseCollection.deleteByUserId(req.params.userId);
        res.status(200).json({
            message: `All responses written by the author with ${req.params.userId} have been deleted.`
        })
    }
)

/**
 * Delete a specific response, specified by ID 
 */
router.delete(
    '/:eventResponseId?',
    [
        userValidator.isUserLoggedIn,
        eventResponseValidator.isEventResponseExists
    ],
    async (req: Request, res: Response) => {
        await EventResponseCollection.deleteByEventResponseId(req.params.eventResponseId);
        res.status(200).json({
            message: 'Your response has sucessfully been deleted.'
        })
    }
)



export { router as eventResponseRouter };