import type { FC, ReactEventHandler } from 'react';
import { useRef, useCallback, useMemo } from 'react';

import styled from 'styled-components';
import { EditorStateType, DrawObject, CanvasEvent } from '../typings';
import useHandleUserEvents from '../hooks/useHandleUserEvents';
import { block } from '../utils';
import { ELEMENT_ROLE, CANVAS_EVENT } from '../constants';
import ControlFrame from './ControlFrame';

const Container = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 0 auto;
  background-color: white;
  position: relative;
`;

const DrawObjectElement = styled.div`
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
  width?: number;
  height?: number;
  drawObjects: DrawObject[];
  activeDrawObjectIdx: number;
  editorState: EditorStateType;
  sendEvent: (e: CanvasEvent) => void;
}

const Canvas: FC<Props> = ({
  width = 800,
  height = 600,
  activeDrawObjectIdx = -1,
  drawObjects = [],
  editorState,
  sendEvent,
}) => {
  const activeDrawObject = useMemo(
    () => activeDrawObjectIdx >= 0 && drawObjects[activeDrawObjectIdx],
    [activeDrawObjectIdx, drawObjects]
  );

  const handleClickCanvas = useCallback<ReactEventHandler<HTMLDivElement>>(
    (e) => {
      sendEvent({ type: CANVAS_EVENT.clickCanvas });
    },
    [sendEvent]
  );

  const { canvasRef, handleMouseUp, handleMouseDown, handleMouseMove } =
    useHandleUserEvents({
      sendEvent,
      editorState,
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
      <BackGround
        onClick={handleClickCanvas}
        data-role={ELEMENT_ROLE.background}
      />
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

      {drawObjects?.map((drawObject, idx) => (
        <DrawObjectElement
          draggable="false"
          key={idx}
          data-active-obj-idx={idx}
          data-role={ELEMENT_ROLE.drawObject}
          data-widget-type={drawObject.widgetType}
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
