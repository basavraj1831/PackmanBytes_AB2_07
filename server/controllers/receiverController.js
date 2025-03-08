import { handleError } from "../helpers/handleError.js";
import Receiver from "../models/receiverModel.js";
import nodemailer from "nodemailer";
import Donor from "../models/donorModel.js";
import { NEW_REQUEST_TEMPLATE } from "../config/emailTemplates.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const addReceiver = async (req, res, next) => {
  try {
    console.log("Adding receiver:", req.body);
    const {
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      location,
      city,
      state,
      country,
      district,
    } = req.body;

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return next(
        handleError(
          400,
          "Invalid location data. Latitude and Longitude are required."
        )
      );
    }

    const [longitude, latitude] = location.coordinates;

    console.log("Longitude:", longitude);

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
      status: "Available",
    });

    console.log("Donors:", donors);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await Promise.all(
      donors.map(async (donor) => {
        const token = jwt.sign(
          { donorId: donor._id, receiverId: receiver._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        const acceptLink = `http://localhost:3000/api/receiver/accept-request?token=${token}`;
        let mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: donor.email,
          subject: "Urgent Blood notification",
          html: NEW_REQUEST_TEMPLATE.replace("{{name}}", name)
            .replace("{{email}}", email)
            .replace("{{phone}}", phone)
            .replace("{{age}}", age)
            .replace("{{gender}}", gender)
            .replace("{{bloodGroup}}", bloodGroup)
            .replace("{{city}}", city)
            .replace("{{state}}", state)
            .replace("{{country}}", country)
            .replace("{{district}}", district)
            .replace("{{acceptLink}}", acceptLink),
        };
        return transporter.sendMail(mailOptions);
      })
    );

    res.status(200).json({
      success: true,
      message: "Receiver added successfully",
      donors,
    });
  } catch (error) {
    console.error("Error adding receiver:", error);
    next(handleError(500, error.message));
  }
};

