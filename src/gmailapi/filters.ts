import {gmail_v1} from 'googleapis';
import type {Filter} from '../stores/filters';

export async function getFilters(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.settings.filters.list({userId: 'me'});
    return res.data;
}

export async function createFilter(gmail: gmail_v1.Gmail, {
    email,
    labelId
}: {
    email: string,
    labelId: string
}): Promise<Filter> {
    const criteria = {from: email};
    const action = {addLabelIds: [labelId]};
    const res = await gmail.users.settings.filters.create({userId: 'me', requestBody: {criteria, action}});
    return res.data as Filter;
}
