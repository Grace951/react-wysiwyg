import type { MouseEvent } from 'react';
import { Point, Dimension, DrawObject, PointDelta, Frame } from '../typings';
import * as R from 'ramda';

export const block = (e: MouseEvent<HTMLElement>) => {
  e.stopPropagation();
  e.nativeEvent?.stopImmediatePropagation?.();
};

export const getUserEventPosition = (
  e: MouseEvent<HTMLElement>,
  elm: HTMLElement | null
): Point => {
  const isTouch = e.type.indexOf('touch') !== -1;
  const touch =
    e instanceof TouchEvent ? e.touches?.[0] || e.changedTouches?.[0] : null;
  const x = e instanceof TouchEvent ? touch?.pageX ?? 0 : e.pageX;
  const y = e instanceof TouchEvent ? touch?.pageY ?? 0 : e.pageY;
  return { x: x - (elm?.offsetLeft ?? 0), y: y - (elm?.offsetTop ?? 0) };
};

export const getElementRoleAndObjectIdxFromUserEvent = ({
  currentTarget,
  target,
}: MouseEvent<HTMLElement>) => {
  const roleAttrName = 'data-role';
  const objIdxAttrName = 'data-obj-idx';
  const vertixIdxAttrName = 'data-vertix-idx';
  const widgetTypeAttrName = 'data-widget-type';

  let widgetType =
    currentTarget.getAttribute(widgetTypeAttrName) ??
    (target instanceof HTMLElement
      ? target.getAttribute(widgetTypeAttrName)
      : null);

  let idx =
    currentTarget.getAttribute(objIdxAttrName) ??
    (target instanceof HTMLElement
      ? target.getAttribute(objIdxAttrName)
      : null);

  let vertixIdx =
    currentTarget.getAttribute(vertixIdxAttrName) ??
    (target instanceof HTMLElement
      ? target.getAttribute(vertixIdxAttrName)
      : null);

  let role =
    currentTarget.getAttribute(roleAttrName) ??
    (target instanceof HTMLElement ? target.getAttribute(roleAttrName) : null);

  if (target instanceof HTMLElement) {
    const elements = target.querySelectorAll(`[${roleAttrName}]`);
    if (!role && elements?.[0]) {
      role = elements[0].getAttribute(roleAttrName);
    }
    const objElements = target.querySelectorAll(`[${objIdxAttrName}]`);
    if ((idx === '' || idx === undefined) && objElements?.[0]) {
      idx = objElements[0].getAttribute(objIdxAttrName);
    }
  }

  return {
    role,
    widgetType,
    idx: R.isNil(idx) ? idx : parseInt(idx),
    vertixIdx: R.isNil(vertixIdx) ? vertixIdx : parseInt(vertixIdx),
  };
};

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
  return { x, y, width, height, angle: 0 };
};

