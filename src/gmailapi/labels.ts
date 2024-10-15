import {gmail_v1} from 'googleapis';
import {getFilteredMessages} from './messages';

type ApplyLabelParams = {
    labelId: string,
    email: string
};

async function getLabel(gmail: gmail_v1.Gmail, id: string) {
    const res = await gmail.users.labels.get({userId: 'me', id});
    return res.data;
}

export async function getLabels(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.labels.list({userId: 'me'});
    const labels = res.data.labels;
    const finalResult = await Promise.all(labels?.map(async (label) => {
        const labelRes = await getLabel(gmail, label.id!);
        return labelRes;
    }) || []);
    return finalResult;
}

export async function applyLabel(gmail: gmail_v1.Gmail, {labelId, email}: ApplyLabelParams) {
    const batchSize = 1000;
    const messageIds = [];
    let pageToken = '';
    const q = `from:${email}`;

    while (true) {
        const {messages, nextPageToken} = await getFilteredMessages(gmail, {pageToken, q});
        messageIds.push(...messages.map(m => m.id!));
        pageToken = nextPageToken;
        if (!pageToken) break;
    }

    for (let i = 0; i < messageIds.length; i += batchSize) {
        const batch = messageIds.slice(i, i + batchSize);

        await gmail.users.messages.batchModify({
            userId: 'me',
            requestBody: {
                ids: batch,
                addLabelIds: [labelId]
            }
        });
    }
}

export async function createLabel(gmail: gmail_v1.Gmail, name: string) {
    const res = await gmail.users.labels.create({userId: 'me', requestBody: {name}});
    return res.data;
}
