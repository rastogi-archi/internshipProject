import GuestSession from "../models/GuestSession.js";
import { v4 as uuidv4 } from "uuid";

// Generate a random session ID
const generateSessionId = () => uuidv4();

// Guest Access Controller
export const guestAccess = async (req, res) => {
  try {
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    
    // Check if guest already exists
    const existingSession = await GuestSession.findOne({ ipAddress, userAgent });
    if (existingSession) {
      return res.status(400).json({ success: false, message: "Guest access already granted." });
    }

    // Generate session ID
    const sessionId = generateSessionId();

    // Expire session after 1 day
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    // Create new guest session
    const newSession = new GuestSession({
      sessionId,
      ipAddress,
      userAgent,
      expiresAt,
    });

    await newSession.save();

    res.status(201).json({ success: true, sessionId, message: "Guest access granted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};
