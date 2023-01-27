import type { FC, ReactEventHandler } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';

import { useMachine } from '@xstate/react';

import { EDITOR_EVENT } from '../constants';
import { EditorStateType } from '../typings';
import GlobalCSS from '../styles/global';
import { editorMachine } from './EditorMachine';
import Canvas from './Canvas';
import { widgets } from './Widgets';

const Container = styled.div`
  display: flex;
`;

const Widgets = styled.div`
  width: 40px;
  background-color: #efefef;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Widget = styled.div<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-bottom: 1px solid ${({ $active }) => ($active ? '#01a4b3' : '#0069cb')};
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? '#00c7d9' : '#0084ff')};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  width: number;
  height: number;
  x: number;
  y: number;
  drawObjectIdx: number;
  vertexSize: number;
}

const Editor: FC = () => {
  const [
    {
      context: { activeDrawObjectIdx, activeWidget, drawObjects },
      value: editorState,
    },
    send,
  ] = useMachine(editorMachine, {
    context: {
      drawObjects: [],
      activeWidget: null,
      activeDrawObjectIdx: -1,
      vertixIdx: -1,
    },
  });
  // console.log(activeDrawObjectIdx, activeWidget, drawObjects);

  const handleClickWidget = useCallback<ReactEventHandler<HTMLDivElement>>(
    (e) => {
      const widgedType = e.currentTarget.getAttribute('data-type');
      send({
        type: EDITOR_EVENT.selectWidget,
        activeWidget: widgedType === activeWidget ? null : widgedType,
      });
    },
    [send, activeWidget]
  );

  return (
    <Container>
      <GlobalCSS />
      <Widgets>
        {widgets.map(({ type, Comp }, idx) => (
          <Widget
            key={idx}
            data-type={type}
            $active={activeWidget === type}
            onClick={handleClickWidget}
          >
            <Comp />
          </Widget>
        ))}
      </Widgets>
      <Canvas
        activeDrawObjectIdx={activeDrawObjectIdx}
        drawObjects={drawObjects}
        editorState={editorState as EditorStateType}
        sendEvent={send}
      />
    </Container>
  );
};

export default Editor;
