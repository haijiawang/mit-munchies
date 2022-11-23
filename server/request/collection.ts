import type {HydratedDocument, Types} from 'mongoose';
import type {Request} from './model';
import RequestModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class RequestCollection {
  /**
   * Add a Request to the collection
   *
   * @param {string} author - The author of the Request
   * @param {string} contact - The phone/email of the author
   * @return {Promise<HydratedDocument<Request>>} - The newly created Request
   */
  static async addOne(requestDetails: {author: string, contact: string, description: string, startDate: string, endDate:string }): Promise<HydratedDocument<Request>> {
    const date = new Date();
    const {author, contact, description, startDate, endDate} = requestDetails;
    const request = new RequestModel({
      author,
      contact,
      description,
      startDate,
      endDate,
      dateCreated: date
    });
    await request.save(); // Saves freet to MongoDB
    return request.populate('authorId'); //TODO: SHOULD I CHANGE THIS TO AUTHOR?
  }

  /**
   * Find a request by requestId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(requestId: Types.ObjectId | string): Promise<HydratedDocument<Request>> {
    return RequestModel.findOne({_id: requestId}).populate('authorId');
  }

  /**
   * Get all the requests in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Request>>> {
    // Retrieves Requests and sorts them from most to least recent
    return RequestModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Request>>> {
    const author = await UserCollection.findOneByUsername(username);
    return RequestModel.find({authorId: author._id}).sort({dateCreated: -1}).populate('authorId');
  }

  /** //TODO: UPDATE THIS
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(requestId: Types.ObjectId | string, description: string): Promise<HydratedDocument<Request>> {
    const request = await RequestModel.findOne({_id: requestId});
    request.description = description;
    await request.save();
    return request.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(requestId: Types.ObjectId | string): Promise<boolean> {
    const Request = await RequestModel.deleteOne({_id: requestId});
    return Request !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await RequestModel.deleteMany({authorId});
  }
}

export default RequestCollection;
