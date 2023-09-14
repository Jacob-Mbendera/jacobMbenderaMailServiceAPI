import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import sgMail from '@sendgrid/mail';
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

const router = express.Router();
app.use('/.netlify/functions/api', router);
app.get('/', (req, res) => {
  res.json({
    Hello: 'Hi',
  });
});

router.post('/contact', (req, res) => {
  const { firstName, lastName, email, mobile } = req.body;

  const msg = {
    to: ['jaybmbendera96@gmail.com', 'jacob@jacobmbendera.com'],
    from: 'jacob@jacobmbendera.com',
    subject: 'Contact Form Submission',
    html: `
        <strong>JACOB MBENDERA CONTACT FORM</strong><br><br>
        First Name: ${firstName}<br>
        Last Name: ${lastName}<br>
        Email: ${email}<br>
        Phone: ${mobile}<br>
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

const handler = serverless(app);
export default handler;
