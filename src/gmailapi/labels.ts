import {gmail_v1} from 'googleapis';

export async function getLabels(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.labels.list({userId: 'me'});
    return res.data;
}

export async function getLabel(gmail: gmail_v1.Gmail, id: string) {
    const res = await gmail.users.labels.get({userId: 'me', id});
    return res.data;
}
