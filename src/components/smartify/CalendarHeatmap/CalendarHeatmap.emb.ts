import { Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import Component from './index';

export const meta = {
  name: 'CalendarHeatmap',
  label: 'Calendar Heatmap',
  classNames: ['inside-card'],
  category: 'Charts: essentials',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'date',
      type: 'dimension',
      label: 'Date',
      description: 'Date (daily) to plot on the calendar',
      config: { dataset: 'ds' },
      category: 'Chart data',
    },
    {
      name: 'metric',
      type: 'measure',
      label: 'Metric',
      description: 'Metric value determining heatmap intensity',
      config: { dataset: 'ds' },
      category: 'Chart data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the chart',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the chart',
      category: 'Chart settings',
    },
    {
      name: 'showMonthLabels',
      type: 'boolean',
      label: 'Show month labels',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'showWeekdayLabels',
      type: 'boolean',
      label: 'Show weekday labels',
      defaultValue: true,
      category: 'Chart settings',
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity',
      defaultValue: 'day',
      category: 'Variables to configure',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      description: 'Number of decimal places for metric values',
      category: 'Formatting',
    },
    {
      name: 'showLabels',
      type: 'boolean',
      label: 'Show Labels',
      category: 'Chart settings',
      defaultValue: false,
    },
    {
      name: 'xAxisTitle',
      type: 'string',
      label: 'X-Axis Title',
      category: 'Chart settings',
    },
    {
      name: 'showLegend',
      type: 'boolean',
      label: 'Show Legend',
      category: 'Chart settings',
      defaultValue: true,
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      defaultValue: true,
      category: 'Export options',
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      defaultValue: true,
      category: 'Export options',
    },
  ],
  events: []  // No events (no click actions) for this component
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.ds,
        timeDimensions: [
          {
            dimension: inputs.date?.name,
            granularity: inputs.granularity,
          },
        ],
        measures: [inputs.metric],
      }),
    };
  },
  // No event handlers since no interactive events
  events: {}
});