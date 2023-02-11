export enum ELight {
  DIV = 'div-文字水印',
  CANVAS = 'canvas-文字水印',
  SVG = 'svg-文字水印',
  VIDEO = '视频-文字水印',
}

export const lightList = [
  {
    tab: ELight.DIV,
    key: ELight.DIV,
  },
  {
    tab: ELight.CANVAS,
    key: ELight.CANVAS,
  },
  {
    tab: ELight.SVG,
    key: ELight.SVG,
  },
  // {
  //   tab: ELight.VIDEO,
  //   key: ELight.VIDEO,
  // },
];

export enum EDark {
  BLANKRAREA = '空域-二值化图像水印',
  DCT = '变换域DCT-文字水印',
  DFT = '变换域DFT-图像水印',
  // DWT = '变换域DWT',
  TEXT = '文本-文字水印',
  LSB = '音频LSB-文字水印',
}

export const darkList = [
  {
    tab: EDark.BLANKRAREA,
    key: EDark.BLANKRAREA,
  },
  {
    tab: EDark.DCT,
    key: EDark.DCT,
  },
  {
    tab: EDark.DFT,
    key: EDark.DFT,
  },
  // {
  //   tab: EDark.DWT,
  //   key: EDark.DWT,
  // },
  {
    tab: EDark.TEXT,
    key: EDark.TEXT,
  },
  {
    tab: EDark.LSB,
    key: EDark.LSB,
  },
];

export const tableButtonList = [
  {
    tab: ELight.DIV,
    key: ELight.DIV,
  },
  {
    tab: ELight.CANVAS,
    key: ELight.CANVAS,
  },
  {
    tab: ELight.SVG,
    key: ELight.SVG,
  },
  // {
  //   tab: ELight.VIDEO,
  //   key: ELight.VIDEO,
  // },
  {
    tab: EDark.BLANKRAREA,
    key: EDark.BLANKRAREA,
  },
  {
    tab: EDark.DCT,
    key: EDark.DCT,
  },
  {
    tab: EDark.DFT,
    key: EDark.DFT,
  },
  {
    tab: EDark.TEXT,
    key: EDark.TEXT,
  },
  {
    tab: EDark.LSB,
    key: EDark.LSB,
  },
];
