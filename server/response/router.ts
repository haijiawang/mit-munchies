import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import ResponseCollection from './collection';
import * as userValidator from '../user/middleware';
import * as requestValidator from '../request/middleware';
import * as responseValidator from './middleware';
// import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router()

/**
 * Get all response for a request item
 */
router.get(
    '/:requestId?',
    [
        userValidator.isUserLoggedIn,
        // requestValidator.isRequestExists
    ],
    async (req: Request, res: Response) => {
        const allResponses = await ResponseCollection.findByRequestId(req.params.requestId);
        res.status(200).json(allResponses.map(util.constructResponseResponse));
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
        const allResponses = await ResponseCollection.findByAuthorId(req.params.userId);
        res.status(200).json({
            // responses: allResponses
            responses: allResponses.map(util.constructResponseResponse)
        });
    }
)

/**
 * Create a new response to a request
 */
router.post(
    '/:requestId?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists,
        responseValidator.isValidResponseContent
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const response = await ResponseCollection.addOne({ author: userId, contact: req.body.contact, description: req.body.description, requestId: req.params.requestId.toString(), imageURL: req.body.imageURL });
        res.status(201).json({
            message: 'Your response was created successfully.',
            response: util.constructResponseResponse(response)
        });
    }
)

/**
 * Delete all responses belongong to a requestId
 */
router.delete(
    '/:requestId?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists
    ],
    async (req: Request, res: Response) => {
        await ResponseCollection.deleteByRequestId(req.params.requestId);
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
        await ResponseCollection.deleteByUserId(req.params.userId);
        res.status(200).json({
            message: `All responses written by the author with ${req.params.userId} have been deleted.`
        })
    }
)

/**
 * Delete a specific response, specified by ID
 */
router.delete(
    '/:responseId?',
    [
        userValidator.isUserLoggedIn,
        responseValidator.isResponseExists
    ],
    async (req: Request, res: Response) => {
        await ResponseCollection.deleteByResponseId(req.params.responseId);
        res.status(200).json({
            message: 'Your response has sucessfully been deleted.'
        })
    }
)



export { router as responseRouter };