export const sendEmailToUsers = async (req, res, next) => {
  try {
    const { hospital, bloodGroup, phone } = req.body;

    const users = await User.find({});
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await Promise.all(
      users.map((user) =>
        transporter.sendMail({
          from: process.env.SENDER_EMAIL,
          to: user.email,
          subject: "Emergency SOS Alert ",
          html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <h2 style="color: #dc3545;">Urgent Blood Request Needed.!</h2>
          <p style="font-size: 16px; color: #333;">
            Dear Donor,  
            A receiver near your location is in urgent need of blood. Your help could save a life. If you are not near that location then please share this message to known person who are near that location.
          </p>
    
          <h3 style="color: #dc3545;">Request Details:</h3>
          <ul style="background-color: #fff3f3; padding: 10px; border-radius: 5px;">
            <li><strong>Hospital Name:</strong> ${hospital}</li>
            <li><strong>Required Blood Group:</strong> ${bloodGroup}</li>
            <li><strong>Contact:</strong> ${phone}</li>
          </ul>
    
          <p style="font-size: 16px; color: #333;">
            If you are available to donate, please reach out immediately. Your generosity can save a life!
          </p>
    
          <div style="margin-top: 20px; text-align: center;">
            <a href="tel:${phone}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              📞 Contact Now
            </a>
          </div>
    
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Thank you for your kindness and support! ❤  
          </p>
        </div>`,
        })
      )
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const getAllReceivers = async (req, res, next) => {
  try {
    const receivers = await Receiver.find();
    res.status(200).json({
      success: true,
      count: receivers.length,
      receivers,
    });
  } catch (error) {
    console.error("Error fetching receivers:", error);
    next(handleError(500, error.message));
  }
};

export const getLatestRequestByUser = async (req, res, next) => {
  try {
    const { email } = req.params;

    const latestRequest = await Receiver.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestRequest) {
      return next(handleError(404, "No request found for this email."));
    }

    const { location, bloodGroup, donorsAccepted } = latestRequest;
    const [longitude, latitude] = location.coordinates;
    console.log("Latest request location:", { longitude, latitude });

    let donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000,
        },
      },
      status: "Available",
      bloodGroup: bloodGroup,
    }).select("name bloodGroup phone city state email");

    console.log("Found donors before sorting:", donors);

    // Sort donors: Priority to same blood group
    donors = donors.sort((a, b) => (a.bloodGroup === bloodGroup ? -1 : 1));

    console.log("Sorted donors:", donors);

    const acceptedDonors = await Donor.find({
      _id: { $in: donorsAccepted },
    }).select("name bloodGroup phone location city state email");

    console.log("accepted donor", acceptedDonors);
    res.status(200).json({
      success: true,
      request: latestRequest,
      donors,
      acceptedDonors,
      requestStatus: donorsAccepted.length > 0 ? "Accepted" : "Pending",
    });
  } catch (error) {
    console.error("Error fetching latest request by user:", error);
    next(handleError(500, error.message));
  }
};

const bloodGroupPriority = {
  "AB-": 8,
  "B-": 7,
  "AB+": 6,
  "A-": 5,
  "O-": 4,
  "B+": 3,
  "A+": 2,
  "O+": 1,
};

const calculateTimeUrgency = (createdAt) => {
  const requestTime = new Date(createdAt).getTime();
  const currentTime = Date.now();
  const elapsedHours = (currentTime - requestTime) / (1000 * 60 * 60);
  return elapsedHours >= 1 ? 1 : elapsedHours / 1;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const calculateDistancePriority = (distance) => {
  if (distance === 0) return 2;
  if (distance < 10) return 1;
  return Math.max(0, 1 - distance / 10);
};

export const getAllPriorityReceivers = async (req, res, next) => {
  try {
    const { location } = req.body;

    if (!location || !location.coordinates) {
      return next(handleError(400, "Invalid location data."));
    }

    const [longitude, latitude] = location.coordinates;

    let receivers = await Receiver.aggregate([
      {
        $match: {
          donorsAccepted: { $size: 0 },
        },
      },
      {
        $addFields: {
          bloodGroupPriority: {
            $switch: {
              branches: Object.entries(bloodGroupPriority).map(
                ([group, priority]) => ({
                  case: { $eq: ["$bloodGroup", group] },
                  then: priority,
                })
              ),
              default: 99,
            },
          },
        },
      },
    ]);

    receivers = receivers.map((receiver) => {
      if (receiver.distance === undefined) {
        const receiverLat = receiver.location.coordinates[1];
        const receiverLon = receiver.location.coordinates[0];

        receiver.distance = calculateDistance(
          latitude,
          longitude,
          receiverLat,
          receiverLon
        );
      }

      return {
        ...receiver,
        timeUrgency: calculateTimeUrgency(receiver.createdAt),
        distancePriority: calculateDistancePriority(receiver.distance),
      };
    });

    receivers = receivers.map((receiver) => ({
      ...receiver,
      totalPriority:
        receiver.bloodGroupPriority * 0.4 +
        receiver.timeUrgency * 0.3 +
        receiver.distancePriority * 0.3,
    }));

    receivers.sort((a, b) => b.totalPriority - a.totalPriority);

    res.status(200).json({
      success: true,
      count: receivers.length,
      receivers,
    });
  } catch (error) {
    console.error("Error fetching receivers:", error);
    next(handleError(500, error.message));
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const { token } = req.query; // Extract token from URL

    if (!token) {
      return res.status(400).send("Invalid request. No token provided.");
    }

    // Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).send("Invalid or expired token.");
    }

    const { receiverId, donorId } = decoded; // Extract donor & receiver IDs

    // Check if receiver exists
    let receiver = await Receiver.findById(receiverId);
    if (!receiver) return res.status(404).send("Receiver not found.");

    // Check if donor exists
    let donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).send("Donor not found.");

    if (receiver.donorsAccepted.length > 0) {
      return res
        .status(400)
        .send("This request has already been accepted by another donor.");
    }

    // Add donor to receiver's donorsAccepted list if not already there
    if (!receiver.donorsAccepted.includes(donorId)) {
      receiver.donorsAccepted.push(donorId);
      receiver.status = "Accepted";
      await receiver.save();

      donor.donateCount++;
      await donor.save();

      // Send Confirmation Email to Receiver
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: receiver.email,
        subject: "Blood Request Accepted!",
        html: `<h2>Good News!</h2>
               <p>Your blood request has been accepted by ${donor.name}.</p>
               <p>Contact them at <strong>${donor.phone}</strong> or <strong>${donor.email}</strong>.</p>
               <p>Thank you for using our platform!</p>`,
      };

      await transporter.sendMail(mailOptions);
    }
    res.send("<h1>Thank you! Your donation has been recorded.</h1>");
  } catch (error) {
    console.error("Error in acceptRequest:", error);
    res.status(500).send("Internal Server Error");
  }
};
