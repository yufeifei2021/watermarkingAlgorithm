import { Button, message } from '@aloudata/aloudata-design';
import { useState } from 'react';
import Uploads from '../Uploads';
import {
  getCanvasWaterMark,
  getDCTWaterMarkExtract,
  getDCTWaterMarkWrite,
  getDivWaterMarkCSS,
  getSvgWaterMark,
  handleAddWaterMark,
  handleExtractWaterMark,
} from './helper';
import styles from './index.less';
import {
  EButtons,
  robustnessButtonList,
  watermarkSuperpositionButtonList,
} from './type';

interface IProps {
  waterMark: string;
  flag: boolean;
}
interface ICss {
  [x: string]: string | number;
}

export default function Superposition({ waterMark, flag }: IProps) {
  const buttonList = flag
    ? watermarkSuperpositionButtonList
    : robustnessButtonList;
  const [currentImg, setCurrentImg] = useState<string>('');
  const [buttonEnabledList, setButtonEnabledList] = useState<string[]>([]);
  const [mixedImgUrl, setMixedImgUrl] = useState<string>('');

  const [divWaterMark, setDivWaterMark] = useState<Boolean>(false);
  const [cssDivHelper, setCssDivHelper] = useState<ICss>();

  const [canvasWaterMark, setCanvasWaterMark] = useState<Boolean>(false);
  const [canvasImg, setCanvasImg] = useState<string>('');

  const [svgWaterMark, setSvgWaterMark] = useState<Boolean>(false);
  const [svgImg, setSvgImg] = useState<string>('');

  const [blankAreaWaterMark, setBlankAreaWaterMark] = useState<Boolean>(false);
  const [blankAreaImg, setBlankAreaImg] = useState<string>('');

  const [DCTWaterMark, setDCTWaterMark] = useState<Boolean>(false);
  const [DCTImg, setDCTImg] = useState<string>('');
  const [DCTWaterMarkMsg, setDCTWaterMarkMsg] = useState<string>('');

  const ZERO = 0;

  const pressButton = (buttonName: string) => {
    if (!buttonEnabledList.includes(buttonName)) {
      enableButton(buttonName);
    } else {
      disableButton(buttonName);
    }
  };

  const enableButton = (buttonName: string) => {
    setButtonEnabledList([...buttonEnabledList, buttonName]);
  };

  const disableButton = (buttonName: string) => {
    const tempList: string[] = [];
    buttonEnabledList.map((item) => {
      tempList.push(item);
    });
    tempList.splice(tempList.indexOf(buttonName), 1);
    setButtonEnabledList(tempList);
  };

  const resetAllWaterMark = () => {
    setDivWaterMark(false);
    setCanvasWaterMark(false);
    setSvgWaterMark(false);
    setDCTWaterMark(false);
    setBlankAreaWaterMark(false);
  };

  /**
   * 添加水印
   */
  const addWaterMask = async () => {
    resetAllWaterMark();
    if (buttonEnabledList.length !== ZERO) {
      buttonEnabledList.map(async (item) => {
        switch (item) {
          case EButtons.DIV:
            setDivWaterMark(true);
            setCssDivHelper(getDivWaterMarkCSS);
            break;
          case EButtons.CANVAS:
            setCanvasWaterMark(true);
            setCanvasImg(getCanvasWaterMark(waterMark));
            break;
          case EButtons.SVG:
            setSvgWaterMark(true);
            setSvgImg(getSvgWaterMark(waterMark));
            break;
          case EButtons.BLANKRAREA:
            setBlankAreaWaterMark(true);
            const tempAddBlankAreaImg = await handleAddWaterMark(
              currentImg,
              waterMark,
            );
            setBlankAreaImg(tempAddBlankAreaImg);
            break;
          case EButtons.DCT:
            setDCTWaterMark(true);
            getDCTWaterMarkWrite(waterMark, currentImg, setDCTImg);
            break;
          case EButtons.DFT:
            break;
        }
      });
      setMixedImgUrl(currentImg);
    } else {
      message.error('请选择要添加的水印');
    }
  };

  /**
   * 提取水印
   */
  const extractWaterMark = async () => {
    if (buttonEnabledList.length !== ZERO) {
      buttonEnabledList.map(async (item) => {
        switch (item) {
          case EButtons.BLANKRAREA:
            const tempExtractBlankAreaImg = await handleExtractWaterMark(
              currentImg,
            );
            setBlankAreaImg(tempExtractBlankAreaImg as string);
            break;
          case EButtons.DCT:
            getDCTWaterMarkExtract(currentImg, setDCTWaterMarkMsg);
            break;
          case EButtons.DFT:
            break;
        }
      });
    } else {
      message.error('请选择要提取的水印');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperContent}>
          <div className={styles.leftContent}>
            <Uploads currentImg={currentImg} setCurrentImg={setCurrentImg} />
          </div>
          <div className={styles.midContent}>
            <div className={styles.midUp}>
              <div className={styles.midUpBtn}>
                {buttonList.map((item, index) => {
                  return (
                    <Button
                      type={
                        buttonEnabledList.includes(item.value)
                          ? 'primary'
                          : 'secondary'
                      }
                      key={index}
                      onClick={() => pressButton(item.value)}
                    >
                      {item.value}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className={styles.midDown}>
              <div className={styles.spare}>
                <div className={styles.upSpare}>水印叠加区域</div>
                <div className={styles.downSpare}>
                  {buttonEnabledList.map((item, index) => {
                    return <Button key={index}>{item}</Button>;
                  })}
                </div>
              </div>
              <Button
                className={styles.midDownBtn}
                type="primary"
                onClick={flag ? addWaterMask : extractWaterMark}
              >
                开始
              </Button>
            </div>
          </div>
          {flag ? (
            <div className={styles.rightContent}>
              {/* div */}
              <div className={styles.divWrapper}>
                {divWaterMark && (
                  <div className={styles.divWrapperContent}>
                    <div style={cssDivHelper}>{waterMark}</div>
                    <div style={cssDivHelper}>{waterMark}</div>
                    <div style={cssDivHelper}>{waterMark}</div>
                  </div>
                )}
              </div>
              {/* canvas */}
              <div className={styles.canvasWrapper}>
                {canvasWaterMark && (
                  <div className={styles.canvasWrapperContent}>
                    <img src={canvasImg} />
                    <img src={canvasImg} />
                    <img src={canvasImg} />
                  </div>
                )}
              </div>
              {/* svg */}
              <div className={styles.svgWrapper}>
                {svgWaterMark && (
                  <div className={styles.svgWrapperContent}>
                    <img src={svgImg} />
                    <img src={svgImg} />
                    <img src={svgImg} />
                  </div>
                )}
              </div>
              {/* blankAreaWaterMark */}
              <div className={styles.blankAreaWrapper}>
                {blankAreaWaterMark && (
                  <div className={styles.blankAreaWrapperContent}>
                    <img src={blankAreaImg} className={styles.blankAreaImg} />
                  </div>
                )}
              </div>
              {/* DCT */}
              <div className={styles.DCTWrapper}>
                {DCTWaterMark && (
                  <div className={styles.DCTWrapperContent}>
                    <img src={DCTImg} className={styles.DCTImg} />
                  </div>
                )}
              </div>
              {!DCTImg && (
                <div className={styles.text}>
                  {mixedImgUrl ? (
                    <img className={styles.image} src={mixedImgUrl} />
                  ) : (
                    '等待图像生成...'
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.rightContent}>
              {blankAreaImg ? (
                <img className={styles.image} src={blankAreaImg} />
              ) : (
                <span className={styles.text}>
                  {DCTWaterMarkMsg ? DCTWaterMarkMsg : '等待图像生成...'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
