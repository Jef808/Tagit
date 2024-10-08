import path from 'path';
import {google} from 'googleapis';
import {authenticate} from '@google-cloud/local-auth';
import express, {Request, Response} from 'express';
import cors from 'cors';
import {createLabel, getLabel, getLabels} from './labels';
import {getFilters} from './filters';
import {getProfile} from './profile';
import {getMessages, getMessageMetadata} from './messages';

const gmail = google.gmail('v1');

authenticate({
    keyfilePath: path.join(__dirname, '../../client_secret_723788189851-kmhg8nih04sckav3g08t83kl301sva82.apps.googleusercontent.com.json'),
    scopes: [
      'https://www.googleapis.com/auth/gmail.metadata',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/gmail.settings.basic'
    ]
}).then((auth) => {
    google.options({auth});
}).catch((error) => {
    console.error(error);
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/profile', async (_: Request, res: Response) => {
  console.log('GET PROFILE REQUEST');
  try {
    const data = await getProfile(gmail);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/labels', async (_: Request, res: Response) => {
  console.log('GET LABELS REQUEST');
  try {
    const data = await getLabels(gmail);
    res.json(data.labels);
  } catch (err) {
    console.error(err);
  }
});

app.get('/labels/:id', async (req: Request, res: Response) => {
  console.log('GET LABEL REQUEST');
  try {
    const {id} = req.params;
    const data = await getLabel(gmail, id);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

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

app.get('/filters', async (_: Request, res: Response) => {
  console.log('GET FILTERS REQUEST');
  try {
    const data = await getFilters(gmail);
    res.json(data.filter);
  } catch (err) {
    console.error(err);
  }
});

app.post('/filters', async (req: Request, res: Response) => {
  console.log('POST FILTERS REQUEST', JSON.stringify(req.body, null, 2));
  try {
    const data = await createLabel(gmail, req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/messages', async (_: Request, res: Response) => {
  console.log('GET MESSAGES REQUEST (NO PAGE TOKEN)');
  try {
    const data = await getMessages(gmail);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/messages/:pageToken', async (req: Request, res: Response) => {
  console.log('GET MESSAGES REQUEST');
  try {
    const {pageToken} = req.params;
    const data = await getMessages(gmail, pageToken);
    res.send(data);
  } catch (err) {
    console.error(err);
  }
});

app.get('/message/:id', async (req: Request, res: Response) => {
  console.log('GET MESSAGE REQUEST');
  try {
    const {id} = req.params;
    const data = await getMessageMetadata(gmail, id);
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

app.listen(3030, () => {
  console.log('Server listening on port 3030');
});
