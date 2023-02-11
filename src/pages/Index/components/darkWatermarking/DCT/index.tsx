import { Button, message } from '@aloudata/aloudata-design';
import { useState } from 'react';
import styles from './index.less';
const {
  writeMsgToCanvas,
  readMsgFromCanvas,
  loadIMGtoCanvas,
} = require('@/pages/Index/components/darkWatermarking/utils/main.js');

interface IProps {
  currentImage: string;
  flag: boolean;
  waterMark: string;
}

export default function DCT({ currentImage, flag, waterMark }: IProps) {
  const [waterMarkImg, setWaterMarkImg] = useState<string>('');
  const [waterMarkMsg, setWaterMarkMsg] = useState<string>('');

  const addWaterMark = () => {
    const writeWaterMarking = () => {
      const t = writeMsgToCanvas('canvas', waterMark, '', 1);
      if (t === true) {
        var myCanvas = document.getElementById('canvas');
        if (myCanvas) {
          var image = (myCanvas as HTMLCanvasElement).toDataURL('image/png');
          setWaterMarkImg(image);
        }
      }
    };
    // eslint-disable-next-line no-magic-numbers
    loadIMGtoCanvas(currentImage, 'canvas', writeWaterMarking, 500);
  };

  const extractWaterMark = () => {
    const readfunc = () => {
      const t = readMsgFromCanvas('canvas', '', 1);
      if (t !== null) {
        setWaterMarkMsg(t);
      }
    };
    loadIMGtoCanvas(currentImage, 'canvas', readfunc);
  };

  const handleAddWaterMark = () => {
    addWaterMark();
  };

  const handleExtractWaterMark = () => {
    extractWaterMark();
    message.success('提取完成！');
  };

  return (
    <div>
      {flag ? (
        <div className={styles.fullContainer}>
          <div className={styles.container}>
            <img src={waterMarkImg} className={styles.image} />
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
            <span className={styles.image}>{waterMarkMsg}</span>
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
