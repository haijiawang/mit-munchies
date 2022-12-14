import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import RequestCollection from './collection';
import * as userValidator from '../user/middleware';
import * as requestValidator from '../request/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the requests
 *
 * @name GET /api/requests
 *
 * @return {RequestResponse[]} - A list of all the requests sorted in descending
 *                      order by date created
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetResponse[]} - An array of freets created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if author query parameter was supplied
        if (req.query.author !== undefined || req.query.color !== undefined || req.query.size !== undefined) {
            next();
            return;
        }

        const allRequests = await RequestCollection.findAll();
        const response = allRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author === undefined || req.query.color === undefined || req.query.size === undefined) {
            next();
            return;
        }

        // check all
        userValidator.isAuthorExists;
        const authorRequests = await RequestCollection.findAllByAll(req.query.author as string, req.query.size as string, req.query.color as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author !== undefined || req.query.color === undefined || req.query.size === undefined) {
            next();
            return;
        }

        // check color and size
        const authorRequests = await RequestCollection.findAllBySizeAndColor(req.query.size as string, req.query.color as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author === undefined || req.query.color === undefined || req.query.size !== undefined) {
            next();
            return;
        }

        // check color and user
        userValidator.isAuthorExists;
        const authorRequests = await RequestCollection.findAllByColorAndUser(req.query.author as string, req.query.color as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author === undefined || req.query.color !== undefined || req.query.size === undefined) {
            next();
            return;
        }

        // check size and user
        userValidator.isAuthorExists;
        const authorRequests = await RequestCollection.findAllBySizeAndUser(req.query.author as string, req.query.size as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author !== undefined || req.query.color !== undefined) {
            next();
            return;
        }

        // check size
        const authorRequests = await RequestCollection.findAllBySize(req.query.size as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.query.author !== undefined) {
            next();
            return;
        }

        // check color
        const authorRequests = await RequestCollection.findAllByColor(req.query.color as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    },
    async (req: Request, res: Response) => {
        // check user
        userValidator.isAuthorExists;
        const authorRequests = await RequestCollection.findAllByUsername(req.query.author as string);
        const response = authorRequests.map(util.constructRequestResponse);
        res.status(200).json(response);
    } 
);

// /**
//  * Get request by color
//  *
//  * @name GET /api/requests?color=color
//  *
//  * @return {FreetResponse[]} - An array of freets created by user with username, author
//  * @throws {400} - If author is not given
//  * @throws {404} - If no user has given author
//  *
//  */
// router.get(
//     '/',
//     async (req: Request, res: Response) => {
//         const allRequests = await RequestCollection.findAllByColor(req.body.color);
//         const response = allRequests.map(util.constructRequestResponse);
//         res.status(200).json(response);
//     }
// );

// /**
//  * Get request by size
//  *
//  * @name GET /api/requests?color=color
//  *
//  * @return {FreetResponse[]} - An array of freets created by user with username, author
//  * @throws {400} - If author is not given
//  * @throws {404} - If no user has given author
//  *
//  */
// router.get(
//     '/',
//     async (req: Request, res: Response) => {
//         const allRequests = await RequestCollection.findAllBySize(req.body.size);
//         const response = allRequests.map(util.constructRequestResponse);
//         res.status(200).json(response);
//     }
// );

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isValidRequestContent
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const request = await RequestCollection.addOne({
            author: userId,
            contact: req.body.contact,
            description: req.body.description,
            color: req.body.color,
            size: req.body.size
        });

        res.status(201).json({
            message: 'Your request was created successfully.',
            request: util.constructRequestResponse(request)
        });
    }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
    '/:requestId?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists,
        requestValidator.isValidRequestModifier
    ],
    async (req: Request, res: Response) => {
        await RequestCollection.deleteOne(req.params.requestId);
        res.status(200).json({
            message: 'Your request was deleted successfully.'
        });
    }
);

/**
 * Modify a freet
 *
 * @name PATCH /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
    '/:requestId?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists,
        requestValidator.isValidRequestModifier,
        requestValidator.isValidRequestContent
    ],
    async (req: Request, res: Response) => {
        const request = await RequestCollection.updateOne(req.params.freetId, req.body.content);
        res.status(200).json({
            message: 'Your request was updated successfully.',
            request: util.constructRequestResponse(request)
        });
    }
);

router.get('/images/:requestId?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const images = await RequestCollection.getImages(req.params.requestId);

        res.status(200).json({
            message: 'Your request was updated successfully.',
            images: images
        });
    },
);

router.post('/images/:requestId?/:imageURL?',
    [
        userValidator.isUserLoggedIn,
        requestValidator.isRequestExists
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const saved = await RequestCollection.saveImage(req.params.requestId, req.params.imageURL);

        res.status(200).json({
            message: 'Your image was uploaded successfully.',
        });
    },
);

export { router as requestRouter };
