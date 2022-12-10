import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export type Response = {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    requestId: Types.ObjectId,
    contact: string;
    description: string;
    dateCreated: Date;
    imageURL: string;
};

const ResponseSchema = new Schema<Response>({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    requestId: {
        type: Schema.Types.ObjectId,
        required: true
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
    },
    imageURL: {
        type: String,
        required: false
    }
})

const ResponseModel = model<Response>('Response', ResponseSchema);
export default ResponseModel; 