export const getDimensionDeltaForResize = ({
  delta,
  vertixIdx,
  obj: { x, y, width, height },
  selectedFrame,
}: {
  delta: PointDelta;
  obj: DrawObject;
  vertixIdx: number;
  selectedFrame: Dimension;
}) => {
  const dx = delta.dx;
  const dy = delta.dy;
  let ratioX = (selectedFrame.width + dx) / selectedFrame.width;
  let ratioY = (selectedFrame.height + dy) / selectedFrame.height;
  let offsetX = 0,
    offsetY = 0,
    nX = x,
    nY = y,
    nW = width,
    nH = height;

  switch (vertixIdx) {
    case 0:
      ratioX = (selectedFrame.width - dx) / selectedFrame.width;
      ratioY = ratioX;
      offsetX = dx;
      offsetY = offsetX;
      nW = width * ratioX;
      nH = height * ratioY;
      nY =
        selectedFrame.y +
        selectedFrame.height -
        (selectedFrame.y + selectedFrame.height - y) * ratioY;
      nX =
        selectedFrame.x +
        selectedFrame.width -
        (selectedFrame.x + selectedFrame.width - x) * ratioX;
      break;
    case 1:
      offsetY = dy;
      ratioY = (selectedFrame.height - dy) / selectedFrame.height;
      ratioX = 1;
      nW = width * ratioX;
      nH = height * ratioY;
      nX = x;
      nY =
        selectedFrame.y +
        selectedFrame.height -
        (selectedFrame.y + selectedFrame.height - y) * ratioY;
      break;
    case 2:
      offsetY = dy;
      ratioY = ratioX;
      nW = width * ratioX;
      nH = height * ratioY;
      nX = x;
      nY =
        selectedFrame.y +
        selectedFrame.height -
        (selectedFrame.y + selectedFrame.height - y) * ratioY;
      break;
    case 3:
      ratioY = 1;
      nW = width * ratioX;
      nH = height * ratioY;
      nX = x;
      nY = y;
      break;
    case 4:
      ratioY = ratioX;
      nW = width * ratioX;
      nH = height * ratioY;
      nX = (x - selectedFrame.x + offsetX) * ratioX + selectedFrame.x;
      nY = (y - selectedFrame.y + offsetY) * ratioY + selectedFrame.y;
      break;
    case 5:
      ratioX = 1;
      nW = width * ratioX;
      nH = height * ratioY;
      nX = x;
      nY = (y - selectedFrame.y + offsetY) * ratioY + selectedFrame.y;
      break;
    case 6:
      ratioX = (selectedFrame.width - dx) / selectedFrame.width;
      ratioY = ratioX;
      offsetX = dx;
      nW = width * ratioX;
      nH = height * ratioY;
      nX =
        selectedFrame.x +
        selectedFrame.width -
        (selectedFrame.x + selectedFrame.width - x) * ratioX;
      nY = (y - selectedFrame.y + offsetY) * ratioY + selectedFrame.y;
      break;
    case 7:
      ratioX = (selectedFrame.width - dx) / selectedFrame.width;
      ratioY = 1;
      nW = width * ratioX;
      nH = height * ratioY;
      nX =
        selectedFrame.x +
        selectedFrame.width -
        (selectedFrame.x + selectedFrame.width - x) * ratioX;
      nY = y;
      break;
  }

  return { x: nX, y: nY, width: nW, height: nH };
};

export const calculateObjDimension = (delta: Dimension, obj: Dimension) => {
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
    calculateObjDimension(delta, objs[activeDrawObjectIdx]),
    objs
  );
  return nextState;
};

export const updateObjsDimensions = (
  delta: Dimension,
  selectedObjs: number[],
  objs: DrawObject[]
) => {
  if (selectedObjs.length <= 0) {
    return objs;
  }

  const nextState = selectedObjs.reduce((acc, cur) => {
    return R.assocPath([cur], calculateObjDimension(delta, objs[cur]), acc);
  }, objs);

  return nextState;
};

export const dimensionToRect = (dimension: Dimension) => ({
  left: dimension.x,
  right: dimension.x + dimension.width,
  top: dimension.y,
  bottom: dimension.x + dimension.height,
});

export const getIntersectionOfTwoRect = (r1: Dimension, r2: Dimension) => {
  const x = Math.max(r1.x, r2.x);
  const y = Math.max(r1.y, r2.y);
  const xx = Math.min(r1.x + r1.width, r2.x + r2.width);
  const yy = Math.min(r1.y + r1.height, r2.y + r2.height);
  return { x, y, width: xx - x, height: yy - y };
};

export const isPointInsideRect = (point: Point, rect: Dimension) =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

export const mergeTwoRect = (r1: Dimension, r2: Dimension) => {
  return {
    x: Math.min(r1.x, r2.x),
    y: Math.min(r1.y, r2.y),
    width: Math.max(r1.width, r2.width),
    height: Math.max(r1.height, r2.height),
  };
};

