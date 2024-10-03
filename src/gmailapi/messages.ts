import {gmail_v1} from 'googleapis';

export async function getMessages(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.messages.list({userId: 'me'});
    return res.data;
}
