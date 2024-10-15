import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  Profile,
  LabelList,
  LabelsPieChart,
  LabelFormPopup,
  FilterList,
  MessageGroupList,
} from './components';
import {
  createLabel,
  fetchLabels,
  selectUserLabels,
} from './stores/labels';
import {
  createFilter,
  fetchFilters,
  selectFilters,
  selectFiltersByLabel
} from './stores/filters';
import {fetchProfile, selectProfile} from './stores/profile';
import {fetchMessageGroups, selectMessageGroups} from './stores/messageGroups';
import {useAppDispatch, useAppSelector} from './hooks';
import {labelsPieChartHeight, labelsPieChartNumLabels} from './constants';

function App() {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedMessageDisplayName, setSelectedMessageDisplayName] = useState('');
  const [selectedMessageEmail, setSelectedMessageEmail] = useState('');
  const [isLabelFormOpen, setIsLabelFormOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchLabels());
    dispatch(fetchFilters());
  }, []);

  useEffect(() => {
    dispatch(fetchMessageGroups());
  }, []);

  const labels = useAppSelector(selectUserLabels);
  const labelsStatus = useAppSelector((state) => state.labels.status);

  const profile = useAppSelector(selectProfile);
  const profileStatus = useAppSelector((state) => profile.status);

  const filters = useAppSelector(selectFilters);
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
        dispatch(createFilter({email: selectedMessageEmail, labelId: label.id}));
      }
      // await useApplyLabel(dispatch, {labelId: label.id, selectedMessageEmail});
      console.log('Form submitted:', JSON.stringify({label, filter}, null, 2));
    } catch (err) {
      console.error(err);
    }
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
    return <FilterList filters={selectedLabelFilters} />;
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
    <Container maxWidth="md">
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
      <Stack direction="row">
        {renderLabels()}
        {renderFilters()}
      </Stack>
      {renderProfile()}
    </Container>
  )
}

export default App
