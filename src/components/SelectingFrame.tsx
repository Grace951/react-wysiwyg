import type { FC } from 'react';
import { ELEMENT_ROLE } from '../constants';

import styled from 'styled-components';

const Frame = styled.div`
  position: absolute;
  background-color: rgba(0, 100, 255, 0.13);
`;

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
}

const SelectingFrame: FC<Props> = ({ width = 0, height = 0, x = 0, y = 0 }) => {
  return (
    <Frame
      draggable="false"
      style={{
        border: '1px dot #158a25',
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      data-desc="selecting frame"
      data-role={ELEMENT_ROLE.controlFrameVertex}
    />
  );
};

export default SelectingFrame;
