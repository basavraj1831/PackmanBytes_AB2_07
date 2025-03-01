import { handleError } from "../helpers/handleError.js";
import Receiver from "../models/receiverModel.js";
import nodemailer from "nodemailer";
import Donor from "../models/donorModel.js";

export const addReceiver = async (req, res, next) => {
  try {
    // Extract data from request body
    const { name, email, phone, age, gender, bloodGroup, location } = req.body;

    // Validate location data
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return next(handleError(400, "Invalid location data. Latitude and Longitude are required."));
    }

    const [latitude, longitude] = location.coordinates; // Extract lat & long

    // Save receiver in the correct format
    const receiver = new Receiver({
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // MongoDB requires [longitude, latitude]
      },
    });

    await receiver.save();

    // Find donors within a 5km radius
    const donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000, // 5 km in meters
        },
      },
      available: true,
    });

    res.status(200).json({
      success: true,
      message: "Receiver added successfully",
      donors,
    });

    // Send emails asynchronously
    sendEmailToDonors(donors);

  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Function to send emails asynchronously
const sendEmailToDonors = async (donors) => {
  try {
    if (donors.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await Promise.all(
      donors.map((donor) =>
        transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: donor.email,
          subject: "Urgent Blood Request",
          html: "<p>A receiver near your location is requesting blood. Please respond if available.</p>",
        })
      )
    );

    console.log("Emails sent successfully to donors.");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};
