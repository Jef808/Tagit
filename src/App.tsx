import {useEffect, useState} from 'react';
import Divider from '@mui/material/Divider';
import {
  LabelList,
  LabelsPieChart,
  Profile
} from './components';
import {
  useFetchProfile,
  useFetchLabels,
  useFetchFilters,
  useFetchMessage,
  useFetchMessages,
  useAppDispatch,
  useAppSelector
} from './hooks';
import {
  labelsPieChartWidth,
  labelsPieChartHeight,
  labelsPieChartNumLabels,
} from './constants';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    useFetchProfile(dispatch);
    useFetchLabels(dispatch);
    useFetchFilters(dispatch);
    useFetchMessages(dispatch);
  }, []);

  const labels = useAppSelector((state) => state.labels.labels);
  const labelsStatus = useAppSelector((state) => state.labels.status);

  const profile = useAppSelector((state) => state.profile);
  const profileStatus = profile.status;

  const filters = useAppSelector((state) => state.filters.filters);
  const filtersStatus = useAppSelector((state) => state.filters.status);

  const messages = useAppSelector((state) => state.messages.messages);
  const messagesStatus = useAppSelector((state) => state.messages.status);

  const renderProfile = () => {
    if (profile) {
      return <Profile emailAddress={profile.emailAddress} threadsTotal={profile.threadsTotal} />;
    }
    if (profileStatus === 'loading') {
      return <span>Loading Profile...</span>;
    }
    return <span>Error Loading Profile!</span>;
  };

  const renderLabels = () => {
    if (labels && profile.threadsTotal) {
      return (
        <>
          <LabelsPieChart
            labels={labels}
            threadsTotal={profile.threadsTotal}
            width={labelsPieChartWidth}
            height={labelsPieChartHeight}
            topK={labelsPieChartNumLabels}
          />
          <Divider />
          <LabelList labels={labels} />
        </>
      );
    }
    if (labelsStatus === 'loading' || profileStatus === 'loading') {
      return <span>Loading Labels...</span>;
    }
    return <span>Error Loading labels!</span>;
  };

  const renderFilters = () => {
    if (filters) {
      return <>{filters.map((filter) => <div>{JSON.stringify(filter, null, 2)}</div>)}</>;
    }
    if (filtersStatus === 'loading') {
      return <span>Loading Filters...</span>;
    }
    return <span>Error Loading Filters!</span>
  };

  const renderMessages = () => {
    if (messages) {
      return <>{messages.map((message) => <div>{JSON.stringify(message, null, 2)}</div>)}</>;
    }
    if (messagesStatus === 'loading') {
      return <span>Loading Messages...</span>
    }
    return <span>Error Loading Messages!</span>
  };

  return (
    <>
      {renderProfile()}
      {renderLabels()}
    {/* renderFilters() */}
      {renderMessages()}
    </>
  )
}

export default App
