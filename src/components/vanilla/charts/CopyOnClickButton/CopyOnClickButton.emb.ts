import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component, { Props } from './index';

const VARIABLE_COUNT = 9;

const createVariableRange = () => Array.from({ length: VARIABLE_COUNT }, (_, index) => index + 1);

const sourceKeyInputs = createVariableRange().map((position) => ({
  name: `sourceKey${position}`,
  type: 'string' as const,
  label: `Source variable ${position} key`,
  category: 'Variables',
}));

const targetKeyInputs = createVariableRange().map((position) => ({
  name: `targetKey${position}`,
  type: 'string' as const,
  label: `Target variable ${position} key`,
  category: 'Variables',
}));

const targetEventProperties = createVariableRange().map((position) => ({
  name: `targetValue${position}`,
  type: 'string' as const,
}));

const sourceVariables = createVariableRange().map((position) => ({
  name: `Source variable ${position}`,
  type: 'string' as const,
  inputs: [`sourceKey${position}`],
}));

const targetVariables = createVariableRange().map((position) => ({
  name: `Target variable ${position}`,
  type: 'string' as const,
  inputs: [`targetKey${position}`],
  events: [{ name: 'onCopied', property: `targetValue${position}` }],
}));

export const meta = {
  name: 'CopyOnClickButton',
  label: 'Copy on Click Button',
  defaultWidth: 200,
  defaultHeight: 80,
  category: 'Controls: actions',
  inputs: [
    {
      name: 'label',
      type: 'string',
      label: 'Button label',
      defaultValue: 'Copy values',
      category: 'Settings',
    },
    {
      name: 'disabled',
      type: 'boolean',
      label: 'Disabled',
      defaultValue: false,
      category: 'Settings',
    },
    {
      name: 'showSpinner',
      type: 'boolean',
      label: 'Show spinner',
      defaultValue: false,
      category: 'Settings',
    },
    ...sourceKeyInputs,
    ...targetKeyInputs,
  ],
  events: [
    {
      name: 'onCopied',
      label: 'Copied',
      properties: [
        {
          name: 'from',
          type: 'string',
          array: true,
        },
        {
          name: 'to',
          type: 'string',
          array: true,
        },
        ...targetEventProperties,
      ],
    },
  ],
  variables: [...sourceVariables, ...targetVariables],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent<Props, typeof meta>(Component, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    const {
      sourceKey1,
      sourceKey2,
      sourceKey3,
      sourceKey4,
      sourceKey5,
      sourceKey6,
      sourceKey7,
      sourceKey8,
      sourceKey9,
      targetKey1,
      targetKey2,
      targetKey3,
      targetKey4,
      targetKey5,
      targetKey6,
      targetKey7,
      targetKey8,
      targetKey9,
      ...rest
    } = inputs;

    const sourceKeys = [
      sourceKey1,
      sourceKey2,
      sourceKey3,
      sourceKey4,
      sourceKey5,
      sourceKey6,
      sourceKey7,
      sourceKey8,
      sourceKey9,
    ] as Props['sourceKeys'];

    const targetKeys = [
      targetKey1,
      targetKey2,
      targetKey3,
      targetKey4,
      targetKey5,
      targetKey6,
      targetKey7,
      targetKey8,
      targetKey9,
    ] as Props['targetKeys'];

    return {
      ...rest,
      sourceKeys,
      targetKeys,
    };
  },
  events: {
    onCopied: ({ from, to }) => {
      const payload: Record<string, unknown> = {
        from,
        to,
      };

      createVariableRange().forEach((position) => {
        payload[`targetValue${position}`] = to?.[position - 1];
      });

      return payload;
    },
  },
});
