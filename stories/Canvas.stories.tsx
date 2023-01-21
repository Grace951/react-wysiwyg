import { ComponentMeta, ComponentStory } from '@storybook/react';
import Canvas from '../src/components/Canvas';
import { WIDGET_TYPE } from '../src/constants';
export default {
  title: 'Example/Canvas',
  component: Canvas,
} as ComponentMeta<typeof Canvas>;
const Template: ComponentStory<typeof Canvas> = (args) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      height: '100vh',
      background: '#ddd',
    }}
  >
    <Canvas {...args} />
  </div>
);
export const Default = Template.bind({});

Default.args = {
  drawObjects: [
    {
      name: 'First',
      width: 100,
      height: 100,
      x: 20,
      y: 20,
      idx: 0,
      widgetType: WIDGET_TYPE.image,
      layerIdx: 0,
    },
  ],
};
