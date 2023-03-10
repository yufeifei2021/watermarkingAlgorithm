const {
  writeMsgToCanvas,
  readMsgFromCanvas,
  loadIMGtoCanvas,
} = require('@/pages/Index/components/darkWatermarking/utils/main.js');

interface IImgWidthAndHeight {
  width: number;
  height: number;
}

/**
 * div
 * @returns
 */
export const getDivWaterMarkCSS = () => {
  const divCss = {
    width: '300px',
    fontSize: `16px`,
    color: '#000',
    lineHeight: 1.5,
    opacity: 0.2,
    transformOrigin: '0 0',
    userSelect: 'none',
  };

  return divCss;
};

/**
 * canvas
 * @param waterMark
 * @returns
 */
export const getCanvasWaterMark = (waterMark: string) => {
  const angle = -10;
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 55;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // eslint-disable-next-line no-magic-numbers
    ctx.clearRect(0, 0, 200, 100);
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 0.2;
    ctx.font = `16px serif`;
    // eslint-disable-next-line no-magic-numbers
    ctx.rotate((Math.PI / 180) * angle);
    // eslint-disable-next-line no-magic-numbers
    ctx.fillText(waterMark, 0, 50);
  }
  return canvas.toDataURL();
};

/**
 * svg
 * @param waterMark
 * @returns
 */
