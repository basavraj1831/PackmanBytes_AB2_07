import { handleError } from "../helpers/handleError.js";
import Donor from "../models/donorModel.js";
import Receiver from "../models/receiverModel.js";
import nodemailer from "nodemailer";
import { DONOR_REQUEST_COMPLETE_TEMPLATE } from "../config/emailTemplates.js";

// ✅ Fetch all donors
export const getDonors = async (req, res, next) => {
  try {
    console.log('Fetching all donors...');
    const donors = await Donor.find();
    console.log('Donors fetched:', donors);
    res.status(200).json({
      success: true,
      donors,
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    next(handleError(500, error.message));
  }
};

// ✅ Add a new donor
export const addDonor = async (req, res, next) => {
  try {
    const { name, email, phone, age, gender, bloodGroup, location, available, city, district, state, country } = req.body;

    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location must include both latitude and longitude.",
      });
    }

    const donor = new Donor({
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      location: {
        type: "Point",
        coordinates: [location.coordinates[0], location.coordinates[1]],
      },
      city,
      district,
      state,
      country,
      available,
    });

    await donor.save();

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Donation Request Complete",
      html: DONOR_REQUEST_COMPLETE_TEMPLATE.replace("{{name}}", name),
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Donor added successfully",
      donor,
    });
  } catch (error) {
    console.error("Error adding donor:", error);
    next(handleError(500, error.message));
  }
};

// ✅ Fetch a single donor
export const getDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    const donor = await Donor.findById(donorid);
    if (!donor) {
      return next(handleError(404, "Donor not found"));
    }
    res.status(200).json({
      success: true,
      donor,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Update donor details
export const updateDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    const { name, email, phone, age, gender, bloodGroup, location, available, city, district, state, country } = req.body;

    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location must include both latitude and longitude.",
      });
    }

    const donor = await Donor.findById(donorid);
    if (!donor) {
      return next(handleError(404, "Donor not found"));
    }

    donor.name = name;
    donor.phone = phone;
    donor.age = age;
    donor.gender = gender;
    donor.bloodGroup = bloodGroup;
    donor.location = {
      type: "Point",
      coordinates: [location.coordinates[0], location.coordinates[1]],
    };
    donor.available = available;
    donor.city = city;
    donor.district = district;
    donor.state = state;
    donor.country = country;

    await donor.save();

    res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      donor,
    });
  } catch (error) {
    console.error("Error updating donor:", error);
    next(handleError(500, error.message));
  }
};

// ✅ Delete donor
export const deleteDonor = async (req, res, next) => {
  try {
    const { donorid } = req.params;
    const deletedDonor = await Donor.findByIdAndDelete(donorid);

    if (!deletedDonor) {
      return next(handleError(404, "Donor not found"));
    }

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get nearest donors for latest receiver & sort by blood group match
export const getLatestReceiver = async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log('Fetching latest receiver for email:', email);
    
    const latestReceiver = await Receiver.findOne({ email }).sort({ createdAt: -1 }).exec();

    if (!latestReceiver) {
      console.log('No receiver found for this email:', email);
      return next(handleError(404, "No receiver found for this email."));
    }

    const { location, bloodGroup } = latestReceiver;
    const [longitude, latitude] = location.coordinates;
    console.log('Latest receiver location:', { longitude, latitude });

    let donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000, // Search donors within 5km
        },
      },
      available: true,
    }).select('name bloodGroup phone city state');

    console.log('Found donors:', donors);

    // ✅ Sort donors to prioritize matching blood group
    donors = donors.sort((a, b) => (a.bloodGroup === bloodGroup ? -1 : 1));

    res.status(200).json({
      success: true,
      message: "Donors found successfully",
      donors,
    });
  } catch (error) {
    console.error('Error fetching latest receiver:', error);
    next(handleError(500, error.message));
  }
};
