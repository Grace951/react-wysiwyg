import { Point } from '../typings';
import { ELEMENT_ROLE } from '../constants';
export function block(e) {
  e.stopPropagation();
  e.nativeEvent &&
    e.nativeEvent.stopImmediatePropagation &&
    e.nativeEvent.stopImmediatePropagation();
}

export function getUserEventPosition(e): Point {
  const isTouch = e.type.indexOf('touch') !== -1;
  const touch = e?.touches?.[0] || e?.changedTouches?.[0];
  const x = isTouch ? touch.pageX : e.pageX;
  const y = isTouch ? touch.pageY : e.pageY;
  return { x, y };
}

export function getElementRoleAndObjectIdxFromUserEvent(e) {
  const roleAttrName = 'data-role';
  const activeIdxAttrName = 'data-active-obj-idx';
  let idx =
    e.currentTarget?.getAttribute(activeIdxAttrName) ||
    e.target?.getAttribute(activeIdxAttrName);

  let role =
    e.currentTarget?.getAttribute(roleAttrName) ||
    e.target?.getAttribute(roleAttrName);

  const elements = e.target.querySelectorAll(`[${roleAttrName}]`);
  if (elements?.[0]) {
    role = elements[0].getAttribute(roleAttrName);
  }

  const objElements = e.target.querySelectorAll(`[${activeIdxAttrName}]`);
  if (elements?.[0]) {
    const v = objElements[0].getAttribute(activeIdxAttrName);
    idx = !!v ? parseInt(v) : idx;
  }
  //   console.log(objElements);
  return { role, idx };
}
