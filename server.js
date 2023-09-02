const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Replace <YourMongoDBURI> with your MongoDB connection URI
const uri =
  'mongodb+srv://morsypropertydealer:morsypropertydealer@cluster0.p6ub5kn.mongodb.net/lander';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Create a Mongoose model for your data
const userDataSchema = new mongoose.Schema({
  name: String,
  number: String,
  email: String,
});

const UserData = mongoose.model('UserData', userDataSchema);

app.post('/', async (req, res) => {
    // Create a new document with the data from req.body
    const userData = new UserData({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
    });
  
    try {
      // Save the document to the database using await
      await userData.save();
  
      // Data saved successfully
      res.json({ message: 'Data saved successfully' });
  
      // Send the email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'laxsavani4259@gmail.com',
          pass: 'zypxhxzjudxwvfmu',
        },
      });
  
      transporter.sendMail(
        {
          from: 'laxsavani4259@gmail.com',
          to: 'morsypropertydealer@gmail.com',
          subject: 'Mail from form',
          html: `Name : ${req.body.name} <br>Number : ${req.body.number}<br>Email : ${req.body.email}`,
        },
        (err, info) => {
          if (err) {
            console.error('Error sending email:', err);
          } else {
            console.log('Email sent:', info.response);
          }
        }
      );
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server is running on port', port);
  }
});
