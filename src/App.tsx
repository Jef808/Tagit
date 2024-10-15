import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  Profile,
  LabelList,
  LabelsPieChart,
  LabelFormPopup,
  FilterTable,
  MessageGroupList,
} from './components';
import {
  useCreateFilter,
  useFetchProfile,
  useFetchLabels,
  useFetchFilters,
  useAppDispatch,
  useAppSelector
} from './hooks';
import {
  fetchMessageGroups,
  selectMessageGroups,
  selectMessageGroupById
} from './stores/messageGroups';
import {
  createLabel,
  fetchLabels,
  selectUserLabels,
  selectLabelById
} from './stores/labels';
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
    dispatch(fetchLabels());
    useFetchFilters(dispatch);
  }, []);

  useEffect(() => {
    dispatch(fetchMessageGroups());
  }, []);

  const labels = useAppSelector(selectUserLabels);
  const labelsStatus = useAppSelector((state) => state.labels.status);

  const profile = useAppSelector((state) => state.profile);
  const profileStatus = profile.status;

  const filters = useAppSelector((state) => state.filters.filters);
  const filtersStatus = useAppSelector((state) => state.filters.status);

  const messageGroups = useAppSelector(selectMessageGroups);
  const messageGroupsStatus = useAppSelector((state) => state.messageGroups.status);
  const messageGroupsNextPageToken = useAppSelector((state) => state.messageGroups.nextPageToken);

  const handleLoadMoreMessagesClick = () => {
    dispatch(fetchMessageGroups(messageGroupsNextPageToken));
  };

  const handleMessageClick = ([displayName, email]: string[]) => {
    setSelectedMessageDisplayName(displayName);
    setSelectedMessageEmail(email);
    setIsLabelFormOpen(true);
  };

  const handleCloseLabelForm = () => {
    setIsLabelFormOpen(false);
  };

  const handleLabelFormSubmit = async (formData: FormData) => {
    const formJson = Object.fromEntries((formData as any).entries());
    const labelName = formJson.label;
    try {
      let label = labels.find(label => label.name === labelName);
      if (!label) {
        dispatch(createLabel(labelName));
      }
      let filter = filters.find(filter => (
        filter.criteria.from.includes(selectedMessageEmail) && filter.action.addLabelIds.includes(label.id)
      ));
      if (!filter) {
        filter = await useCreateFilter(dispatch, {email: selectedMessageEmail, labelId: label.id});
        // useFetchFilters(dispatch);
      }
      await useApplyLabel(dispatch, {labelId: label.id, selectedMessageEmail});
      console.log('Form submitted:', JSON.stringify({label, filter}, null, 2));
    } catch (err) {
      console.error(err);
    }
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

  const renderLabels = () => (
    <LabelList
      selectedId={selectedLabel}
      onSelect={(id: string) => setSelectedLabel(id)}
      labels={labels}
    />
  );

  const renderFilters = () => {
    const selectedLabelFilters = filters.filter(filter => filter.action.addLabelIds.includes(selectedLabel));
    return <FilterTable filters={selectedLabelFilters} />;
  };

  const renderMessages = () => {
    if (labelsStatus === 'loading') {
      return <span>Loading Labels...</span>;
    }
    return (
      <MessageGroupList
        messageGroups={messageGroups}
        labels={labels}
        filters={filters}
        onLoadMore={handleLoadMoreMessagesClick}
        onMessageClick={handleMessageClick}
        messageGroupsStatus={messageGroupsStatus}
      />
    );
  };

  return (
    <Container
      maxWidth="md"
    >
      {isLabelFormOpen && (
        <LabelFormPopup
          displayName={selectedMessageDisplayName}
          email={selectedMessageEmail}
          open={isLabelFormOpen}
          onClose={handleCloseLabelForm}
          onSubmit={handleLabelFormSubmit}
        />
      )}
      {renderMessages()}
      {renderPieChart()}
      <Stack
        direction="row"
      >
        {renderLabels()}
        {renderFilters()}
      </Stack>
      {renderProfile()}
    </Container>
  )
}

export default App
