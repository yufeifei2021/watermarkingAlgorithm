import styles from '@/pages/Index/components/darkWatermarking/DCT/index.less';
import {
  addExtractWatermark,
  decode,
  encode,
  extractWaterMark,
} from '@/pages/Index/components/darkWatermarking/utils/helper';
import { Button } from '@aloudata/aloudata-design';
import { useState } from 'react';

interface IProps {
  flag: boolean;
  waterMark: string;
}

export default function TEXT({ flag, waterMark }: IProps) {
  const [mixedMsg, setMixedMsg] = useState<string>('');
  const [waterMarkMsg, setWaterMarkMsg] = useState<string>('');

  const WATERMARK_POS_HEAD = 1;
  const WATERMARK_POS_TAIL = 2;

  const mixWaterMark = () => {
    const input =
      '我欲乘风向北行，雪落轩辕大如席。我欲借船向东游,绰约仙子迎风立。我欲踏云千万里，庙堂龙吟奈我何。昆仑之巅梦日光，沧海绝境在青山。长风万里燕归来，不见天涯人不回。';
    // console.log('原文本："' + input + '"，文本长度：' + input.length);
    const watermarkSrc = waterMark;
    // console.log(
    //   '水印文本："' + watermarkSrc + '"，文本长度：' + watermarkSrc.length,
    // );
    const encodeW = encode(watermarkSrc);
    // console.log('水印编码："' + encodeW + '"，编码长度：' + encodeW.length);
    // console.log('=================================');
    // console.log('文本前添加水印');
    let result = addExtractWatermark(input, encodeW, WATERMARK_POS_HEAD);
    // console.log('输出："' + result + '"，文本长度：' + result.length);
    setMixedMsg(result);
    result = extractWaterMark(result, WATERMARK_POS_HEAD);
    let watermark = decode(result);
    // console.log('提取水印并解码：' + watermark);
    // console.log('=================================');
    // console.log('文本后添加水印');
    result = addExtractWatermark(input, encodeW, WATERMARK_POS_TAIL);
    // console.log('输出："' + result + '"，文本长度：' + result.length);
    result = extractWaterMark(result, WATERMARK_POS_TAIL);
    watermark = decode(result);
    setWaterMarkMsg(watermark);
    // console.log('提取水印并解码：' + watermark);
  };

  const handleAddWaterMark = () => {
    mixWaterMark();
  };

  const handleExtractWaterMark = () => {
    mixWaterMark();
  };

  return (
    <div>
      {flag ? (
        <div className={styles.fullContainer}>
          <div className={styles.container}>
            <span className={styles.image}>{mixedMsg}</span>
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
