import type { FC, ReactEventHandler } from 'react';
import { useRef, useState, useCallback } from 'react';

import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import { DrawObject, CanvasEvent, CanvasStateType } from '../typings';
import ControlFrame from './ControlFrame';
import useHandleUserEvents from '../hooks/useHandleUserEvents';
import {
  block,
  updateObjDimensions,
  getDimensionDelta,
  getElementRoleAndObjectIdxFromUserEvent,
} from '../utils';
import { CANVAS_STATE, ELEMENT_ROLE, CANVAS_EVENT } from '../constants';

import styled from 'styled-components';
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
interface CanvasContext {
  activeDrawObjectIdx: number;
  vertixIdx: number;
}

const canvasMachine = createMachine<CanvasContext, CanvasEvent>({
  id: 'canvas',
  initial: CANVAS_STATE.normal,
  context: {
    activeDrawObjectIdx: -1,
    vertixIdx: -1,
  },
  states: {
    [CANVAS_STATE.normal]: {
      on: {
        [CANVAS_EVENT.clickCanvas]: {
          actions: 'clickCanvas',
        },
        [CANVAS_EVENT.clickDrawObj]: {
          actions: 'clickDrawObj',
        },
        [CANVAS_EVENT.mouseDownOnCtrlFrameVertix]: {
          actions: 'mouseDownFrameCtrlVertix',
          target: CANVAS_STATE.resizing,
        },
        [CANVAS_EVENT.mouseDownOnDrawObj]: {
          actions: 'mouseDownOnDrawObj',
          target: CANVAS_STATE.moving,
        },
        [CANVAS_EVENT.disable]: CANVAS_STATE.disable,
      },
    },
    [CANVAS_STATE.adding]: {
      on: {
        [CANVAS_EVENT.mouseUp]: {
          target: CANVAS_STATE.normal,
          actions: 'mouseUp',
        },
        [CANVAS_EVENT.mouseMoving]: {
          actions: 'addingObj',
        },
      },
    },
    [CANVAS_STATE.resizing]: {
      on: {
        [CANVAS_EVENT.mouseUp]: {
          target: CANVAS_STATE.normal,
          actions: 'mouseUp',
        },
        [CANVAS_EVENT.mouseMoving]: {
          actions: 'resizingObj',
        },
      },
    },
    [CANVAS_STATE.selecting]: {
      on: {
        [CANVAS_EVENT.mouseUp]: {
          target: CANVAS_STATE.normal,
          actions: 'mouseUp',
        },
        [CANVAS_EVENT.mouseMoving]: {
          actions: 'selectingObjs',
        },
      },
    },
    [CANVAS_STATE.moving]: {
      on: {
        [CANVAS_EVENT.mouseUp]: {
          target: CANVAS_STATE.normal,
          actions: 'mouseUp',
        },
        [CANVAS_EVENT.mouseMoving]: {
          actions: 'movingObj',
        },
      },
    },
    [CANVAS_STATE.disable]: {
      on: {
        [CANVAS_EVENT.enable]: CANVAS_STATE.normal,
      },
    },
  },
});

const Canvas: FC<Props> = ({ drawObjects = [], width = 500, height = 500 }) => {
  const [objs, setObjs] = useState<DrawObject[]>(drawObjects);

  const [
    {
      context: { activeDrawObjectIdx },
      value: convasState,
    },
    send,
  ] = useMachine(canvasMachine, {
    actions: {
      resizingObj: (context, event) => {
        const { delta } = event;
        updateObjDimensions(
          getDimensionDelta(delta || { dx: 0, dy: 0 }, context.vertixIdx),
          context.activeDrawObjectIdx,
          setObjs
        );
      },
      movingObj: (context, event) => {
        const { delta } = event;
        updateObjDimensions(
          {
            x: delta?.dx || 0,
            y: delta?.dy || 0,
            width: 0,
            height: 0,
          },
          context.activeDrawObjectIdx,
          setObjs
        );
      },
      clickDrawObj: assign({
        activeDrawObjectIdx: (ctx, event, { action, state }) => event.idx ?? -1,
      }),
      clickCanvas: assign({
        activeDrawObjectIdx: (ctx, event, { action, state }) => -1,
      }),
      mouseDownOnDrawObj: assign({
        activeDrawObjectIdx: (ctx, event, { action, state }) => event.idx ?? -1,
        vertixIdx: (ctx, event, { action, state }) => event.vertixIdx ?? -1,
      }),
      mouseDownFrameCtrlVertix: assign({
        vertixIdx: (ctx, event, { action, state }) => event.vertixIdx ?? -1,
      }),
      mouseUp: assign({
        vertixIdx: (ctx, event, { action, state }) => -1,
      }),
    },
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

  const handleObjClick = useCallback<ReactEventHandler<HTMLDivElement>>(
    (e) => {
      block(e);
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
