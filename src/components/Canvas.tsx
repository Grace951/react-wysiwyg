import type { FC } from 'react';
import { useCallback, useMemo } from 'react';

import styled from 'styled-components';
import {
  EditorStateType,
  DrawObject,
  CanvasEvent,
  Dimension,
} from '../typings';
import useHandleUserEvents from '../hooks/useHandleUserEvents';
import { block } from '../utils';
import { ELEMENT_ROLE, CANVAS_EVENT, EDITOR_STATE } from '../constants';
import ControlFrame from './ControlFrame';
import SelectingFrame from './SelectingFrame';
import ObjectTools from './ObjectTools';

const Container = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 0 auto;
  background-color: white;
  position: relative;
`;

const DrawObjectElement = styled.div<{ $selected: boolean }>`
  position: absolute;
  border: 1px solid #ddd;
  background-color: ${({ $selected }) =>
    $selected ? 'rgba(0, 100, 255, 0.13)' : 'transparent'};
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
  selectedObjs: number[];
  activeDrawObjectIdx: number;
  editorState: EditorStateType;
  selectingFrame: Dimension;
  sendEvent: (e: CanvasEvent) => void;
}

const Canvas: FC<Props> = ({
  width = 800,
  height = 600,
  activeDrawObjectIdx = -1,
  drawObjects = [],
  selectedObjs = [],
  selectingFrame,
  editorState,
  sendEvent,
}) => {
  const activeDrawObject = useMemo(
    () => activeDrawObjectIdx >= 0 && drawObjects[activeDrawObjectIdx],
    [activeDrawObjectIdx, drawObjects]
  );

  const { canvasRef, handleMouseUp, handleMouseDown, handleMouseMove } =
    useHandleUserEvents({
      sendEvent,
    });

  const deleteObj = useCallback(
    (idx: number) => {
      sendEvent({ type: CANVAS_EVENT.deleteWidget, idx });
    },
    [sendEvent]
  );

  const copyObj = useCallback(
    (idx: number) => {
      sendEvent({ type: CANVAS_EVENT.copyWidget, idx });
    },
    [sendEvent]
  );

  return (
    <Container
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <BackGround data-role={ELEMENT_ROLE.background} />
      {activeDrawObject && (
        <ControlFrame
          width={activeDrawObject.width}
          height={activeDrawObject.height}
          x={activeDrawObject.x}
          y={activeDrawObject.y}
          vertexSize={10}
          angle={activeDrawObject.angle}
        />
      )}

      {editorState === EDITOR_STATE.selecting && (
        <SelectingFrame
          width={selectingFrame.width}
          height={selectingFrame.height}
          x={selectingFrame.x}
          y={selectingFrame.y}
        />
      )}

      {drawObjects?.map((drawObject, idx) => {
        const styles = {
          left: drawObject.x,
          top: drawObject.y,
          width: drawObject.width,
          height: drawObject.height,
          transform: '',
        };

        if (drawObject.angle) {
          styles.transform = `rotate(${drawObject.angle}deg)`;
        }
        return (
          <DrawObjectElement
            draggable="false"
            key={idx}
            data-active-obj-idx={idx}
            data-role={ELEMENT_ROLE.drawObject}
            data-widget-type={drawObject.widgetType}
            onClick={block}
            $selected={selectedObjs.includes(idx)}
            style={styles}
          >
            {idx === activeDrawObjectIdx && (
              <ObjectTools copyObj={copyObj} deleteObj={deleteObj} idx={idx} />
            )}
          </DrawObjectElement>
        );
      })}
    </Container>
  );
};

export default Canvas;