export const getSvgWaterMark = (waterMark: string) => {
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="200px" height="50px">
  <text x="0px" y="30px" dy="16px"
  text-anchor="start"
  stroke="#000"
  stroke-opacity="0.3"
  fill="none"
  font-weight="300"
  font-size="16"
  >
  ${waterMark}
  </text>
</svg>`;
  return `data:image/svg+xml;base64,${window.btoa(
    unescape(encodeURIComponent(svgStr)),
  )}`;
};

/**
 * DCT
 * @param waterMark
 * @param currentImage
 */
export const getDCTWaterMarkWrite = (
  waterMark: string,
  currentImage: string,
  setDCTImg: Function,
) => {
  const writeWaterMarking = () => {
    const t = writeMsgToCanvas('canvas', waterMark, '', 1);
    if (t === true) {
      var myCanvas = document.getElementById('canvas');
      if (myCanvas) {
        const result = (myCanvas as HTMLCanvasElement).toDataURL('image/png');
        setDCTImg(result);
      }
    }
  };
  // eslint-disable-next-line no-magic-numbers
  loadIMGtoCanvas(currentImage, 'canvas', writeWaterMarking, 500);
};

/**
 * DCT
 * @param waterMark
 * @param currentImage
 */
export const getDCTWaterMarkExtract = (
  currentImage: string,
  setDCTWaterMarkMsg: Function,
) => {
  const readfunc = () => {
    const t = readMsgFromCanvas('canvas', '', 1);
    if (t !== null) {
      setDCTWaterMarkMsg(t);
    }
  };
  loadIMGtoCanvas(currentImage, 'canvas', readfunc);
};

// ????????????
const createWaterMark = (
  waterMark: string,
  waterMarkMsg: IImgWidthAndHeight,
) => {
  const canvas = document.createElement('canvas');
  canvas.width = waterMarkMsg.width;
  canvas.height = waterMarkMsg.height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // eslint-disable-next-line no-magic-numbers
    ctx.clearRect(0, 0, 200, 100);
    ctx.fillStyle = '#000';
    // eslint-disable-next-line no-magic-numbers
    ctx.font = `${canvas.width / 10}px serif`;
    // eslint-disable-next-line no-magic-numbers
    ctx.fillText(waterMark, 0, canvas.width / 2.5, canvas.width);
  }
  return canvas.toDataURL();
};

const getRGBFromUrl = (src: string) => {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) => {
    image.onload = () => {
      const color = commonFun(image);
      resolve(color);
    };
  });
};

const getImgWidthAndHeight = (src: string) => {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) => {
    image.onload = () => {
      const imgWidthAndHeight = {
        width: image.width,
        height: image.height,
      };
      resolve(imgWidthAndHeight);
    };
  });
};

const rgbToBase64 = (rgba: number[][], waterMarkMsg: IImgWidthAndHeight) => {
  const canvas = document.createElement('canvas');
  if (waterMarkMsg) {
    canvas.width = waterMarkMsg.width;
    canvas.height = waterMarkMsg.height;
    const context = canvas.getContext('2d');
    if (context) {
      const tempImg = context.getImageData(
        // eslint-disable-next-line no-magic-numbers
        0,
        // eslint-disable-next-line no-magic-numbers
        0,
        canvas.width,
        canvas.height,
      );
      for (let i = 0; i < rgba.length; i++) {
        // eslint-disable-next-line no-magic-numbers
        tempImg.data[i * 4] = rgba[i][0];
        // eslint-disable-next-line no-magic-numbers
        tempImg.data[i * 4 + 1] = rgba[i][1];
        // eslint-disable-next-line no-magic-numbers
        tempImg.data[i * 4 + 2] = rgba[i][2];
        // eslint-disable-next-line no-magic-numbers
        tempImg.data[i * 4 + 3] = rgba[i][3];
      }
      // eslint-disable-next-line no-magic-numbers
      context.putImageData(tempImg, 0, 0);
      context.save();
    }
  }
  return canvas.toDataURL();
};

const mixedWaterMark = (
  colorArr: number[][],
  waterMarkArr: number[][],
  imgWidthAndHeight: IImgWidthAndHeight,
) => {
  for (const i in colorArr) {
    // eslint-disable-next-line no-magic-numbers
    if (colorArr[i][0] % 2 === 1) {
      // eslint-disable-next-line no-magic-numbers
      colorArr[i][0]--;
    }
    // eslint-disable-next-line no-magic-numbers
    if (waterMarkArr[i][3] !== 0) {
      // eslint-disable-next-line no-magic-numbers
      colorArr[i][0]++;
    }
  }
  const mixedImgUrl = rgbToBase64(colorArr, imgWidthAndHeight);
  return mixedImgUrl;
};

const getWaterMarkImgUrl = (
  src: string,
  imgWidthAndHeight: IImgWidthAndHeight,
) => {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) => {
    image.onload = () => {
      const rgba = commonFun(image);
      const canvas = document.createElement('canvas');
      if (imgWidthAndHeight) {
        canvas.width = imgWidthAndHeight.width;
        canvas.height = imgWidthAndHeight.height;
        const context = canvas.getContext('2d');
        if (context) {
          const tempImg = context.getImageData(
            // eslint-disable-next-line no-magic-numbers
            0,
            // eslint-disable-next-line no-magic-numbers
            0,
            canvas.width,
            canvas.height,
          );
          for (let i = 0; i < rgba.length; i++) {
            // eslint-disable-next-line no-magic-numbers
            const currentColor = rgba[i][0] % 2 === 0 ? 255 : 0;
            // eslint-disable-next-line no-magic-numbers
            tempImg.data[i * 4] = currentColor;
            // eslint-disable-next-line no-magic-numbers
            tempImg.data[i * 4 + 1] = currentColor;
            // eslint-disable-next-line no-magic-numbers
            tempImg.data[i * 4 + 2] = currentColor;
            // eslint-disable-next-line no-magic-numbers
            tempImg.data[i * 4 + 3] = 255;
          }
          // eslint-disable-next-line no-magic-numbers
          context.putImageData(tempImg, 0, 0);
          context.save();
        }
      }
      resolve(canvas.toDataURL());
    };
  });
};

const commonFun = (image: HTMLImageElement) => {
  const color: number[][] = [];
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (context) {
    // eslint-disable-next-line no-magic-numbers
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(
      // eslint-disable-next-line no-magic-numbers
      0,
      // eslint-disable-next-line no-magic-numbers
      0,
      canvas.width,
      canvas.height,
    );
    // eslint-disable-next-line no-magic-numbers
    for (let i = 0; i < imageData.data.length; i = i + 4) {
      const onePixel: number[] = [];
      // eslint-disable-next-line no-magic-numbers
      onePixel.push(imageData.data[i + 0]);
      onePixel.push(imageData.data[i + 1]);
      // eslint-disable-next-line no-magic-numbers
      onePixel.push(imageData.data[i + 2]);
      // eslint-disable-next-line no-magic-numbers
      onePixel.push(imageData.data[i + 3]);
      color.push(onePixel);
    }
  }
  return color;
};

/**
 * ??????????????????
 * @param currentImage
 * @param waterMark
 * @returns
 */
export const handleAddWaterMark = async (
  currentImage: string,
  waterMark: string,
) => {
  // ???????????????rgb??????
  const currentImgArray = await getRGBFromUrl(currentImage);
  // ?????????????????????
  const imgWidthAndHeight = await getImgWidthAndHeight(currentImage);
  // ?????????????????????url??????
  const waterMarkUrl = createWaterMark(
    waterMark,
    imgWidthAndHeight as IImgWidthAndHeight,
  );
  // ?????????rgb??????
  const waterMarkArray = await getRGBFromUrl(waterMarkUrl);
  // ?????????????????????rgb????????????lsb??????????????????????????????url
  const mixedImgUrl = mixedWaterMark(
    currentImgArray as number[][],
    waterMarkArray as number[][],
    imgWidthAndHeight as IImgWidthAndHeight,
  );
  // ????????????????????????
  return mixedImgUrl;
};

/**
 * ??????????????????
 * @param currentImage
 * @returns
 */
export const handleExtractWaterMark = async (currentImage: string) => {
  // ?????????????????????
  const imgWidthAndHeight = await getImgWidthAndHeight(currentImage);
  const waterMarkUrl = await getWaterMarkImgUrl(
    currentImage,
    imgWidthAndHeight as IImgWidthAndHeight,
  );
  return waterMarkUrl;
};
