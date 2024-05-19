import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const greetingRouter = express.Router();
greetingRouter.use(express.json());

greetingRouter.get("/", async (_req, res) => {
    try {
        const employees = await collections?.greetings?.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

greetingRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const employee = await collections?.greetings?.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find a greeting: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a greeting: ID ${req?.params?.id}`);
    }
});

greetingRouter.post("/", async (req, res) => {
    try {
        const greeting = req.body;
        const result = await collections?.greetings?.insertOne(greeting);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new greeting: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new greeting.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

greetingRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const greeting = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.greetings?.updateOne(query, { $set: greeting });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an greeting: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a greeting: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a greeting: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

greetingRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.greetings?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a greeting: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a greeting: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a greeting: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});