import type { FC } from 'react';
import {
  CONTROL_VERTICES_CONFIG,
  DEF_FRAME_VERTEX_SIZE,
  ELEMENT_ROLE,
  ROTATE_IDX,
} from '../constants';
import { Vertix } from '../typings';

import styled from 'styled-components';

const Frame = styled.div`
  position: absolute;
  box-sizing: border-box;
`;

const FrameVertex = styled.div`
  background: white;
  position: absolute;
  box-sizing: border-box;
`;
const Rotate = styled.div`
  width: 100px;
  height: 2px;
  position: absolute;
  box-sizing: border-box;
  &:after {
    content: '';
    width: 12px;
    height: 12px;
    border: 2px solid #0038a9;
    display: block;
    background: white;
    border-radius: 50%;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: -5px;
    cursor: grabbing;
  }
`;

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  vertexSize: number;
  angle: number;
}

const ControlFrame: FC<Props> = ({
  width = 200,
  height = 200,
  x = 0,
  y = 0,
  angle = 0,
  vertexSize = DEF_FRAME_VERTEX_SIZE,
}) => {
  const vertices: Vertix[] = [
    {
      left: -vertexSize / 2,
      top: -vertexSize / 2,
    },
    {
      left: width / 2 - vertexSize / 2,
      top: -vertexSize / 2,
    },
    {
      left: width - vertexSize / 2,
      top: -vertexSize / 2,
    },
    {
      left: width - vertexSize / 2,
      top: height / 2 - vertexSize / 2,
    },
    {
      left: width - vertexSize / 2,
      top: height - vertexSize / 2,
    },
    {
      left: width / 2 - vertexSize / 2,
      top: height - vertexSize / 2,
    },
    {
      left: -vertexSize / 2,
      top: height - vertexSize / 2,
    },
    {
      left: -vertexSize / 2,
      top: height / 2 - vertexSize / 2,
    },
  ];

  vertices.forEach((vertix, idx) => {
    vertix.cursor = CONTROL_VERTICES_CONFIG[idx].cursor;
    vertix.desc = CONTROL_VERTICES_CONFIG[idx].desc;
  });

  return (
    <Frame
      style={{
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <Rotate
        data-role={ELEMENT_ROLE.controlFrameVertex}
        data-vertix-idx={ROTATE_IDX}
        style={{
          background: '#0038a9',
          left: vertices[2].left + vertexSize / 2,
          top: vertices[3].top + vertexSize / 2 - 1,
        }}
      />
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
    </Frame>
  );
};

export default ControlFrame;
