import * as mongodb from "mongodb";

export class Greeting {
    greeting: string = "";
    _id?: mongodb.ObjectId;
}