import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import { validateEmail, validateLength, validatePhone } from "./validation.js";
import { validate } from "validate-phone-number-node-js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({
    Welcome_to: "JACOB MBENDERA MAIL SERVICE",
  });
});

app.post("/contact", (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;

  //vaidating email use RegEx
  if (!validateEmail(email)) {
    return res.status(400).json({
      massage: "Invalid Email",
    });
  }
  if (!validate(mobile)) {
    return res.status(400).json({
      massage: "Invalid Phone",
    });
  }
  //validating length for diffent fields
  if (!validateLength(firstName, 3, 30)) {
    return res.status(400).json({
      massage: "First Name must be between 3 and 30 characters",
    });
  }
  if (!validateLength(lastName, 3, 30)) {
    return res.status(400).json({
      massage: "Last Name must be between 3 and 30 characters",
    });
  }
  if (!validateLength(message, 10, 500)) {
    return res.status(400).json({
      massage: "massage must be between 10 and 500 characters",
    });
  }

  const msg = {
    to: ["jaybmbendera96@gmail.com", "jacob@jacobmbendera.com"],
    from: "jacob@jacobmbendera.com",
    subject: "JACOB MBENDERA CONTACT FORM",
    html: `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CONTACT FORM - JACOB MBENDERA OFFICIAL SITE</title></head><body><div class="" style="max-width:700px;margin-bottom:1em;display:flex;align-items:center;gap:10px;font-family:Roboto;background-color:#fff;padding:1em;border-radius:2px;margin:0 auto;text-align:center"><img src="https://res.cloudinary.com/dhbe6wtod/image/upload/v1696160021/logo_hrfyk9.png" alt="" style="width:50px"><span style="color:#000;text-transform:uppercase;text-align:center;font-size:large;margin:0 auto;font-weight:bolder">CONTACT FORM</span></div><div style="font-family:Roboto;font-size:17px;padding:1em;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;width:700px;margin:0 auto"><span style="font-weight:700;text-align:center">Hello Jacob</span><div style="padding:20px 0"><span style="padding:1.5em 0"><strong>Full Name</strong>: ${firstName} ${lastName}<br><strong>Mobile Number</strong>: ${mobile}<br><strong>Email Address</strong>: ${email}<br></span><p>${message}</p></div><div style="padding-top:20px"><span style="margin:1.5em 0;color:#898f9c">&copy; Jacob Mbendera. All right reserved.</span></div></div></body></html>
      `,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send("Sent, Jacob will contact you soon");
    })
    .catch((error) => {
      res.status(500).send("An Error occured while sending");
    });
});

// HEALIX MAIL SERVICE

app.post("/contactUs", (req, res) => {
  const { fullName, email, mobile, message } = req.body;

  //vaidating email use RegEx
  if (!validateEmail(email)) {
    return res.status(400).json({
      massage: "Invalid Email",
    });
  }
  if (!validatePhone(mobile)) {
    return res.status(400).json({
      massage: "Invalid Phone",
    });
  }
  //validating length for diffent fields
  if (!validateLength(fullName, 3, 30)) {
    return res.status(400).json({
      massage: "Last Name must be between 3 and 30 characters",
    });
  }
  if (!validateLength(message, 20, 500)) {
    return res.status(400).json({
      massage: "massage must be between 20 and 500 characters",
    });
  }

  const msg = {
    to: [
      "jaybmbendera96@gmail.com",
      "antony@healixmw.tech",
      "nora@healixmw.tech",
    ],
    from: "jacob@jacobmbendera.com",
    subject: "HEALIX MEDICAL CONTACT FORM",
    html: `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title style="background-color:#044b63">CONTACT FORM - HEALIX MEDICAL OFFICIAL WEBSITE</title></head><body><div class="" style="max-width:700px;margin-bottom:1em;display:flex;align-items:center;gap:10px;font-family:Roboto;background-color:#c9cdcf;padding:1em;border-radius:2px;margin:0 auto;text-align:center"><img src="https://res.cloudinary.com/dhbe6wtod/image/upload/v1717678326/logos/logo_iqhxcg.png" alt="" style="width:50px"><span style="color:#2b2a2a;text-transform:uppercase;text-align:center;font-size:large;margin:0 auto;font-weight:bolder">CONTACT FORM</span></div><div style="font-family:Roboto;font-size:17px;padding:1em;border-top:4px solid #fff;border-bottom:4px solid #afafaf;width:700px;margin:0 auto;background-color:#c9cdcf;color:#2b2a2a"><span style="font-weight:700;text-align:center">Hello</span><div style="padding:20px 0"><span style="padding:1.5em 0"><strong>Full Name</strong>:My name is ${fullName}<br><strong>Mobile Number</strong>: ${mobile}<br><strong>Email Address</strong>: ${email}<br></span><p>${message}</p></div><div style="padding-top:20px"><span style="margin:1.5em 0;color:azure">&copy; Healix Medical. All right reserved.</span></div></div></body></html>
      `,
  };

  sgMail
    .send(msg)
    .then(() => {
      res
        .status(200)
        .json({ message: "Sent!, One of our members will contact you" });
    })
    .catch((error) => {
      res.status(500).json({ message: "An Error occured while sending" });
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
