import 'reflect-metadata';
import { createServer } from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
 throw new Error("MONGO_URL non definita");
}

mongoose.connect(MONGO_URL).then(() => {
 const PORT = process.env.PORT || 3000;

 createServer(app).listen(PORT, () => {
   console.log(`Server running on ${PORT}`);
 });
});