export const getRotatedPoint = (
  angle: number,
  { x, y }: Point,
  { x: cx, y: cy }: Point
) => {
  const nX = (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx;
  const nY = (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy;
  return { x: nX, y: nY };
};

export const getRotatedPointsFromObj = (obj: Frame) => {
  const angle = (obj.angle * Math.PI) / 180;
  const centerPoint = { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
  return [
    { x: obj.x, y: obj.y },
    { x: obj.x + obj.width, y: obj.y },
    { x: obj.x, y: obj.y + obj.height },
    { x: obj.x + obj.width, y: obj.y + obj.height },
  ].map((point) => getRotatedPoint(angle, point, centerPoint));
};

export const isInTheFrame = (frame: Frame, obj: Frame) => {
  const framePoly: Point[] = [
    { x: frame.x, y: frame.y },
    { x: frame.x + frame.width, y: frame.y },
    { x: frame.x, y: frame.y + frame.height },
    { x: frame.x + frame.width, y: frame.y + frame.height },
  ];

  const objPoints = getRotatedPointsFromObj(obj);
  const centerPoint = { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
  const angle = (-obj.angle * Math.PI) / 180;
  const framePoints = framePoly.map((point) =>
    getRotatedPoint(angle, point, centerPoint)
  );

  return (
    objPoints.some((point) => isPointInsideRect(point, frame)) ||
    framePoints.some((point) => isPointInsideRect(point, obj))
  );
};

export const getAngle = (p1: Point, p2: Point) => {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
};

export const getRotatedDimension = (obj: DrawObject) => {
  const points = getRotatedPointsFromObj(obj);

  const minMax = points.reduce(
    (acc, cur: Point) => {
      return (
        acc && {
          minX: Math.min(acc.minX, cur.x),
          maxX: Math.max(acc.maxX, cur.x),
          minY: Math.min(acc.minY, cur.y),
          maxY: Math.max(acc.maxY, cur.y),
        }
      );
    },
    {
      minX: points[0].x,
      maxX: points[0].x,
      minY: points[0].y,
      maxY: points[0].y,
    }
  );
  return minMax;
};

export const getRangeOfMultipleObjs = (objs: DrawObject[]) => {
  const minMax = objs.reduce(
    (acc, cur: DrawObject) =>
      acc && {
        minX: Math.min(acc.minX, cur.x),
        maxX: Math.max(acc.maxX, cur.x + cur.width),
        minY: Math.min(acc.minY, cur.y),
        maxY: Math.max(acc.maxY, cur.y + cur.height),
      },
    objs.length > 0
      ? {
          minX: objs[0].x,
          maxX: objs[0].x + objs[0].width,
          minY: objs[0].y,
          maxY: objs[0].y + objs[0].height,
        }
      : null
  );

  return (
    minMax && {
      x: minMax.minX,
      y: minMax.minY,
      width: minMax.maxX - minMax.minX,
      height: minMax.maxY - minMax.minY,
    }
  );
};

export const getRangeOfMultipleRotatedObjs = (
  objs: DrawObject[],
  rotate = true
) => {
  const minMax = objs.reduce(
    (acc, cur: DrawObject) => {
      if (rotate) {
        const { minX, maxX, minY, maxY } = getRotatedDimension(cur);
        return (
          acc && {
            minX: Math.min(acc.minX, minX),
            maxX: Math.max(acc.maxX, maxX),
            minY: Math.min(acc.minY, minY),
            maxY: Math.max(acc.maxY, maxY),
            angle: 0,
          }
        );
      }
      return (
        acc && {
          minX: Math.min(acc.minX, cur.x),
          maxX: Math.max(acc.maxX, cur.x + cur.width),
          minY: Math.min(acc.minY, cur.y),
          maxY: Math.max(acc.maxY, cur.y + cur.height),
          angle: 0,
        }
      );
    },
    objs.length > 0
      ? {
          minX: objs[0].x,
          maxX: objs[0].x + objs[0].width,
          minY: objs[0].y,
          maxY: objs[0].y + objs[0].height,
          angle: 0,
        }
      : null
  );
  return (
    minMax && {
      x: minMax.minX,
      y: minMax.minY,
      width: minMax.maxX - minMax.minX,
      height: minMax.maxY - minMax.minY,
      angle: 0,
    }
  );
};
