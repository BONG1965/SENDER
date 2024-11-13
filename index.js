require('dotenv').config();

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Welcome to the email sending service!");
});

console.log("Email:", process.env.EMAIL);
console.log("Password:", process.env.PASSWORD);

// Nodemailer transporter setup with Gmail authentication
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,  // Authenticated Gmail address
        pass: process.env.PASSWORD,  // App password for Gmail
    },
});

// POST route to handle sending emails
app.post("/send-email", async (req, res) => {
    const { senderEmail, recipients, subject, message } = req.body;

    try {
        const mailOptions = {
            from: `${senderEmail} <${process.env.EMAIL}>`,  // Sender's display name with authenticated email
            replyTo: senderEmail,  // Ensures replies go to the sender's email
            to: recipients.split(","),
            subject: subject,
            text: message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send(`Failed to send email. Error: ${error.message}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
