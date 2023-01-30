import { Point, Dimension, DrawObject, PointDelta, Rect } from '../typings';
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
  if (!role && elements?.[0]) {
    role = elements[0].getAttribute(roleAttrName);
  }

  const objElements = e.target.querySelectorAll(`[${activeIdxAttrName}]`);
  if ((idx === '' || idx === undefined) && objElements?.[0]) {
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
      nX = x;
      nY = y;
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

export const mergeTwoRect = (r1: Dimension, r2: Dimension) => {
  return {
    x: Math.min(r1.x, r2.x),
    y: Math.min(r1.y, r2.y),
    width: Math.max(r1.width, r2.width),
    height: Math.max(r1.height, r2.height),
  };
};

export const isInTheFrame = (frame: Dimension, obj: Dimension) => {
  const { width, height } = getIntersectionOfTwoRect(frame, obj);
  return width > 0 && height > 0;
};

export const getAngle = (p1: Point, p2: Point) => {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
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

export const getRotatedDimension = (obj: DrawObject) => {
  const angle = (obj.angle * Math.PI) / 180;
  const centerPoint = { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
  const points = [
    { x: obj.x, y: obj.y },
    { x: obj.x + obj.width, y: obj.y },
    { x: obj.x, y: obj.y + obj.height },
    { x: obj.x + obj.width, y: obj.y + obj.height },
  ].map((point) => getRotatedPoint(angle, point, centerPoint));

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
          }
        );
      }
      return (
        acc && {
          minX: Math.min(acc.minX, cur.x),
          maxX: Math.max(acc.maxX, cur.x + cur.width),
          minY: Math.min(acc.minY, cur.y),
          maxY: Math.max(acc.maxY, cur.y + cur.height),
        }
      );
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
