require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

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

    // Log inquiry (in production, this would send an email via Nodemailer)
    console.log('\n📩 New Contact Inquiry:');
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Phone: ${phone || 'Not provided'}`);
    console.log(`   Property Type: ${propertyType || 'Not specified'}`);
    console.log(`   Message: ${message}`);
    console.log(`   Time: ${new Date().toLocaleString()}\n`);

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
