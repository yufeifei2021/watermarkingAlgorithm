import { Button } from '@aloudata/aloudata-design';
import { useState } from 'react';
import styles from './index.less';

interface IProps {
  currentImage: string;
  flag: boolean;
  waterMark: string;
}

interface IImgWidthAndHeight {
  width: number;
  height: number;
}

export default function BlankAreaWaterMarking({
  currentImage,
  flag,
  waterMark,
}: IProps) {
  const [mixedImg, setMixedImg] = useState<string>('');
  const [waterMarkImg, setWaterMarkImg] = useState<string>('');

  // 创建水印
  const createWaterMark = (waterMarkMsg: IImgWidthAndHeight) => {
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
      setWaterMarkImg(canvas.toDataURL());
    };
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

  // 添加空域水印
  const handleAddWaterMark = async () => {
    // 当前图像的rgb数组
    const currentImgArray = await getRGBFromUrl(currentImage);
    // 当前图像的宽高
    const imgWidthAndHeight = await getImgWidthAndHeight(currentImage);
    // 创建一个水印的url地址
    const waterMarkUrl = createWaterMark(
      imgWidthAndHeight as IImgWidthAndHeight,
    );
    // 水印的rgb数组
    const waterMarkArray = await getRGBFromUrl(waterMarkUrl);
    // 将图像和水印的rgb数组进行lsb混合，并返回混合后的url
    const mixedImgUrl = mixedWaterMark(
      currentImgArray as number[][],
      waterMarkArray as number[][],
      imgWidthAndHeight as IImgWidthAndHeight,
    );
    // 设置混合后的图像
    setMixedImg(mixedImgUrl);
  };

  // 提取空域水印
  const handleExtractWaterMark = async () => {
    // 当前图像的宽高
    const imgWidthAndHeight = await getImgWidthAndHeight(currentImage);
    getWaterMarkImgUrl(currentImage, imgWidthAndHeight as IImgWidthAndHeight);
  };

  return (
    <div className={styles.container}>
      {flag ? (
        <div className={styles.fullContainer}>
          <div className={styles.container}>
            <img src={mixedImg} className={styles.image} />
          </div>
          <Button
            type="primary"
            className={styles.button}
            onClick={handleAddWaterMark}
          >
            水印添加
          </Button>
        </div>
      ) : (
        <div className={styles.fullContainer}>
          <div className={styles.container}>
            <img src={waterMarkImg} className={styles.image} />
          </div>
          <Button
            type="primary"
            className={styles.button}
            onClick={handleExtractWaterMark}
          >
            水印提取
          </Button>
        </div>
      )}
    </div>
  );
}
