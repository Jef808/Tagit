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

  const {emailAddress: profileEmailAddress, threadsTotal: profileThreadsTotal} = useAppSelector((state) => state.profile);
  const profileStatus = useAppSelector((state) => state.profile.status);

  const filters = useAppSelector((state) => state.filters.filters);
  const filtersStatus = useAppSelector((state) => state.filters.status);

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
      return <span>Error Loading labels!</span>;
    }
    return (
      <>
      <LabelsPieChart
        labels={labels}
        threadsTotal={profileThreadsTotal}
        width={labelsPieChartWidth}
        height={labelsPieChartHeight}
        topK={labelsPieChartNumLabels}
      />
      {labels.map(({id, name, threadsTotal}) => {
        return <Label key={id} id={id} name={name} threadsTotal={threadsTotal}/>;
      })}
      </>
    );
  };

  const renderFilters = () => {
    if (filtersStatus === 'loading') {
      return <span>Loading Filters...</span>;
    } else if (filtersStatus === 'failed') {
      return <span>Error Loading Filters!</span>
    }
    return (
      <>
      {filters.map((filter) => JSON.stringify(filter, null, 2))}
      <br />
      </>
    )
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
      {renderFilters()}
    </div>
  )
}

export default App
