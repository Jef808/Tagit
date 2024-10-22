import {type FC, Suspense} from 'react';
import {
  type Profile,
  selectProfile,
  selectProfileStatus
} from '../stores/profile';
import {useAppSelector} from '../hooks';

export const Profile: FC = () => {
  const {emailAddress, threadsTotal} = useAppSelector(selectProfile);
  return (
    <Suspense fallback="Loading...">
      <div>
        <h2>{emailAddress}</h2>
      </div>
    </Suspense>
  );
}
