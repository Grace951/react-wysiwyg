import { createMachine, assign } from 'xstate';

import { updateObjDimensions, getDimensionDelta } from '../utils';
import { CanvasEvent, EditorEvent, DrawObject, WidgetType } from '../typings';

import {
  EDITOR_STATE,
  CANVAS_EVENT,
  EDITOR_EVENT,
  WIDGET_TYPE,
} from '../constants';

interface EditorContext {
  activeDrawObjectIdx: number;
  vertixIdx: number;
  drawObjects: DrawObject[];
  activeWidget: WidgetType | null;
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
          [CANVAS_EVENT.mouseDownOnCanvas]: {
            actions: 'addDrawObj',
            target: EDITOR_STATE.adding,
            cond: 'addDrawObjCondition',
          },
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
            actions: 'mouseUp',
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
      addDrawObjCondition: ({ activeWidget }, event) => {
        return activeWidget !== null;
      },
    },
    actions: {
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
        ) =>
          updateObjDimensions(
            getDimensionDelta(delta || { dx: 0, dy: 0 }, 4),
            activeDrawObjectIdx,
            drawObjects
          ),
      }),
      mouseUpWhenAdding: assign({
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
        ) =>
          updateObjDimensions(
            getDimensionDelta(delta || { dx: 0, dy: 0 }, vertixIdx),
            activeDrawObjectIdx,
            drawObjects
          ),
      }),
      movingObj: assign({
        drawObjects: (
          { drawObjects, activeDrawObjectIdx },
          { delta }: CanvasEvent
        ) =>
          updateObjDimensions(
            {
              x: delta?.dx || 0,
              y: delta?.dy || 0,
              width: 0,
              height: 0,
            },
            activeDrawObjectIdx,
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
        activeWidget: (ctx, event: CanvasEvent) => event.widgetType ?? null,
        activeDrawObjectIdx: (ctx, event: CanvasEvent) => event.idx ?? -1,
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      mouseDownFrameCtrlVertix: assign({
        vertixIdx: (ctx, event: CanvasEvent) => event.vertixIdx ?? -1,
      }),
      mouseUp: assign({
        vertixIdx: (ctx, event: CanvasEvent) => -1,
      }),
      selectWidget: assign({
        activeWidget: (ctx, event: EditorEvent) => event.activeWidget ?? null,
      }),
    },
  }
);
