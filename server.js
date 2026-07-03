require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// ---- Fix image filenames on startup ----
const imgDir = path.join(__dirname, 'public', 'images');
const imgMappings = [
  { match: 'Occupied Home Staging', ext: '.jpg', newName: 'occupied_staging.jpg' },
  { match: 'Clean, calm, and buyer-ready', ext: '.jpg', newName: 'calm_bedroom.jpg' },
  { match: 'luxury builder  (1)', ext: '.jpg', newName: 'entryway_2.jpg' },
  { match: 'luxury builder ', ext: '.jpg', newName: 'entryway_1.jpg' },
  { match: 'bright, inviting', ext: '.jpg', newName: 'bright_living.jpg' },
  { match: 'Warm and welcoming', ext: '.jpg', newName: 'warm_welcoming.jpg' },
  { match: 'four walls', ext: '.jpg', newName: 'inspiring_1.jpg' },
  { match: 'Calm. Clean. Minimal', ext: '.jpg', newName: 'minimal_dining.jpg' },
];

try {
  const allFiles = fs.readdirSync(imgDir);
  const jpgFiles = allFiles.filter(f => f.endsWith('.jpg') && f.length > 30);
  console.log(`Found ${jpgFiles.length} jpg files with long names to process...`);

  for (const file of jpgFiles) {
    for (const m of imgMappings) {
      if (file.includes(m.match) && file.endsWith(m.ext)) {
        // Handle the (1) variant for inspiring
        if (file.includes('(1)') && m.match === 'four walls') {
          const dest = path.join(imgDir, 'inspiring_2.jpg');
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(path.join(imgDir, file), dest);
            console.log(`  Copied -> inspiring_2.jpg`);
          }
        } else {
          const dest = path.join(imgDir, m.newName);
          if (!fs.existsSync(dest)) {
            fs.copyFileSync(path.join(imgDir, file), dest);
            console.log(`  Copied -> ${m.newName}`);
          }
        }
        break;
      }
    }
  }
  console.log('Image fix complete.');
} catch (e) {
  console.log('Image fix skipped:', e.message);
}
// ---- End image fix ----

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes - Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API - Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, propertyType, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address (could also be your own)
      replyTo: email,
      to: process.env.EMAIL_USER, // receiver address (your email)
      subject: `New Lead: Staging Inquiry from ${name}`,
      text: `
      New Contact Inquiry from Before n Beyond Website:

      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      Property Type: ${propertyType || 'Not specified'}
      
      Message:
      ${message}
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Email not sent because EMAIL_USER and EMAIL_PASS are not configured in .env file.');
    }

    // Success response
    res.status(200).json({
      success: true,
      message: `Thank you, ${name}! We've received your inquiry and will be in touch within 24 hours.`
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or email us directly.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✨ Before n Beyond Staging website running!`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
