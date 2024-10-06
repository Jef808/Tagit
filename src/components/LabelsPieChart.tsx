import type {FC} from 'react';
import {PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';
import type {Label} from '../stores/labels';

export type LabelsPieChartProps = {
    labels: Label[],
    threadsTotal: number,
    height: number,
    topK: number
};

export const LabelsPieChart: FC<LabelsPieChartProps> = ({
    labels,
    threadsTotal,
    height,
    topK
}) => {
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
            data: effectiveLabels.map((label, idx) => ({
                id: idx,
                value: label.threadsTotal,
                label: label.name
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

    return <PieChart series={series} sx={sx} height={height} />;
};
