import mongoose from "mongoose";
import config from 'config';
import log from "./logger";

async function connectToDb() {
    const dbUri = config.get<string>('dbUri');
    const dbName = config.get<string>('dbName')

    try {
        await mongoose.connect(dbUri, {
            dbName: dbName,
        });
        log.info("Connected to DB")
    } catch (error) {
        log.error(error)
        process.exit(1)
    }
}

export default connectToDb;