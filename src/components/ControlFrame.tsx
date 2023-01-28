import type { FC } from 'react';
import {
  CONTROL_VERTICES_CONFIG,
  DEF_FRAME_VERTEX_SIZE,
  MAX_XINDEX_VALUE,
  ELEMENT_ROLE,
} from '../constants';
import { Vertix } from '../typings';

import styled from 'styled-components';

const FrameVertex = styled.div`
  background: transparent;
  position: absolute;
  z-index: ${MAX_XINDEX_VALUE};
  box-sizing: border-box;
`;

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  vertexSize: number;
}

const ControlFrame: FC<Props> = ({
  width = 200,
  height = 200,
  x = 0,
  y = 0,
  vertexSize = DEF_FRAME_VERTEX_SIZE,
}) => {
  const vertices: Vertix[] = [
    {
      left: x - vertexSize / 2,
      top: y - vertexSize / 2,
    },
    {
      left: x + width / 2 - vertexSize / 2,
      top: y - vertexSize / 2,
    },
    {
      left: x + width - vertexSize / 2,
      top: y - vertexSize / 2,
    },
    {
      left: x + width - vertexSize / 2,
      top: y + height / 2 - vertexSize / 2,
    },
    {
      left: x + width - vertexSize / 2,
      top: y + height - vertexSize / 2,
    },
    {
      left: x + width / 2 - vertexSize / 2,
      top: y + height - vertexSize / 2,
    },
    {
      left: x - vertexSize / 2,
      top: y + height - vertexSize / 2,
    },
    {
      left: x - vertexSize / 2,
      top: y + height / 2 - vertexSize / 2,
    },
  ];

  vertices.forEach((vertix, idx) => {
    vertix.cursor = CONTROL_VERTICES_CONFIG[idx].cursor;
    vertix.desc = CONTROL_VERTICES_CONFIG[idx].desc;
  });

  return (
    <>
      {vertices.map((vertex, idx) => (
        <FrameVertex
          key={idx}
          draggable="false"
          style={{
            border: '2px solid #0038a9',
            left: vertex.left,
            top: vertex.top,
            cursor: vertex.cursor,
            width: vertexSize,
            height: vertexSize,
          }}
          data-desc={vertex.desc}
          data-role={ELEMENT_ROLE.controlFrameVertex}
          data-vertix-idx={idx}
        />
      ))}
    </>
  );
};

export default ControlFrame;
