import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ResponseCollection from "./collection";
import EventResponseModel from './model';
import ResponseModel from './model';

const isValidResponseContent = (req: Request, res: Response, next: NextFunction) => {
    const { contact, description } = req.body as { contact: string, description: string };
    if (!description.trim() || !contact.trim()) {
        res.status(400).json({
            error: 'Response description or contact content must be at least one character long.'
        });
        return;
    }
    //TODO: DELETE THIS OR CHANGE NUMBER
    if (description.length > 140 || contact.length > 140) {
        res.status(413).json({
            error: 'Response description or contact content must be no more than 140 characters.'
        });
        return;
    }
    next();
}

const isEventResponseExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.eventResponseId);
    const response = validFormat ? await EventResponseModel.find({ _id: req.params.eventResponseId }) : '';
    if (!response) {
        res.status(404).json({
            error: `Event Response with ID ${req.params.eventResponseId} does not exist.`
        });
        return;
    }
    next();
};

export {
    isValidResponseContent,
    isEventResponseExists
}