import { ComponentMeta, ComponentStory } from '@storybook/react';
import Editor from '../src/components/Editor';
import { WIDGET_TYPE } from '../src/constants';
export default {
  title: 'Example/Editor',
  component: Editor,
} as ComponentMeta<typeof Editor>;
const Template: ComponentStory<typeof Editor> = (args) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: '#ddd',
    }}
  >
    <Editor {...args} />
  </div>
);
export const Default = Template.bind({});

Default.args = {
  drawObjects: [
    {
      name: 'First',
      width: 300,
      height: 400,
      x: 20,
      y: 20,
      idx: 0,
      widgetType: WIDGET_TYPE.image,
      layerIdx: 0,
    },
    {
      name: 'Second',
      width: 300,
      height: 100,
      x: 120,
      y: 400,
      idx: 1,
      widgetType: WIDGET_TYPE.text,
      layerIdx: 0,
    },
  ],
};
