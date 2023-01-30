import type { FC, MouseEvent } from 'react';
import { MAX_XINDEX_VALUE } from '../../constants';

import styled from 'styled-components';

const Tools = styled.div`
  width: auto;
  height: 32px;
  padding: 6px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  position: absolute;
  z-index: ${MAX_XINDEX_VALUE};
  top: -36px;
  box-shadow: 2px 2px 15px 1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  color: #0080ff;
  user-select: none;
`;

const Tool = styled.div`
  cursor: pointer;
  margin-right: 5px;
  &:last-child {
    margin-right: 0;
  }
`;

interface Props {
  copyObj: (idx: number) => void;
  deleteObj: (idx: number) => void;
  idx: number;
}

const ObjectTools: FC<Props> = ({
  copyObj = () => {},
  deleteObj = () => {},
  idx,
}) => {
  const handleCopy = (e: MouseEvent<HTMLElement>) => {
    copyObj(idx);
  };
  const handleDelete = (e: MouseEvent<HTMLElement>) => {
    deleteObj(idx);
  };
  return (
    <Tools>
      <Tool onClick={handleCopy}>
        <span className="material-icons md-18">content_copy</span>
      </Tool>
      <Tool onClick={handleDelete}>
        <span className="material-icons md-24">delete</span>
      </Tool>
    </Tools>
  );
};

export default ObjectTools;
