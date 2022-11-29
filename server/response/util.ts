import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import { Response } from "./model";

type ResponseResponse = {
    _id: string;
    author: string;
    requestId: string;
    contact: string;
    description: string;
    dateCreated: string;
}

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructResponseResponse = (response: HydratedDocument<Response>): ResponseResponse => {
    const requestCopy: Response = {
        ...response.toObject({
            versionKey: false
        })
    }
    return {
        ...requestCopy,
        _id: requestCopy._id.toString(),
        author: requestCopy.author.toString(),
        requestId: requestCopy.requestId.toString(),
        contact: requestCopy.contact,
        description: requestCopy.description,
        dateCreated: formatDate(response.dateCreated)
    }
}

export {
    constructResponseResponse
}; 