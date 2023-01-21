import type { FC } from 'react';
import { useRef, useState } from 'react';

import { enableMapSet } from 'immer';
import { DrawObject, Dimension } from '../typings';
import ControlFrame from './ControlFrame';
import useHandleUserEvents from '../hooks/useHandleUserEvents';
import { block, getElementRoleAndObjectIdxFromUserEvent } from '../utils';
import { CANVAS_STATE, ELEMENT_ROLE } from '../constants';

import styled from 'styled-components';

enableMapSet();
import produce from 'immer';

const Container = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 0 auto;
  background-color: white;
  position: relative;
`;

const Object = styled.div`
  position: absolute;
  border: 1px solid #ddd;
  cursor: move;
`;

interface Props {
  drawObjects: DrawObject[];
  width: number;
  height: number;
}

const Canvas: FC<Props> = ({ drawObjects = [], width = 500, height = 500 }) => {
  const canvasRef = useRef(null);
  const [canvasState, setCanvasState] = useState(CANVAS_STATE.normal);
  const [objs, setObjs] = useState<DrawObject[]>(drawObjects);
  const [activeDrawObjectIdx, setActiveDrawObjectIdx] = useState(-1);
  const activeDrawObject =
    activeDrawObjectIdx >= 0 && objs[activeDrawObjectIdx];

  const handleClickCanvas = () => {
    setActiveDrawObjectIdx(-1);
  };
  const handleObjClick = (e) => {
    block(e);
  };

  const updateObjDimensions = (delta: Dimension) => {
    if (activeDrawObjectIdx < 0) {
      return;
    }
    const nextState = produce(objs, (draftState) => {
      const obj = objs[activeDrawObjectIdx];
      draftState[activeDrawObjectIdx].x += delta.x ?? 0;
      draftState[activeDrawObjectIdx].y += delta.y ?? 0;
      draftState[activeDrawObjectIdx].width =
        obj.width + (delta.width ?? 0) > 0
          ? obj.width + (delta.width ?? 0)
          : delta.width;
      draftState[activeDrawObjectIdx].height =
        obj.height + (delta.height ?? 0) > 0
          ? obj.height + (delta.height ?? 0)
          : delta.height;
    });

    setObjs(nextState);
  };

  const { handleMouseUp, handleMouseDown, handleMouseMove } =
    useHandleUserEvents({
      canvasState,
      setActiveDrawObjectIdx,
      setCanvasState,
      update: updateObjDimensions,
    });

  return (
    <Container
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClickCanvas}
    >
      {activeDrawObject && (
        <ControlFrame
          width={activeDrawObject.width}
          height={activeDrawObject.height}
          x={activeDrawObject.x}
          y={activeDrawObject.y}
          drawObjectIdx={activeDrawObjectIdx}
          vertexSize={10}
        />
      )}

      {objs.map((drawObject) => (
        <Object
          key={drawObject.idx}
          data-active-obj-idx={drawObject.idx}
          data-role={ELEMENT_ROLE.drawObject}
          onClick={handleObjClick}
          style={{
            left: drawObject.x,
            top: drawObject.y,
            width: drawObject.width,
            height: drawObject.height,
          }}
        />
      ))}
    </Container>
  );
};

export default Canvas;
