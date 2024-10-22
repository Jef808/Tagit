import path from 'path';
import {google} from 'googleapis';
import {authenticate} from '@google-cloud/local-auth';
import express, {Request, Response} from 'express';
import cors from 'cors';
import {applyLabel, createLabel, getLabels} from './labels';
import {createFilter, getFilters} from './filters';
import {getProfile} from './profile';
import {getMessageGroups} from './messages';

const gmail = google.gmail('v1');

authenticate({
    keyfilePath: path.join(__dirname, '../../client_secret_723788189851-kmhg8nih04sckav3g08t83kl301sva82.apps.googleusercontent.com.json'),
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/gmail.settings.basic',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
}).then((auth) => {
    google.options({auth});
}).catch((error) => {
    console.error(error);
});

const app = express();

app.use(express.json());
app.use(cors());

/**
 * Get the user profile
 */
app.get('/profile', async (_: Request, res: Response) => {
  console.log('GET PROFILE REQUEST');
  try {
    const data = await getProfile(gmail);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get the list of labels
 */
app.get('/labels', async (_: Request, res: Response) => {
  console.log('GET LABELS REQUEST');
  try {
    const labels = await getLabels(gmail);
    res.json(labels);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Create a new label
 */
app.post('/labels', async (req: Request, res: Response) => {
  console.log('POST LABELS REQUEST', JSON.stringify(req.body, null, 2));
  try {
    const {name} = req.body;
    const data = await createLabel(gmail, name);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get the list of filters
 */
app.get('/filters', async (_: Request, res: Response) => {
  console.log('GET FILTERS REQUEST');
  try {
    const data = await getFilters(gmail);
    res.json(data.filter);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Create a new filter
 */
app.post('/filters', async (req: Request, res: Response) => {
  console.log('POST FILTERS REQUEST', JSON.stringify(req.body, null, 2));
  try {
    const data = await createFilter(gmail, req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get message groups in the form of records
 * {
 *   [from]: numberOfMessages
 * }
 */
app.get('/messageGroups/:pageToken', async (req: Request, res: Response) => {
  console.log('GET MESSAGE GROUPS REQUEST');
  try {
    const {pageToken} = req.params;
    const messageGroups = await getMessageGroups(gmail, pageToken ?? '');
    console.log(messageGroups);
    res.json(messageGroups);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get message groups in the form of records
 * {
 *   [from]: numberOfMessages
 * }
 */
app.get('/messageGroups/', async (_: Request, res: Response) => {
  console.log('GET MESSAGE GROUPS REQUEST');
  try {
    const messageGroups = await getMessageGroups(gmail, '');
    console.log(messageGroups);
    res.json(messageGroups);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Apply a label to all messages from given email.
 * The request body must be of the form
 * {
 *   labelId: string,
 *   email: string
 * }
 */
app.post('/messages/label', async (req: Request, res: Response) => {
  console.log('POST MESSAGES LABEL REQUEST', JSON.stringify(req.body, null, 2));
  try {
    const {labelId, id: email} = req.body;
    await applyLabel(gmail, {labelId, email});
    res.status(201);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3030, () => {
  console.log('Server listening on port 3030');
});
