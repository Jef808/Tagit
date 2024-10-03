import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from './hooks';
import {fetchLabels, fetchProfile} from './services';
import {
  resetLabels,
  pushLabel,
  setLabelsLoading,
  loadLabelsSuccess,
  loadLabelsFailure
} from './stores/labels';
import {
  setProfileLoading,
  setProfile,
  loadProfileSuccess,
  loadProfileFailure
} from './stores/profile';
import {Label, Profile} from './components';
import './App.css';

function App() {
  const [filters, setFilters] = useState([]);
  const [messages, setMessages] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // fetch profile
    dispatch(setProfileLoading());
    fetchProfile().then((profile) => {
      dispatch(setProfile(profile));
      dispatch(loadProfileSuccess());
    }).catch((err) => {
      console.error(err);
      dispatch(loadProfileFailure());
    });

    // fetch labels
    dispatch(resetLabels());
    dispatch(setLabelsLoading());
    fetchLabels().then((labels) => {
      labels.forEach((label) => {
        label.then((l) => dispatch(pushLabel(l)));
      });
      dispatch(loadLabelsSuccess());
    }).catch((err) => {
      console.error(err);
      dispatch(loadLabelsFailure());
    });
  }, []);

  const labels = useAppSelector((state) => state.labels.labels);
  const labelsStatus = useAppSelector((state) => state.labels.status);

  const {emailAddress: profileEmailAddress, threadsTotal: profileThreadsTotal} = useAppSelector((state) => state.profile);
  const profileStatus = useAppSelector((state) => state.profile.status);

  const renderProfile = () => {
    if (profileStatus === 'loading') {
      return <span>Loading Profile...</span>;
    } else if (profileStatus === 'failed') {
      return <span>Error Loading Profile!</span>;
    }
    return <Profile emailAddress={profileEmailAddress} threadsTotal={profileThreadsTotal} />
  };

  const renderLabels = () => {
    if (labelsStatus === 'loading') {
      return <span>Loading Labels...</span>;
    } else if (labelsStatus === 'failed') {
      return <span>Error loading labels!</span>;
    }
    return (
      <>
      {labels.map(({id, name, threadsTotal}) => {
        return <Label key={id} id={id} name={name} threadsTotal={threadsTotal}/>;
      })}
      </>
    );
  };

  const getFilters = async () => {
    try {
      const res = await fetch('http://localhost:3030/filters');
      const resData = await res.json();
      setFilters(resData);
    } catch (err) {
      console.error(err);
    }
  };

  const getMessages = async () => {
    try {
      const res = await fetch('http://localhost:3030/messages');
      const resData = await res.json();
      setMessages(resData);
    } catch (err) {
      console.error(err);
    }
  };

  const numberOfMessages = () => {
    const n = profile.threadsTotal;
    return n && (
      <span>Number of messages: {n}</span>
    );
  };

  return (
    <div className="card">
      {renderProfile()}
      {renderLabels()}
    </div>
  )
}

export default App
