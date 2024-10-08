import {gmail_v1} from 'googleapis';

export async function getMessages(gmail: gmail_v1.Gmail, pageToken?: string) {
    const firstParams = {
        userId: 'me',
        maxResults: 500
    };
    const params = pageToken ? {pageToken, ...firstParams} : firstParams;
    const res = await gmail.users.messages.list(params);
    return {
        messages: res.data.messages,
        nextPageToken: res.data.nextPageToken
    };
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
