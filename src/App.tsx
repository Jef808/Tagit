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
} from './stores/labels';
import {
  createFilter,
  fetchFilters,
  selectFilters,
  selectFiltersStatus,
  selectFiltersByLabel
} from './stores/filters';
import {
  fetchProfile,
  selectProfile,
  selectProfileStatus
} from './stores/profile';
import {
  fetchMessageGroups,
  selectMessageGroups,
  selectMessageGroupsStatus,
  selectMessageGroupsNextPageToken
} from './stores/messageGroups';
import {applyLabelToMessageGroup} from './thunks';
import {useAppDispatch, useAppSelector} from './hooks';
import {labelsPieChartHeight, labelsPieChartNumLabels} from './constants';

function App() {
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

  const filters = useAppSelector(selectFilters);
  const filtersStatus = useAppSelector(selectFiltersStatus);

  const messageGroups = useAppSelector(selectMessageGroups);
  const messageGroupsStatus = useAppSelector(selectMessageGroupsStatus);
  const messageGroupsNextPageToken = useAppSelector(selectMessageGroupsNextPageToken);

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

  const handleFormSubmit = async(formData: FormData) => {
    const formJson = Object.fromEntries((formData as any).entries());
    const labelName = formJson.label;
    dispatch(applyLabelToMessageGroup({labelName, filterFrom: selectedMessageEmail}));
  };

  return (
    <Container maxWidth="md">
      {isLabelFormOpen && (
        <LabelFormPopup
          displayName={selectedMessageDisplayName}
          email={selectedMessageEmail}
          open={isLabelFormOpen}
          onClose={handleCloseLabelForm}
          onSubmit={handleFormSubmit}
        />
      )}
      <MessageGroupList
        messageGroups={messageGroups}
        filters={filters}
        onLoadMore={handleLoadMoreMessagesClick}
        onMessageClick={handleMessageClick}
        messageGroupsStatus={messageGroupsStatus}
      />
      <LabelsPieChart
        height={labelsPieChartHeight}
        topK={labelsPieChartNumLabels}
      />
      <Stack direction="row">
        <LabelList />
        <FilterList />
      </Stack>
      <Profile />
    </Container>
  )
}

export default App
