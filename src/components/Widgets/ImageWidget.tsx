import type { FC } from 'react';

import styled from 'styled-components';

const Widget = styled.div`
  cursor: pointer;
`;

const ImageWidget: FC = () => {
  return (
    <Widget>
      <span className="material-icons">image</span>
    </Widget>
  );
};

export default ImageWidget;
