import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import { PopulatedEventResponse, EventResponse } from "./model";

type EventResponseResponse = {
    _id: string;
    author: string;
    eventId: string;
    contact: string;
    description: string;
    dateCreated: string;
    imageURL: string;
}

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructEventResponseResponse = (eventResponse: HydratedDocument<EventResponse>): EventResponseResponse => {
    const eventResponseCopy: PopulatedEventResponse = {
        ...eventResponse.toObject({
            versionKey: false
        })
    }
    const {username} = eventResponseCopy.author;
    delete eventResponseCopy.author;
    const {_id} = eventResponseCopy.eventId;
    delete eventResponseCopy.eventId;
    return {
        ...eventResponseCopy,
        _id: eventResponseCopy._id.toString(),
        author: username,
        eventId: _id.toString(),
        contact: eventResponseCopy.contact,
        description: eventResponseCopy.description,
        dateCreated: formatDate(eventResponse.dateCreated),
        imageURL: eventResponse.imageURL
    }
}

export {
    constructEventResponseResponse
};
