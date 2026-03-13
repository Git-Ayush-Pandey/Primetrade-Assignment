import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT || 5000;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env");
}