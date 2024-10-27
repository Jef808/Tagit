import {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  Profile,
  LabelList,
  LabelsPieChart,
  FilterList,
  MessageGroupList,
} from './components';
import {fetchProfile} from './stores/profile';
import {fetchLabels} from './stores/labels';
import {fetchFilters} from './stores/filters';
import {useAppDispatch} from './hooks';
import {labelsPieChartHeight, labelsPieChartNumLabels} from './constants';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLabels());
    dispatch(fetchFilters());
    dispatch(fetchProfile());
  }, []);

  return (
    <Container maxWidth="md">
      <MessageGroupList />
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
