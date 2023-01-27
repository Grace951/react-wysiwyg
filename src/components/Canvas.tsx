import type { FC, ReactEventHandler } from 'react';
import { useRef, useCallback } from 'react';

import { useMachine } from '@xstate/react';

import styled from 'styled-components';
import { DrawObject, CanvasStateType } from '../typings';
import useHandleUserEvents from '../hooks/useHandleUserEvents';
import { block } from '../utils';
import { ELEMENT_ROLE, CANVAS_EVENT } from '../constants';
import ControlFrame from './ControlFrame';
import { canvasMachine } from './CanvasMachine';

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

const BackGround = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
`;

interface Props {
  drawObjects: DrawObject[];
  width: number;
  height: number;
}

const Canvas: FC<Props> = ({ drawObjects = [], width = 500, height = 500 }) => {
  const [
    {
      context: { activeDrawObjectIdx, drawObjects: objs },
      value: convasState,
    },
    send,
  ] = useMachine(canvasMachine, {
    context: { drawObjects, activeDrawObjectIdx: -1, vertixIdx: -1 },
  });
  // console.log(convasState, activeDrawObjectIdx);
  const activeDrawObject =
    activeDrawObjectIdx >= 0 && objs[activeDrawObjectIdx];

  const canvasRef = useRef(null);

  const handleClickCanvas = useCallback<ReactEventHandler<HTMLDivElement>>(
    (e) => {
      send({ type: CANVAS_EVENT.clickCanvas });
    },
    [send]
  );

  const { handleMouseUp, handleMouseDown, handleMouseMove } =
    useHandleUserEvents({
      sendEvent: send,
      convasState: convasState as CanvasStateType,
    });

  return (
    <Container
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <BackGround onClick={handleClickCanvas} />
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
          draggable="false"
          key={drawObject.idx}
          data-active-obj-idx={drawObject.idx}
          data-role={ELEMENT_ROLE.drawObject}
          onClick={block}
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
