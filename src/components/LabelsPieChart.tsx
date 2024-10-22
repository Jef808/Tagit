import {type FC, Suspense} from 'react';
import {PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import {type Label, selectUserLabels, selectLabelsStatus} from '../stores/labels';
import {selectProfile} from '../stores/profile';
import {useAppSelector} from '../hooks';

export type LabelsPieChartProps = {
  height: number,
  topK: number
};

export const LabelsPieChart: FC<LabelsPieChartProps> = ({
  height,
  topK
}) => {
  const labels = useAppSelector(selectUserLabels);
  const labelsStatus = useAppSelector(selectLabelsStatus);
  const {threadsTotal} = useAppSelector(selectProfile);
  const effectiveLabels = [
    {
      name: "Unlabeled",
      threadsTotal: threadsTotal - labels.reduce((acc, label) => acc + label.threadsTotal, 0)
    },
    ...labels
  ];
  effectiveLabels.sort((a, b) => b.threadsTotal - a.threadsTotal);
  effectiveLabels.splice(topK);
  const series = [
    {
      arcLabel: (item) => `${(100.0 * item.value / threadsTotal).toFixed(2)}%`,
      arcLabelMinAngle: 20,  // Show arcLabel only for entries with 20+% shares
      arcLabelRadius: '60%',
      data: effectiveLabels.map(({threadsTotal, name}, idx) => ({
        id: idx,
        value: threadsTotal,
        label: name
      }))
    },
  ];
  const sx = {
    [`& .${pieArcLabelClasses.root}`]: {
        fontWeight: 'bold',
    },
    border: '1px solid grey',
    borderRadius: 3,
  }

  return (
    <PieChart series={series} sx={sx} height={height} />
  );
};
