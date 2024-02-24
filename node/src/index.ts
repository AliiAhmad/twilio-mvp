import express, { Request, Response } from 'express';
import twilio from 'twilio';
import cors from 'cors';

const app = express();
const port = 4000; // You can choose a different port if necessary

// Replace these with your Twilio credentials
const accountSid = 'AC8f2dd258f68d3bcaed77ac8a68d7e0ee';
const authToken = 'f0fea96659957df6a00d4c5ed544dd4f';
const twilioPhoneNumber = '+18332743532'

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
app.get('/token', (req: Request, res: Response) => {
    const { AccessToken } = twilio.jwt;
    const { VoiceGrant } = AccessToken;

    const apiKeySid = 'SKf6aab7d983e5835cedd082e06348c911';
    const apiKeySecret = 'IUBNTovaeeXAQpMPFRiOqlAWTPosXWkm';
    const identity = 'UNIQUE_USER_IDENTITY'; // Replace with the user's identity

    const accessToken = new AccessToken(accountSid, apiKeySid, apiKeySecret, { identity });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: 'AP439f0c57e32f70b260a668e5c946c9b8', // Replace with your TwiML Application SID
      incomingAllow: true, // Optional: set to true if you want to receive incoming calls
    });

    accessToken.addGrant(voiceGrant);
    res.send({ token: accessToken.toJwt() });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
