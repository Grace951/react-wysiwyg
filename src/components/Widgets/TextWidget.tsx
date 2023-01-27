import type { FC } from 'react';

import styled from 'styled-components';

const Widget = styled.div`
  cursor: pointer;
`;

const TextWidget: FC = () => {
  return (
    <Widget>
      <span className="material-icons">text_fields</span>
    </Widget>
  );
};

export default TextWidget;
