import type { FC } from 'react';

import styled from 'styled-components';
import { ImageWidgetData } from '../../typings';
import { ELEMENT_ROLE } from '../../constants';

const Object = styled.div`
  position: absolute;
  border: 1px solid #ddd;
  cursor: move;
`;

interface Props {
  data: ImageWidgetData;
  idx: number;
}

const ImageWidget: FC<Props> = ({ data, idx }) => {
  const { width, height, x, y } = data;
  return (
    <Object
      draggable="false"
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

export default ImageWidget;
