import { handleError } from "../helpers/handleError.js";
import Receiver from "../models/receiverModel.js";
import nodemailer from "nodemailer";
import Donor from "../models/donorModel.js";

export const addReceiver = async (req, res, next) => {
  try {
    console.log('Adding receiver:', req.body);
    const { name, email, phone, age, gender, bloodGroup, location, city, state, country, district } = req.body;

    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return next(handleError(400, "Invalid location data. Latitude and Longitude are required."));
    }

    const [longitude,latitude] = location.coordinates;

    const receiver = new Receiver({
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      city,
      state,
      country,
      district,
    });

    await receiver.save();

    const donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000,
        },
      },
      available: true,
    });

    res.status(200).json({
      success: true,
      message: "Receiver added successfully",
      donors,
    });

    sendEmailToDonors(donors);

  } catch (error) {
    console.error('Error adding receiver:', error);
    next(handleError(500, error.message));
  }
};

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

export const getAllReceivers = async (req, res, next) => {
  try {
    console.log('Fetching all receivers...');
    const receivers = await Receiver.find();
    console.log('Receivers fetched:', receivers);
    res.status(200).json({
      success: true,
      count: receivers.length,
      receivers,
    });
  } catch (error) {
    console.error('Error fetching receivers:', error);
    next(handleError(500, error.message));
  }
};

export const getLatestRequest = async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log('Fetching latest request for email:', email); // Add this line to log the email
    const latestRequest = await Receiver.findOne({ email }).sort({ createdAt: -1 }).exec();

    if (!latestRequest) {
      console.log('No request found for this email:', email); // Add this line to log the missing request
      return next(handleError(404, "No request found for this email."));
    }

    const { location } = latestRequest;
    const [longitude, latitude] = location.coordinates;
    console.log('Latest request location:', { longitude, latitude }); // Add this line to log the location

    const donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000,
        },
      },
      available: true,
    }).select('name bloodGroup phone city state');

    console.log('Found donors:', donors); // Add this line to log the found donors

    res.status(200).json({
      success: true,
      message: "Donors found successfully",
      donors,
    });
  } catch (error) {
    console.error('Error fetching latest request:', error);
    next(handleError(500, error.message));
  }
};






// const donors = await Donor.find({
//   location: {
//     $near: {
//       $geometry: { type: "Point", coordinates: [longitude, latitude] },
//       $maxDistance: 5000,
//     },
//   },
//   available: true,
// });