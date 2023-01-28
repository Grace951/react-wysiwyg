import type { FC } from 'react';

import styled from 'styled-components';
import { SelectorTool as Icon } from '../../icons';

const Widget = styled.div`
  cursor: pointer;
  fill: white;
  text-align: center;
  svg {
    width: 80%;
    height: 26px;
    display: inline-block;
  }
`;

const SelectorTool: FC = () => {
  return (
    <Widget>
      <Icon />
    </Widget>
  );
};

export default SelectorTool;
