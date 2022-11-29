import type { HydratedDocument, Types } from 'mongoose';
import type { Response } from './model';
import ResponseModel from './model';
import UserCollection from '../user/collection';

class ResponseCollection {
    static async findByRequestId(rId: Types.ObjectId | string): Promise<Array<HydratedDocument<Response>>> {
        return ResponseModel.find({ requestId: rId }).sort({ dateCreated: -1 }).populate('author');
    }

    static async findByAuthorId(aId: Types.ObjectId | string): Promise<Array<HydratedDocument<Response>>> {
        return ResponseModel.find({ author: aId }).sort({ dateCreated: -1 }).populate('author');
    }

    static async addOne(responseDetails: { author: string, contact: string, description: string }): Promise<HydratedDocument<Response>> {
        const date = new Date();
        const { author, contact, description } = responseDetails;
        const response = new ResponseModel({
            author,
            contact: contact,
            description: description,
            dateCreated: date
        });
        await response.save();
        return response.populate('author');
    }

    static async deleteByRequestId(rId: Types.ObjectId | string): Promise<boolean> {
        const responses = await ResponseModel.find({ requestId: rId }).sort({ dateCreated: -1 }).populate('author');
        for (const response of responses) {
            await ResponseModel.deleteOne({ _id: response._id });
        }
        return true;
    }

    static async deleteByUserId(uId: Types.ObjectId | string): Promise<boolean> {
        const responses = await ResponseModel.find({ author: uId }).sort({ dateCreated: -1 }).populate('author');
        for (const response of responses) {
            await ResponseModel.deleteOne({ _id: response._id });
        }
        return true;
    }

    static async deleteByResponseId(rId: Types.ObjectId | string): Promise<boolean> {
        const response = await ResponseModel.deleteOne({ _id: rId });
        return response !== null;
    }
}

export default ResponseCollection; 