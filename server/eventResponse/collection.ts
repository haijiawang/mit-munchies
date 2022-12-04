import type { HydratedDocument, Types } from 'mongoose';
import type { EventResponse } from './model';
import EventResponseModel from './model';
import UserCollection from '../user/collection';

class EventResponseCollection {
    static async findByEventId(eId: Types.ObjectId | string): Promise<Array<HydratedDocument<EventResponse>>> {
        return EventResponseModel.find({ eventId: eId }).sort({ dateCreated: -1 }).populate('author');
    }

    static async findByAuthorId(aId: Types.ObjectId | string): Promise<Array<HydratedDocument<EventResponse>>> {
        return EventResponseModel.find({ author: aId }).sort({ dateCreated: -1 }).populate('author');
    }

    static async addOne(eventResponseDetails: { author: string, contact: string, description: string, eventId: string }): Promise<HydratedDocument<EventResponse>> {
        const date = new Date();
        const { author, contact, description, eventId } = eventResponseDetails;
        const response = new EventResponseModel({
            author,
            contact: contact,
            description: description,
            eventId: eventId,
            dateCreated: date,
        });
        await response.save();
        return response.populate('author');
    }

    static async deleteByEventId(eId: Types.ObjectId | string): Promise<boolean> {
        const responses = await EventResponseModel.find({ eventId: eId }).sort({ dateCreated: -1 }).populate('author');
        for (const response of responses) {
            await EventResponseModel.deleteOne({ _id: response._id });
        }
        return true;
    }

    static async deleteByUserId(uId: Types.ObjectId | string): Promise<boolean> {
        const responses = await EventResponseModel.find({ author: uId }).sort({ dateCreated: -1 }).populate('author');
        for (const response of responses) {
            await EventResponseModel.deleteOne({ _id: response._id });
        }
        return true;
    }

    static async deleteByEventResponseId(eId: Types.ObjectId | string): Promise<boolean> {
        const response = await EventResponseModel.deleteOne({ _id: eId });
        return response !== null;
    }
}

export default EventResponseCollection; 