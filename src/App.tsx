import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  FilterTable,
  LabelList,
  LabelsPieChart,
  MessageList,
  Profile,
  MessageGroupList,
  LabelFormPopup
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
  const [selectedMessageDisplayName, setSelectedMessageDisplayName] = useState('');
  const [selectedMessageEmail, setSelectedMessageEmail] = useState('');
  const [isLabelFormOpen, setIsLabelFormOpen] = useState(false);

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

  const handleLoadMoreMessagesClick = () => {
    useFetchMessages(dispatch, messagesPageToken);
  };

  const handleMessageClick = ([displayName, email]: string[]) => {
    setSelectedMessageDisplayName(displayName);
    setSelectedMessageEmail(email);
    setIsLabelFormOpen(true);
  };

  const handleCloseLabelForm = () => {
    setIsLabelFormOpen(false);
  };

  const handleLabelFormSubmit = (formData: FormData) => {
    const formJson = Object.fromEntries((formData as any).entries());
    const labelName = formJson.label;
    console.log(labelName);
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
        <MessageGroupList
          messages={messages}
          labels={labels}
          onLoadMore={handleLoadMoreMessagesClick}
          onMessageClick={handleMessageClick}
          messagesStatus={messagesStatus}
        />
      );
    }
    if (messagesStatus === 'loading') {
      return <span>Loading Messages...</span>
    }
    return <span>Error Loading Messages!</span>
  };

  return (
    <Container maxWidth="md">
      {isLabelFormOpen && <LabelFormPopup
        displayName={selectedMessageDisplayName}
        email={selectedMessageEmail}
        open={isLabelFormOpen}
        onClose={handleCloseLabelForm}
        onSubmit={handleLabelFormSubmit}
      />}
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
