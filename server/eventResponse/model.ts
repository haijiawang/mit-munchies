import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type {User} from '../user/model';
import type {Event} from '../event/model';

export type EventResponse = {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    eventId: Types.ObjectId,
    contact: string;
    description: string;
    dateCreated: Date;
};

export type PopulatedEventResponse = {
    _id: Types.ObjectId,
    author: User,
    eventId: Event,
    contact: string;
    description: string;
    dateCreated: Date;
};

const EventResponseSchema = new Schema<EventResponse>({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    eventId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },
    contact: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    dateCreated: {
        type: Date,
        required: true
    }
})

const EventResponseModel = model<EventResponse>('EventResponse', EventResponseSchema);
export default EventResponseModel; 