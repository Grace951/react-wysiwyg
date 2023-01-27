import { createMachine, assign } from 'xstate';

import { updateObjDimensions, getDimensionDelta } from '../utils';
import { CanvasEvent, DrawObject } from '../typings';

import { CANVAS_STATE, CANVAS_EVENT } from '../constants';

interface CanvasContext {
  activeDrawObjectIdx: number;
  vertixIdx: number;
  drawObjects: DrawObject[];
}

export const canvasMachine = createMachine<CanvasContext, CanvasEvent>(
  {
    id: 'canvas',
    initial: CANVAS_STATE.normal,
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
  },
  {
    actions: {
      resizingObj: assign({
        drawObjects: (ctx, { delta }) =>
          updateObjDimensions(
            getDimensionDelta(delta || { dx: 0, dy: 0 }, ctx.vertixIdx),
            ctx.activeDrawObjectIdx,
            ctx.drawObjects
          ),
      }),
      movingObj: assign({
        drawObjects: (ctx, { delta }) =>
          updateObjDimensions(
            {
              x: delta?.dx || 0,
              y: delta?.dy || 0,
              width: 0,
              height: 0,
            },
            ctx.activeDrawObjectIdx,
            ctx.drawObjects
          ),
      }),
      clickDrawObj: assign({
        activeDrawObjectIdx: (ctx, event) => event.idx ?? -1,
      }),
      clickCanvas: assign({
        activeDrawObjectIdx: (ctx, event) => -1,
      }),
      mouseDownOnDrawObj: assign({
        activeDrawObjectIdx: (ctx, event) => event.idx ?? -1,
        vertixIdx: (ctx, event) => event.vertixIdx ?? -1,
      }),
      mouseDownFrameCtrlVertix: assign({
        vertixIdx: (ctx, event) => event.vertixIdx ?? -1,
      }),
      mouseUp: assign({
        vertixIdx: (ctx, event) => -1,
      }),
    },
  }
);
