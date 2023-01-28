import { createMachine, assign } from 'xstate';

import * as R from 'ramda';

import {
  updateObjsDimensions,
  getDimensionDelta,
  getDimensionDeltaForResize,
  isInTheFrame,
  getAngle,
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
          [CANVAS_EVENT.deleteObject]: {
            actions: 'deleteObject',
          },
          [CANVAS_EVENT.copyObject]: {
            actions: 'copyObject',
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
        return (
          activeWidget !== null &&
          activeWidget !== WIDGET_TYPE.selectorTool &&
          activeDrawObjectIdx === -1
        );
      },
      selectingCondition: ({ activeWidget }, event) => {
        return activeWidget === WIDGET_TYPE.selectorTool;
      },
    },
    actions: {
      startToSelect: assign({
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
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
        activeWidget: (
          { drawObjects, activeWidget, selectedObjs },
          event: CanvasEvent
        ) => WIDGET_TYPE.selectorTool,
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
        activeWidget: (ctx, event: CanvasEvent) => WIDGET_TYPE.selectorTool,
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
          { delta, point }: CanvasEvent
        ) => {
          const obj = drawObjects[activeDrawObjectIdx];

          if (vertixIdx === 8) {
            return R.update(
              activeDrawObjectIdx,
              {
                ...obj,
                angle: getAngle(
                  { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 },
                  {
                    x: point?.x ?? 0,
                    y: point?.y ?? 0,
                  }
                ),
              },
              drawObjects
            );
          }

          return updateObjsDimensions(
            getDimensionDeltaForResize(delta || { dx: 0, dy: 0 }, vertixIdx),
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
        activeWidget: (ctx, event: CanvasEvent) => WIDGET_TYPE.selectorTool,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
      }),
      mouseDownOnDrawObj: assign({
        activeDrawObjectIdx: ({ selectedObjs }, { idx }: CanvasEvent) =>
          selectedObjs.length > 0 ? -1 : idx ?? -1,
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      removeSelectedObj: assign({
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => event.idx ?? -1,
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
      }),
      mouseDownFrameCtrlVertix: assign({
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      mouseUp: assign({
        vertixIdx: (ctx, event: CanvasEvent) => -1,
        activeWidget: (ctx, event: CanvasEvent) => WIDGET_TYPE.selectorTool,
      }),
      selectWidget: assign({
        activeWidget: (ctx, event: EditorEvent) => event.activeWidget ?? null,
        vertixIdx: (ctx, event: CanvasEvent) => -1,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
      }),
      deleteObject: assign({
        vertixIdx: (ctx, event: CanvasEvent) => -1,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => -1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
        drawObjects: ({ drawObjects }, { idx }: CanvasEvent) => {
          if (idx === undefined || idx > drawObjects.length || idx < 0) {
            return drawObjects;
          }
          return R.remove(idx, 1, drawObjects);
        },
      }),
      copyObject: assign({
        vertixIdx: (ctx, event: CanvasEvent) => -1,
        activeDrawObjectIdx: (ctx, { idx }: CanvasEvent) => (idx ?? 0) + 1,
        selectedObjs: (ctx, event: CanvasEvent) => [],
        drawObjects: ({ drawObjects }, { idx }: CanvasEvent) => {
          if (idx === undefined || idx >= drawObjects.length || idx < 0) {
            return drawObjects;
          }
          const obj = drawObjects[idx];
          return R.insert(
            idx + 1,
            {
              ...obj,
              x: obj.x + 20,
              y: obj.y + 20,
              name: obj.name + ' copy',
            },
            drawObjects
          );
        },
      }),
    },
  }
);
