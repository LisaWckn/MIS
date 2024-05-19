import * as mongodb from "mongodb";
import {Greeting} from "./greeting";

export const collections: {
    greetings?: mongodb.Collection<Greeting>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);

    const greetingsCollection = db.collection<Greeting>("greetings");
    collections.greetings = greetingsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["greeting"],
            additionalProperties: false,
            properties: {
                _id: {},
                greeting: {
                    bsonType: "string",
                    description: "'greeting' is required and is a string",
                }
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "greetings",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("greetings", {validator: jsonSchema});
        }
    });
}