import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  FilterTable,
  LabelList,
  LabelsPieChart,
  MessageList,
  Profile,
  Suggestions
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
  labelsPieChartHeight,
  labelsPieChartNumLabels,
} from './constants';
import './App.css';

function App() {
  const [selectedLabel, setSelectedLabel] = useState('');
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
  const messagesPageToken = useAppSelector((state) => state.messages.pageToken)

  const handleMessageClick = (messageId: string) => {
    useFetchMessage(dispatch, messageId);
  };

  const handleLoadMoreMessagesClick = () => {
    useFetchMessages(dispatch, messagesPageToken);
  };

  const renderProfile = () => {
    if (profile) {
      return <Profile emailAddress={profile.emailAddress} threadsTotal={profile.threadsTotal} />;
    }
    if (profileStatus === 'loading') {
      return <span>Loading Profile...</span>;
    }
    return <span>Error Loading Profile!</span>;
  };

  const renderPieChart = () => {
    const pieChartReady = labels.length > 0 && profile.threadsTotal;
    return pieChartReady && (
      <LabelsPieChart
        labels={labels}
        threadsTotal={profile.threadsTotal}
        height={labelsPieChartHeight}
        topK={labelsPieChartNumLabels}
      />
    );
  };

  const renderLabels = () => {
    const labelsReady = labels.length > 0;
    if (labelsReady && profile.threadsTotal) {
      return (
        <LabelList
          selectedId={selectedLabel}
          onSelect={(id: string) => setSelectedLabel(id)}
          labels={labels}
        />
      );
    }
    if (labelsStatus === 'loading' || profileStatus === 'loading') {
      return <span>Loading Labels...</span>;
    }
    return <span>Error Loading labels!</span>;
  };

  const renderFilters = () => {
    const filtersReady = filters.length > 0;
    if (filtersReady) {
      const selectedLabelFilters = filters.filter(filter => filter.action.addLabelIds.includes(selectedLabel));
      return <FilterTable filters={selectedLabelFilters} />;
    }
    if (filtersStatus === 'loading') {
      return <span>Loading Filters...</span>;
    }
    return <span>Error Loading Filters!</span>
  };

  const renderMessages = () => {
    if (messages) {
      return (
        <Suggestions messages={messages} onLoadMore={handleLoadMoreMessagesClick} />
      );
    }
    if (messagesStatus === 'loading') {
      return <span>Loading Messages...</span>
    }
    return <span>Error Loading Messages!</span>
  };

  return (
    <Container maxWidth="md">
      {renderMessages()}
      {renderPieChart()}
      <Stack direction="row">
        {renderLabels()}
        {renderFilters()}
      </Stack>
      {renderProfile()}
    </Container>
  )
}

export default App
