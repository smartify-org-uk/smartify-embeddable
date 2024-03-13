import { EmbeddedComponentMeta, defineComponent } from "@embeddable.com/react";
import Component from './index';



export const meta: EmbeddedComponentMeta = {
    name: 'SmartifySeparator',
    label: 'Smartify Separator Spacing',
    inputs: [
        {
            name: 'spacing',
            type: 'number',
            label: 'Margin Top and Bottom',
            description: 'Total pixels that will be added above and below the separator line',
            category: 'Configure chart'
        },
        {
            name: 'thickness',
            type: 'number',
            label: 'Thickness of the line',
            description: 'How thick should be the separator line',
            category: 'Configure chart'
<<<<<<< Updated upstream
=======
        },
        {
            name: 'color',
            type: 'string',
            label: 'Color of the line',
            description: 'You got it right...',
            category: 'Configure chart'
>>>>>>> Stashed changes
        }
    ]
};

export type Inputs = {
    spacing?: number;
    thickness?: number;
<<<<<<< Updated upstream
=======
    color?: string;
>>>>>>> Stashed changes
};

export default defineComponent<Inputs>(Component, meta, {
    props: (inputs) => {
        return {
            ...inputs
        }
    },
})