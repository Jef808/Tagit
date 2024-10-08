import {gmail_v1} from 'googleapis';
import type {Filter} from '../stores/filters';

export async function getFilters(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.settings.filters.list({userId: 'me'});
    return res.data;
}

export async function createFilter(gmail: gmail_v1.Gmail, filter: Filter) {
    const res = await gmail.users.settings.filters.create({userId: 'me', requestBody: filter});
    return res.data;
}
