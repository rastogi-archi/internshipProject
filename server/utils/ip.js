import crypto from "crypto";

export const getClientIP = (req) => {
    return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
};


/**
 * Generates a random session ID.
 * @returns {string} A unique session ID.
 */
export const generateSessionID = () => {
    return crypto.randomBytes(16).toString("hex"); // Generates a 32-character hex string
};
