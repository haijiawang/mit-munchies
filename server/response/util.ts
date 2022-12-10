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
    imageURL: string;
}

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructResponseResponse = (response: HydratedDocument<Response>): ResponseResponse => {
    const responseCopy: Response = {
        ...response.toObject({
            versionKey: false
        })
    }
    return {
        ...responseCopy,
        _id: responseCopy._id.toString(),
        author: responseCopy.author.toString(),
        requestId: responseCopy.requestId.toString(),
        contact: responseCopy.contact,
        description: responseCopy.description,
        dateCreated: formatDate(response.dateCreated),
        imageURL: responseCopy.imageURL
    }
}

export {
    constructResponseResponse
};
