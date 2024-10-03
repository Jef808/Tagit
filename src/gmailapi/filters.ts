import {gmail_v1} from 'googleapis';

export async function getFilters(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.settings.filters.list({userId: 'me'});
    return res.data;
}
