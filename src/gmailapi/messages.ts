import {gmail_v1} from 'googleapis';

export type GetMessagesParams = {
    pageToken?: string,
    q?: string
};

export async function getMessageGroups(gmail: gmail_v1.Gmail, pageToken: string) {
    const {messages, nextPageToken} = await getMessages(gmail, pageToken);

    const messageGroups: Record<string, number> = {};
    messages && await Promise.all(messages.map(async ({id}) => {
        const fromHeader = id && await getFromHeader(gmail, id);
        if (fromHeader && !messageGroups[fromHeader]) {
            const numMessage = await getNumMessagesFrom(gmail, fromHeader);
            numMessage && (messageGroups[fromHeader] = numMessage);
        }
    }));
    return {
        messageGroups,
        nextPageToken
    };
}

export async function getMessages(gmail: gmail_v1.Gmail, pageToken: string) {
    const res = await gmail.users.messages.list({
        userId: 'me',
        pageToken
    });
    return {
        messages: res.data.messages,
        nextPageToken: res.data.nextPageToken
    };
}

export async function getNumMessagesFrom(gmail: gmail_v1.Gmail, email: string) {
    const q = `from:${email}`;
    let pageToken = '';
    let result = 0;
    while (true) {
        const {messages, nextPageToken} = await getFilteredMessages(gmail, {pageToken, q});
        result += messages.length;
        pageToken = nextPageToken;
        if (!pageToken) break;
    }
    return result;
}

export async function getFilteredMessages(gmail: gmail_v1.Gmail, {pageToken, q}: GetMessagesParams) {
    const params = {
        userId: 'me',
        pageToken: pageToken || '',
        q: q || ''
    };
    const res = await gmail.users.messages.list(params);
    return {
        messages: res.data.messages || [],
        nextPageToken: res.data.nextPageToken || ''
    };
}

export async function getFromHeader(gmail: gmail_v1.Gmail, messageId: string) {
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'metadata',
        metadataHeaders: ['From']
    });
    const headers = res.data.payload?.headers || [];
    const fromHeader = headers.find(header => header.name === 'From')?.value;
    return fromHeader;
}
