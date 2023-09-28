import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import { validateEmail, validateLength } from './validation.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(
  cors({
    origin: '*',
  })
);

app.get('/', (req, res) => {
  res.json({
    Welcome_to: 'JACOB MBENDERA MAIL SERVICE',
  });
});

app.post('/contact', (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;

  //vaidating email use RegEx
  if (!validateEmail(email)) {
    return res.status(400).json({
      massage: 'Invalid Email',
    });
  }

  //validating length for diffent fields
  if (!validateLength(firstName, 3, 30)) {
    return res.status(400).json({
      massage: 'First Name must be between 3 and 30 characters',
    });
  }
  if (!validateLength(lastName, 3, 30)) {
    return res.status(400).json({
      massage: 'Last Name must be between 3 and 30 characters',
    });
  }
  if (!validateLength(message, 10, 40)) {
    return res.send('massage must be between 10 and 40 characters');
  }

  const msg = {
    to: ['jaybmbendera96@gmail.com', 'jacob@jacobmbendera.com'],
    from: 'jacob@jacobmbendera.com',
    subject: 'Jacob Mbendera Contact Form ',
    html: `
        <strong>JACOB MBENDERA CONTACT FORM</strong><br><br>
        First Name: ${firstName}<br>
        Last Name: ${lastName}<br>
        Email: ${email}<br>
        Phone: ${mobile}<br>
        Message: ${message}<br>
      `,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send('Sent, Jacob will contact you soon');
    })
    .catch((error) => {
      res.status(500).send('An Error occured while sending');
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
