import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import { EventResponse } from "./model";

type EventResponseResponse = {
    _id: string;
    author: string;
    eventId: string;
    contact: string;
    description: string;
    dateCreated: string;
}

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructEventResponseResponse = (eventResponse: HydratedDocument<EventResponse>): EventResponseResponse => {
    const eventResponseCopy: EventResponse = {
        ...eventResponse.toObject({
            versionKey: false
        })
    }
    return {
        ...eventResponseCopy,
        _id: eventResponseCopy._id.toString(),
        author: eventResponseCopy.author.toString(),
        eventId: eventResponseCopy.eventId.toString(),
        contact: eventResponseCopy.contact,
        description: eventResponseCopy.description,
        dateCreated: formatDate(eventResponse.dateCreated)
    }
}

export {
    constructEventResponseResponse
}; 