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

    console.log('Longitude:', longitude);


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

    console.log('Donors:', donors);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await Promise.all(donors.map(async (donor) => {
      let acceptLink = ``;
      let mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: donor.email,
        subject: "Urgent Blood receiver",
        html: `<p>A patient needs blood urgently.</p>
               <p>Click below if you can donate:</p>
               <a href="${acceptLink}" style="padding: 10px; background-color: green; color: white; text-decoration: none;">Accept</a>`
      };
      return transporter.sendMail(mailOptions);
    }));
    

    res.status(200).json({
      success: true,
      message: "Receiver added successfully",
      donors,
    });


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
          subject: "Urgent Blood receiver",
          html: "<p>A receiver near your location is receivering blood. Please respond if available.</p>",
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

export const getLatestreceiver = async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log("Fetching latest receiver for email:", email);

    const latestreceiver = await Receiver.findOne({ email })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestreceiver) {
      console.log("No receiver found for this email:", email);
      return next(handleError(404, "No receiver found for this email."));
    }

    const { location, bloodGroup } = latestreceiver;
    const [longitude, latitude] = location.coordinates;
    console.log("Latest receiver location:", { longitude, latitude });

    let donors = await Donor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 5000,
        },
      },
      available: true,
      bloodGroup: bloodGroup,
    }).select("name bloodGroup phone city state");

    console.log("Found donors before sorting:", donors);

    // Sort donors: Priority to same blood group
    donors = donors.sort((a, b) => (a.bloodGroup === bloodGroup ? -1 : 1));

    console.log("Sorted donors:", donors);

    res.status(200).json({
      success: true,
      message: "Donors found successfully",
      donors,
    });
  } catch (error) {
    console.error("Error fetching latest receiver:", error);
    next(handleError(500, error.message));
  }
};

export const acceptLink =  async (req, res, next) => {
  const { receiverId, donorId } = req.params;

  try {
    let receiver = await Receiver.findById(receiverId);
    if (!receiver) return res.status(404).send("receiver not found");

    // Add donor ID if not already added
    if (!receiver.donorsAccepted.includes(donorId)) {
      receiver.donorsAccepted.push(donorId);
      receiver.status = 'Completed';
      await receiver.save();
    }

    res.send("<h1>Thank you! Your donation has been recorded.</h1>");
  } catch (error) {
    res.status(500).send("Internal Server Error");
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