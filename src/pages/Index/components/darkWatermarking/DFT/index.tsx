import {
  CHANNEL,
  decode as getWatermark,
  encode as addWatermark,
  load,
} from '@/pages/Index/components/darkWatermarking/utils/opencvHelper';
import { Button } from '@aloudata/aloudata-design';
import { useMount } from 'ahooks';
import { useState } from 'react';
import styles from './index.less';

interface IProps {
  currentImage: string;
  flag: boolean;
  waterMark: string;
  currentImgFile?: File;
}

export default function DFT({ flag, currentImgFile }: IProps) {
  const [waterMarkImg, setWaterMarkImg] = useState<string>('');
  const [decodeWaterMarkImg, setDecodeWaterMarkImg] = useState<string>('');
  // 加码水印设置
  const watermark = 'ljhxgg';
  // const watermark = waterMark;
  const fontSize = 1.1;
  const encodeChannel = CHANNEL.B;
  const sourceFile = currentImgFile;
  const [, setEncodeFile] = useState<File>();

  let encodedSourceFile: File | undefined;

  const add = async () => {
    if (!sourceFile) {
      return;
    }
    const result = await addWatermark(
      sourceFile,
      watermark,
      fontSize,
      encodeChannel,
    );
    setEncodeFile(result);
    setWaterMarkImg(URL.createObjectURL(result));
    // 模拟上传了需要解码的图
    setDecodeChannel(encodeChannel);
  };

  // 图像解密
  const [decodeChannel, setDecodeChannel] = useState<CHANNEL>(CHANNEL.B);
  // const [encodedSourceFile, setEncodedSourceFile] = useState<File>();
  const [, setDecodedFile] = useState<File>();
  const extract = () => {
    encodedSourceFile = currentImgFile;
    decode();
  };

  const decode = async () => {
    if (!encodedSourceFile) {
      return;
    }
    const temp = await getWatermark(encodedSourceFile, decodeChannel);
    setDecodeWaterMarkImg(URL.createObjectURL(temp));
    setDecodedFile(temp);
  };

  const handleAddWaterMark = () => {
    add();
  };

  const handleExtractWaterMark = () => {
    extract();
  };

  useMount(() => {
    load();
  });

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
            <img src={decodeWaterMarkImg} className={styles.image} />
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
