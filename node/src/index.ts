import express, { Request, Response } from 'express';
import twilio from 'twilio';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY_SID || !process.env.TWILIO_API_KEY_SECRET) {
    throw new Error("Required environment variables are not set");
}
// Use environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
const port = process.env.PORT; // You can choose a different port if necessary

const app = express();

const twilioClient = twilio(accountSid, authToken);

app.use(cors());
// Body parser middleware to handle post requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Endpoint to handle voice calls
app.post('/voice', (req: Request, res: Response) => {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();
    console.log(req.body)
    response.say('Connecting your call, please wait.');
    response.dial({ callerId: twilioPhoneNumber }, req.body.To);

    res.type('text/xml');
    res.send(response.toString());
});

// Endpoint to generate a Twilio JWT token
app.post('/token', (req: Request, res: Response) => {
    const { AccessToken } = twilio.jwt;
    const { VoiceGrant } = AccessToken;
    const {user_id} = req.body;
    const identity = 'UNIQUE_USER_IDENTITY'; // Replace with the user's identity

    const accessToken = new AccessToken(accountSid, apiKeySid, apiKeySecret, { identity });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid, // Replace with your TwiML Application SID
      incomingAllow: true, // Optional: set to true if you want to receive incoming calls
    });

    accessToken.addGrant(voiceGrant);
    res.send({ token: accessToken.toJwt() });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
