import { WIDGET_TYPE } from '../../constants';
import { WidgetType } from '../../typings';

import ImageWidget from './ImageWidget';
import TextWidget from './TextWidget';

export const widgets = [
  { type: WIDGET_TYPE.image, Comp: ImageWidget },
  { type: WIDGET_TYPE.text, Comp: TextWidget },
];
