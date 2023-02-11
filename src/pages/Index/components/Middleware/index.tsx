import { EDark, ELight } from '../AddOrExtract/type';
import BlankAreaWaterMarking from '../darkWatermarking/BLANKRAREA';
import DCT from '../darkWatermarking/DCT';
import DFT from '../darkWatermarking/DFT';
import LSB from '../darkWatermarking/LSB';
import TEXT from '../darkWatermarking/TEXT';
import CanvasWaterMarking from '../openWatermark/Canvas';
import DivWaterMarking from '../openWatermark/Div';
import SvgWaterMarking from '../openWatermark/Svg';

interface IProps {
  currentImg: string;
  currentWaterMarking: string;
  flag: boolean;
  waterMark: string;
  currentImgFile?: File;
}

export default function Middleware({
  currentImg,
  currentWaterMarking,
  flag,
  waterMark,
  currentImgFile,
}: IProps) {
  switch (currentWaterMarking) {
    // div - 文字水印
    case ELight.DIV:
      return <DivWaterMarking currentImage={currentImg} flag={flag} />;
    // canvas-文字水印
    case ELight.CANVAS:
      return <CanvasWaterMarking currentImage={currentImg} flag={flag} />;
    // svg-文字水印
    case ELight.SVG:
      return <SvgWaterMarking currentImage={currentImg} flag={flag} />;
    // 视频-文字水印
    // case ELight.VIDEO:
    //   return <VIDEO flag={flag} waterMark={waterMark} />;
    // 空域-二值化图像水印
    case EDark.BLANKRAREA:
      return (
        <BlankAreaWaterMarking
          currentImage={currentImg}
          flag={flag}
          waterMark={waterMark}
        />
      );
    // 变换域DCT-文字水印
    case EDark.DCT:
      return (
        <DCT currentImage={currentImg} flag={flag} waterMark={waterMark} />
      );
    // 变换域DFT-图像水印
    case EDark.DFT:
      return (
        <DFT
          currentImage={currentImg}
          flag={flag}
          waterMark={waterMark}
          currentImgFile={currentImgFile}
        />
      );
    // 文本-文字水印
    case EDark.TEXT:
      return <TEXT flag={flag} waterMark={waterMark} />;
    // 音频LSB-音频水印
    case EDark.LSB:
      return <LSB flag={flag} waterMark={waterMark} />;
  }
  return <div></div>;
}
