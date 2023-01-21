export const DEF_FRAME_VERTEX_SIZE = 10;
export const MAX_XINDEX_VALUE = 10000000;
export const WIDGET_TYPE = {
  image: 'image',
  video: 'video',
  youtube: 'youtube',
  shape: 'shape',
  text: 'text',
  line: 'line',
};

export const CANVAS_STATE = {
  adding: 'selecting',
  selecting: 'selecting',
  resizing: 'resizing',
  normal: 'normal',
};

export const ELEMENT_ROLE = {
  controlFrameVertex: 'controlFrameVertex',
  drawObject: 'drawObject',
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
