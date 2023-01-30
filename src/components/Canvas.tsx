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
import {
  block,
  getRangeOfMultipleObjs,
  getRangeOfMultipleRotatedObjs,
} from '../utils';
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
  selectedMultipleObjsFrame: Dimension | null;
  sendEvent: (e: CanvasEvent) => void;
}

const Canvas: FC<Props> = ({
  width = 800,
  height = 600,
  activeDrawObjectIdx = -1,
  drawObjects = [],
  selectedObjs = [],
  selectingFrame,
  selectedMultipleObjsFrame,
  editorState,
  sendEvent,
}) => {
  const selectedFrame = useMemo(() => {
    return selectedMultipleObjsFrame
      ? selectedMultipleObjsFrame
      : activeDrawObjectIdx !== -1
      ? drawObjects[activeDrawObjectIdx]
      : null;
  }, [selectedMultipleObjsFrame, drawObjects, activeDrawObjectIdx]);

  const { canvasRef, handleMouseUp, handleMouseDown, handleMouseMove } =
    useHandleUserEvents({
      sendEvent,
    });

  const deleteObj = useCallback(
    (idx: number) => {
      sendEvent({ type: CANVAS_EVENT.deleteObject, idx });
    },
    [sendEvent]
  );

  const copyObj = useCallback(
    (idx: number) => {
      sendEvent({ type: CANVAS_EVENT.copyObject, idx });
    },
    [sendEvent]
  );

  console.log(selectedFrame);
  return (
    <Container
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <BackGround draggable="false" data-role={ELEMENT_ROLE.background} />
      {selectedFrame && (
        <ControlFrame
          width={selectedFrame.width}
          height={selectedFrame.height}
          x={selectedFrame.x}
          y={selectedFrame.y}
          vertexSize={10}
          angle={selectedFrame.angle}
          activeDrawObjectIdx={activeDrawObjectIdx}
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
