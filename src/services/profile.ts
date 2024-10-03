import type {Profile} from '../stores/profile';

export const fetchProfile = async (): Promise<Profile> => {
    const res = await fetch('http://localhost:3030/profile');
    const resJson = await res.json();
    return resJson;
};
