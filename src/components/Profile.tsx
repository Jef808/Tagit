import type {FC} from 'react';
import type {Profile} from '../stores/profile';

export const Profile: FC<Profile> = ({
  emailAddress,
  threadsTotal
}: Profile) => {
  return (
    <div>
      <h2>{emailAddress}</h2>
    </div>
  );
}
