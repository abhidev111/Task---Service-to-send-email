const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Running on port", PORT);
});


app.post("/sendmail", (req, res) => {

    const { to, subject, emailBody } = req.body;

    console.log(to, subject, emailBody);

    nodemailer.createTestAccount((err, account) => {
        //if error occurs in creating account
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
        }
        //if account is created successfully
        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        //data for the mail
        const mailData = {
            from: 'foo@example.com',
            to: to,
            subject: subject,
            text: emailBody
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                //console.log("this is error")
                res.send({
                    success: false,
                    message: "Could not send the mail",
                    error: error
                });
            }
            else {
                res.status(200).send({ 
                    success: true, 
                    message: "Mail sent successfully", 
                    info: info 
                });
            }
        });
    });
});