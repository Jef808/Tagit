import {useEffect, useState} from 'react';
import {
  Label,
  LabelsPieChart,
  Profile
} from './components';
import {
  useFetchProfile,
  useFetchLabels,
  useFetchFilters,
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
  const [messages, setMessages] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    useFetchProfile(dispatch);
    useFetchLabels(dispatch);
    useFetchFilters(dispatch);
  }, []);

  const labels = useAppSelector((state) => state.labels.labels);
  const labelsStatus = useAppSelector((state) => state.labels.status);

  const profile = useAppSelector((state) => state.profile);
  const profileStatus = profile.status;

  const filters = useAppSelector((state) => state.filters.filters);
  const filtersStatus = useAppSelector((state) => state.filters.status);

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
          {labels.map(({id, name, threadsTotal}) => {
            return <Label key={id} id={id} name={name} threadsTotal={threadsTotal}/>;
          })}
        </>
      );
    }
    if (labelsStatus === 'loading') {
      return <span>Loading Labels...</span>;
    }
    return <span>Error Loading labels!</span>;
  };

  const renderFilters = () => {
    if (filters) {
      return (
        <>
          {filters.map((filter) => JSON.stringify(filter, null, 2))}
          <br />
        </>
      )
    }
    if (filtersStatus === 'loading') {
      return <span>Loading Filters...</span>;
    }
    return <span>Error Loading Filters!</span>
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
    <>
      {renderProfile()}
      {renderLabels()}
      {renderFilters()}
    </>
  )
}

export default App
