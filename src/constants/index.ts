export const ROTATE_IDX = 8;
export const DEF_FRAME_VERTEX_SIZE = 10;
export const MAX_XINDEX_VALUE = 10000000;
export const WIDGET_TYPE = {
  selectorTool: 'selectorTool',
  image: 'image',
  video: 'video',
  youtube: 'youtube',
  shape: 'shape',
  text: 'text',
  line: 'line',
};

export const EDITOR_STATE = {
  adding: 'adding',
  selecting: 'selecting',
  selected: 'selected',
  resizing: 'resizing',
  normal: 'normal',
  moving: 'moving',
  disable: 'disable',
};

export const CANVAS_EVENT = {
  clickDrawObj: 'clickDrawObj',
  clickCanvas: 'clickCanvas',
  addDrawObj: 'addDrawObj',
  mouseDownOnDrawObj: 'mouseDownOnDrawObj',
  mouseDownOnCtrlFrameVertix: 'mouseDownOnCtrlFrameVertix',
  mouseDownOnCanvas: 'mouseDownOnCanvas',
  mouseMoving: 'mouseMoving',
  mouseUp: 'mouseUp',
  disable: 'disable',
  enable: 'enable',
  copyObject: 'copyObject',
  deleteObject: 'deleteObject',
};

export const EDITOR_EVENT = {
  selectWidget: 'selectWidget',
};

export const ELEMENT_ROLE = {
  controlFrame: 'controlFrame',
  controlFrameVertex: 'controlFrameVertex',
  drawObject: 'drawObject',
  background: 'background',
  selectingFrame: 'selectingFrame',
  na: 'na',
};

export const CONTROL_VERTICES_CONFIG = [
  {
    desc: 'top-left',
    cursor: 'nwse-resize',
  },
  {
    desc: 'top-center',
    cursor: 'row-resize',
  },
  {
    desc: 'top-right',
    cursor: 'nesw-resize',
  },
  {
    desc: 'middle-right',
    cursor: 'col-resize',
  },
  {
    desc: 'bottom-right',
    cursor: 'nwse-resize',
  },
  {
    desc: 'bottom-center',
    cursor: 'row-resize',
  },
  {
    desc: 'bottom-left',
    cursor: 'nesw-resize',
  },
  {
    desc: 'middle-left',
    cursor: 'col-resize',
  },
];
