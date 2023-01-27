import { createMachine, assign } from 'xstate';

import {
  updateObjsDimensions,
  getDimensionDelta,
  isInTheFrame,
} from '../utils';
import {
  CanvasEvent,
  EditorEvent,
  DrawObject,
  WidgetType,
  Dimension,
} from '../typings';

import {
  EDITOR_STATE,
  CANVAS_EVENT,
  EDITOR_EVENT,
  WIDGET_TYPE,
} from '../constants';

interface EditorContext {
  activeDrawObjectIdx: number;
  selectedObjs: number[];
  vertixIdx: number;
  drawObjects: DrawObject[];
  activeWidget: WidgetType | null;
  selectingFrame: Dimension;
}

export const editorMachine = createMachine<
  EditorContext,
  CanvasEvent | EditorEvent
>(
  {
    id: 'canvas',
    initial: EDITOR_STATE.normal,
    predictableActionArguments: true,
    states: {
      [EDITOR_STATE.normal]: {
        on: {
          [CANVAS_EVENT.clickCanvas]: {
            actions: 'clickCanvas',
          },
          [CANVAS_EVENT.clickDrawObj]: {
            actions: 'clickDrawObj',
          },
          [CANVAS_EVENT.mouseDownOnCtrlFrameVertix]: {
            actions: 'mouseDownFrameCtrlVertix',
            target: EDITOR_STATE.resizing,
          },
          [CANVAS_EVENT.mouseDownOnDrawObj]: {
            actions: 'mouseDownOnDrawObj',
            target: EDITOR_STATE.moving,
          },
          [CANVAS_EVENT.mouseDownOnCanvas]: [
            {
              actions: 'removeSelectedObj',
              target: EDITOR_STATE.normal,
              cond: 'shouldRemoveSelectedObj',
            },
            {
              actions: 'addDrawObj',
              target: EDITOR_STATE.adding,
              cond: 'addDrawObjCondition',
            },
            {
              actions: 'startToSelect',
              target: EDITOR_STATE.selecting,
              cond: 'selectingCondition',
            },
          ],
          [EDITOR_EVENT.selectWidget]: {
            actions: 'selectWidget',
          },
          [CANVAS_EVENT.disable]: EDITOR_STATE.disable,
        },
      },
      [EDITOR_STATE.adding]: {
        on: {
          [CANVAS_EVENT.mouseUp]: {
            target: EDITOR_STATE.normal,
            actions: 'mouseUpWhenAdding',
          },
          [CANVAS_EVENT.mouseMoving]: {
            actions: 'addingObj',
          },
        },
      },
      [EDITOR_STATE.resizing]: {
        on: {
          [CANVAS_EVENT.mouseUp]: {
            target: EDITOR_STATE.normal,
            actions: 'mouseUp',
          },
          [CANVAS_EVENT.mouseMoving]: {
            actions: 'resizingObj',
          },
        },
      },
      [EDITOR_STATE.selecting]: {
        on: {
          [CANVAS_EVENT.mouseUp]: {
            target: EDITOR_STATE.normal,
            actions: 'mouseUpWhenSelecting',
          },
          [CANVAS_EVENT.mouseMoving]: {
            actions: 'selectingObjs',
          },
        },
      },
      [EDITOR_STATE.moving]: {
        on: {
          [CANVAS_EVENT.mouseUp]: {
            target: EDITOR_STATE.normal,
            actions: 'mouseUp',
          },
          [CANVAS_EVENT.mouseMoving]: {
            actions: 'movingObj',
          },
        },
      },
      [EDITOR_STATE.disable]: {
        on: {
          [CANVAS_EVENT.enable]: EDITOR_STATE.normal,
        },
      },
    },
  },
  {
    guards: {
      addDrawObjCondition: ({ activeWidget, activeDrawObjectIdx }, event) => {
        return activeWidget !== null && activeDrawObjectIdx === -1;
      },
      selectingCondition: ({ activeWidget }, event) => {
        return activeWidget === null;
      },
      shouldRemoveSelectedObj: (
        { selectedObjs, activeDrawObjectIdx },
        event
      ) => {
        return selectedObjs?.length > 0 || activeDrawObjectIdx !== -1;
      },
    },
    actions: {
      startToSelect: assign({
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
        activeWidget: (ctx, event: CanvasEvent) => null,
        selectingFrame: (ctx, { point }: CanvasEvent) => ({
          x: point?.x ?? 0,
          y: point?.y ?? 0,
          width: 0,
          height: 0,
        }),
      }),
      selectingObjs: assign({
        selectingFrame: ({ selectingFrame }, { delta }: CanvasEvent) => ({
          x: selectingFrame?.x ?? 0,
          y: selectingFrame?.y ?? 0,
          width: (selectingFrame?.width ?? 0) + (delta?.dx ?? 0),
          height: (selectingFrame?.height ?? 0) + (delta?.dy ?? 0),
        }),
        selectedObjs: (
          { drawObjects, selectingFrame },
          { delta }: CanvasEvent
        ) => {
          return drawObjects.reduce<number[]>(
            (acc, cur, idx) =>
              isInTheFrame(selectingFrame, cur) ? [...acc, idx] : acc,
            []
          );
        },
      }),
      mouseUpWhenSelecting: assign({
        activeDrawObjectIdx: ({ selectedObjs }, event: CanvasEvent) => {
          return selectedObjs.length === 1 ? selectedObjs[0] : -1;
        },
        activeWidget: ({ drawObjects, selectedObjs }, event: CanvasEvent) =>
          selectedObjs.length === 1
            ? drawObjects[selectedObjs[0]].widgetType
            : null,
      }),
      addDrawObj: assign({
        activeDrawObjectIdx: ({ drawObjects }, event: CanvasEvent) =>
          drawObjects.length,
        drawObjects: (
          { drawObjects, activeWidget },
          { point }: CanvasEvent
        ) => {
          const idx = drawObjects.filter(
            (item) => item.widgetType === activeWidget
          ).length;
          return [
            ...drawObjects,
            {
              x: point?.x ?? 0,
              y: point?.y ?? 0,
              width: 0,
              height: 0,
              widgetType: activeWidget || WIDGET_TYPE.image,
              layerIdx: 0,
              name: `${activeWidget || WIDGET_TYPE.image} ${idx}`,
            },
          ];
        },
      }),
      addingObj: assign({
        drawObjects: (
          { drawObjects, activeDrawObjectIdx },
          { delta }: CanvasEvent
        ) => {
          return updateObjsDimensions(
            getDimensionDelta(delta || { dx: 0, dy: 0 }, 4),
            [activeDrawObjectIdx],
            drawObjects
          );
        },
      }),
      mouseUpWhenAdding: assign({
        activeWidget: (
          { drawObjects, activeDrawObjectIdx, activeWidget },
          event: CanvasEvent
        ) => {
          const obj = drawObjects[activeDrawObjectIdx];
          return obj.width < 3 && obj.height < 3 ? null : activeWidget;
        },
        drawObjects: ({ drawObjects, activeDrawObjectIdx }) => {
          const obj = drawObjects[activeDrawObjectIdx];
          return obj.width < 3 && obj.height < 3
            ? drawObjects.slice(0, drawObjects.length - 1)
            : drawObjects;
        },
      }),
      resizingObj: assign({
        drawObjects: (
          { drawObjects, vertixIdx, activeDrawObjectIdx },
          { delta }: CanvasEvent
        ) => {
          return updateObjsDimensions(
            getDimensionDelta(delta || { dx: 0, dy: 0 }, vertixIdx),
            [activeDrawObjectIdx],
            drawObjects
          );
        },
      }),
      movingObj: assign({
        drawObjects: (
          { drawObjects, selectedObjs, activeDrawObjectIdx },
          { delta }: CanvasEvent
        ) =>
          updateObjsDimensions(
            {
              x: delta?.dx || 0,
              y: delta?.dy || 0,
              width: 0,
              height: 0,
            },
            selectedObjs.length > 0 ? selectedObjs : [activeDrawObjectIdx],
            drawObjects
          ),
      }),
      clickDrawObj: assign({
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      clickCanvas: assign({
        activeWidget: (ctx, event: CanvasEvent) => null,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
      }),
      mouseDownOnDrawObj: assign({
        activeWidget: ({ selectedObjs }, { widgetType }: CanvasEvent) =>
          selectedObjs.length > 0 ? null : widgetType ?? null,
        activeDrawObjectIdx: ({ selectedObjs }, { idx }: CanvasEvent) =>
          selectedObjs.length > 0 ? -1 : idx ?? -1,
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      removeSelectedObj: assign({
        activeWidget: (ctx, event: CanvasEvent) => event.widgetType ?? null,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => event.idx ?? -1,
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
      }),
      mouseDownFrameCtrlVertix: assign({
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      mouseUp: assign({
        vertixIdx: (ctx, event: CanvasEvent) => -1,
      }),
      selectWidget: assign({
        activeWidget: (ctx, event: EditorEvent) => event.activeWidget ?? null,
        vertixIdx: (ctx, event: CanvasEvent) => -1,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
      }),
    },
  }
);
