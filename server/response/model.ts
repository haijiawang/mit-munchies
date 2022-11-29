import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

export type Response = {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    contact: string;
    description: string;
    dateCreated: Date;
};

const ResponseSchema = new Schema<Response>({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
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

const ResponseModel = model<Response>('Response', ResponseSchema);
export default ResponseModel; 