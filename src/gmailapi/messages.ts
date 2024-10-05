import {gmail_v1} from 'googleapis';

export async function getMessages(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.messages.list({userId: 'me'});
    return res.data.messages;
}

export async function getMessage(gmail: gmail_v1.Gmail, id: string) {
    const res = await gmail.users.messages.get({id: id, userId: 'me'});
    return res.data;
}

export async function getMessageMetadata(gmail: gmail_v1.Gmail, id: string) {
    const res = await gmail.users.messages.get({
        id: id,
        userId: 'me',
        format: 'metadata',
        metadataHeaders: [
            'Subject',
            'Date',
            'From',
            'List-Unsubscribe'
        ]
    });
    return res.data;
}
