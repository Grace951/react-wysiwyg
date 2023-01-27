import type { FC } from 'react';

import styled from 'styled-components';
import { WidgetType, ImageWidgetData } from '../../typings';
import { ELEMENT_ROLE } from '../../constants';

const Object = styled.div`
  position: absolute;
  border: 1px solid #ddd;
  cursor: move;
`;

interface Props {
  data: ImageWidgetData;
}

const ImageWidget: FC<Props> = ({ idx, width, height, x, y }) => {
  return (
    <Object
      draggable="false"
      key={idx}
      data-active-obj-idx={idx}
      data-role={ELEMENT_ROLE.drawObject}
      onClick={() => {}}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    />
  );
};
