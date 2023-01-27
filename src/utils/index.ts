import { Point, Dimension, DrawObject, PointDelta } from '../typings';
import * as R from 'ramda';

export function block(e) {
  e.stopPropagation();
  e.nativeEvent?.stopImmediatePropagation?.();
}

export function getUserEventPosition(e, elm: HTMLElement | null): Point {
  const isTouch = e.type.indexOf('touch') !== -1;
  const touch = e?.touches?.[0] || e?.changedTouches?.[0];
  const x = isTouch ? touch.pageX : e.pageX;
  const y = isTouch ? touch.pageY : e.pageY;
  return { x: x - (elm?.offsetLeft ?? 0), y: y - (elm?.offsetTop ?? 0) };
}

export function getElementRoleAndObjectIdxFromUserEvent(e) {
  const roleAttrName = 'data-role';
  const activeIdxAttrName = 'data-active-obj-idx';
  const vertixIdxAttrName = 'data-vertix-idx';
  const widgetTypeAttrName = 'data-widget-type';
  let widgetType =
    e.currentTarget?.getAttribute(widgetTypeAttrName) ||
    e.target?.getAttribute(widgetTypeAttrName);

  let idx =
    e.currentTarget?.getAttribute(activeIdxAttrName) ||
    e.target?.getAttribute(activeIdxAttrName);

  let vertixIdx =
    e.currentTarget?.getAttribute(vertixIdxAttrName) ||
    e.target?.getAttribute(vertixIdxAttrName);

  let role =
    e.currentTarget?.getAttribute(roleAttrName) ||
    e.target?.getAttribute(roleAttrName);

  const elements = e.target.querySelectorAll(`[${roleAttrName}]`);
  if (elements?.[0]) {
    role = elements[0].getAttribute(roleAttrName);
  }

  const objElements = e.target.querySelectorAll(`[${activeIdxAttrName}]`);
  if (elements?.[0]) {
    idx = objElements[0].getAttribute(activeIdxAttrName);
  }
  return {
    role,
    widgetType,
    idx: !!idx ? parseInt(idx) : idx,
    vertixIdx: !!vertixIdx ? parseInt(vertixIdx) : vertixIdx,
  };
}

export const getDimensionDelta = (delta: PointDelta, vertixIdx: number) => {
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;

  switch (vertixIdx) {
    case 3:
      width = delta?.dx || 0;
      break;
    case 4:
      width = delta?.dx || 0;
      height = delta?.dy || 0;
      break;
    case 5:
      height = delta?.dy || 0;
      break;
    case 0:
      x = delta?.dx || 0;
      y = delta?.dy || 0;
      width = -delta?.dx || 0;
      height = -delta?.dy || 0;
      break;
    case 1:
      y = delta?.dy || 0;
      height = -delta?.dy || 0;
      break;
    case 7:
      x = delta?.dx || 0;
      width = -delta?.dx || 0;
      break;
    case 2:
      y = delta?.dy || 0;
      width = delta?.dx || 0;
      height = -delta?.dy || 0;
      break;
    case 6:
      x = delta?.dx || 0;
      width = -delta?.dx || 0;
      height = delta?.dy || 0;
      break;
  }
  return { x, y, width, height };
};

export const calculateObjDimensions = (delta: Dimension, obj: DrawObject) => {
  const x = obj.x + delta.x ?? 0;
  const y = obj.y + delta.y ?? 0;
  const width =
    obj.width + (delta.width ?? 0) > 0
      ? obj.width + (delta.width ?? 0)
      : delta.width;
  const height =
    obj.height + (delta.height ?? 0) > 0
      ? obj.height + (delta.height ?? 0)
      : delta.height;
  return { ...obj, x, y, width, height };
};

export const updateObjDimensions = (
  delta: Dimension,
  activeDrawObjectIdx: number,
  objs: DrawObject[]
) => {
  if (activeDrawObjectIdx < 0) {
    return [];
  }

  const nextState = R.assocPath(
    [activeDrawObjectIdx],
    calculateObjDimensions(delta, objs[activeDrawObjectIdx]),
    objs
  );
  return nextState;
};
