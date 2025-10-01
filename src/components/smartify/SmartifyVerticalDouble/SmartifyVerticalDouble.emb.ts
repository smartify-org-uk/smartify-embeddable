import { loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export const meta = {
  name: 'SmartifyVerticalDouble',
  label: 'Smartify Simple KPI Vertical Double',
  defaultWidth: 150,
  defaultHeight: 120,
  category: 'Smartify: Score Cards',
  classNames: ['inside-card'],
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset',
      description: 'Dataset',
      defaultValue: false,
      category: 'Chart data'
    },
    {
      name: 'metric_one',
      type: 'measure',
      label: 'measureOne',
      config: {
        dataset: 'ds'
      },
      category: 'Chart data',
    },
    {
      name: 'metric_two',
      type: 'measure',
      label: 'measureTwo',
      config: {
        dataset: 'ds'
      },
      category: 'Chart data',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Chart Title',
      description: 'The title for the chart',
      category: 'Chart settings',
    },
    {
      name: 'oneTitle',
      type: 'string',
      label: 'Title Measure One',
      description: 'The total tile for the measure',
      category: 'Chart settings',
    },
    {
      name: 'twoTitle',
      type: 'string',
      label: 'Title Measure Two',
      description: 'The users title for the measure',
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
      name: 'prefix_one',
      type: 'string',
      label: 'Prefix One',
      description: 'Prefix of the first measure',
      category: 'Chart settings',
    },
    {
      name: 'suffix_one',
      type: 'string',
      label: 'Suffix One',
      description: 'Suffix of the first measure',
      category: 'Chart settings',
    },
    {
      name: 'prefix_two',
      type: 'string',
      label: 'Prefix Two',
      description: 'Prefix of the second measure',
      category: 'Chart settings',
    },
    {
      name: 'suffix_two',
      type: 'string',
      label: 'Suffix Two',
      description: 'Suffix of the second measure',
      category: 'Chart settings',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Decimal Places',
      category: 'Formatting',
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Text size in pixels',
      defaultValue: 24,
      category: 'Formatting',
    },
    {
      name: 'enableDownloadAsCSV',
      type: 'boolean',
      label: 'Show download as CSV',
      category: 'Export options',
      defaultValue: false,
    },
    {
      name: 'enableDownloadAsPNG',
      type: 'boolean',
      label: 'Show download as PNG',
      category: 'Export options',
      defaultValue: false,
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      metricOne: inputs.metric_one,
      metricTwo: inputs.metric_two,
      results: loadData({
        from: inputs.ds,
        select: [inputs.metric_one, inputs.metric_two],
      }),
    };
  },
});