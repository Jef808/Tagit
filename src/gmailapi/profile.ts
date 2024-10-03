import {gmail_v1} from 'googleapis';

export async function getProfile(gmail: gmail_v1.Gmail) {
    const res = await gmail.users.getProfile({userId: 'me'});
    return res.data;
}
