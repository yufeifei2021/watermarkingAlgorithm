import { Button, message, UploadProps } from '@aloudata/aloudata-design';
import { RcFile } from '@aloudata/aloudata-design/es/Upload';
import { DownloadLine } from '@aloudata/icons-react';
import Dragger from 'antd/lib/upload/Dragger';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './index.less';
const {
  bufferToWave,
  Float32Array2Int16Array,
  Int16Array2Float32Array,
} = require('@/pages/Index/components/darkWatermarking/utils/audioUtil.js');

interface IProps {
  flag: boolean;
  waterMark: string;
}

export default function LSB({ flag, waterMark }: IProps) {
  const [currentFile, setCurrentFile] = useState<string>('');
  const [currentWater, setCurrentWater] = useState<string>('');

  const getArrayBuffer = (file: RcFile | File): Promise<ArrayBuffer> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (error) => reject(error);
    });

  const handleArrayBuffer = async (audioArrayBuffer: ArrayBuffer) => {
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer);
    // 声道数量和采样率
    const channels = audioBuffer.numberOfChannels;
    const rate = audioBuffer.sampleRate;
    // 截取前60秒
    const startOffset = 0;
    // eslint-disable-next-line no-magic-numbers
    const endOffset = rate * 60;
    // 60秒对应的帧数
    const frameCount = endOffset - startOffset;
    // 创建同样采用率、同样声道数量，长度是前60秒的空的AudioBuffer
    const newAudioBuffer = new AudioContext().createBuffer(
      channels,
      endOffset - startOffset,
      rate,
    );
    // 创建临时的Array存放复制的buffer数据
    let anotherArray = new Float32Array(frameCount);
    // 声道的数据的复制和写入
    const offset = 0;
    for (let channel = 0; channel < channels; channel++) {
      audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
      // eslint-disable-next-line no-magic-numbers
      if (channel === 0) {
        const temp = Float32Array2Int16Array(anotherArray);
        // 要求在AscII码表中 长度不要超过255 中文主要是长度跟别的不一样，中文要2～4个字节，英文就1个字节
        const waterMarkString = waterMark;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-magic-numbers
        addWatermark(temp, waterMarkString);
        //temp: UintArray(0~255)
        anotherArray = Int16Array2Float32Array(temp);
      }
      newAudioBuffer.copyToChannel(anotherArray, channel, offset);
    }
    const blob = bufferToWave(newAudioBuffer, frameCount);
    const blobUrl = URL.createObjectURL(blob as Blob);
    setCurrentFile(blobUrl);
    // newAudioBuffer就是全新的复制的60秒长度的AudioBuffer对象
  };

  // 添加水印数据，temp为0～255的数组，可随意设置
  // lsb即 将0～255的数据每一位（奇数-1，偶数不变，然后在要添加的水印所对应的变化位置+1）
  // 2s的音频48000采样率，双频道channel的其中一个channel数据长度为96000即temp当前为96000
  // 如果当前位置的temp[i] < 3时，temp[i] = 3
  const addWatermark = (temp: number[], water: string) => {
    water = encodeURIComponent(water);
    const waterLength = water.length;
    // eslint-disable-next-line no-magic-numbers
    temp[0] = waterLength + 2;
    for (let index = 0; index < waterLength; index++) {
      // eslint-disable-next-line no-magic-numbers
      const LMark = water.charCodeAt(index);
      // eslint-disable-next-line no-magic-numbers
      const water2 = LMark.toString(2);
      let result = water2;
      // eslint-disable-next-line no-magic-numbers
      if (water2.length < 8) {
        // eslint-disable-next-line no-magic-numbers
        for (let i = 0; i < 8 - water2.length; i++) {
          result = '0' + result;
        }
      }
      // eslint-disable-next-line no-magic-numbers
      for (let i = 0; i < 8; i++) {
        if (result.charAt(i) === '1') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-magic-numbers
          temp[index * 8 + i + 1] = 3;
        }
      }
    }
  };

  // 提取水印数据，temp为0～255的数组，
  // 解析lsb方法为判断每一位是奇数还是偶数，奇数就将水印对应位置 +1，否则置为0
  const extractWaterMark = (temp: { toString: () => string }[]) => {
    // eslint-disable-next-line no-magic-numbers
    const waterLength = parseInt(temp[0].toString());
    let water = '';
    for (let index = 0; index < waterLength; index++) {
      let result = 0;
      // float32 转 int误差为1，共计转2次
      // eslint-disable-next-line no-magic-numbers
      for (let i = index * 8 + 8; i >= index * 8 + 1; i--) {
        if (temp[i].toString() !== '0') {
          // eslint-disable-next-line no-magic-numbers
          result += Math.pow(2, 8 * index + 8 - i);
        }
      }
      water += String.fromCharCode(result);
    }
    setCurrentWater(decodeURIComponent(water));
  };

  const props: UploadProps = {
    name: 'file',
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        if (!info.file.url && !info.file.preview) {
          const audioArrayBuffer = await getArrayBuffer(
            info.file.originFileObj as RcFile,
          );
          handleArrayBuffer(audioArrayBuffer);
        }
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleExtractWaterMark = async () => {
    fetch(currentFile, {
      method: 'get',
    }).then(async (res) => {
      const file = res.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(await file);
      // 声道数量和采样率
      const channels = audioBuffer.numberOfChannels;
      const rate = audioBuffer.sampleRate;
      // 截取前60秒
      const startOffset = 0;
      // eslint-disable-next-line no-magic-numbers
      const endOffset = rate * 2;
      // 60秒对应的帧数
      const frameCount = endOffset - startOffset;
      // 创建临时的Array存放复制的buffer数据
      let anotherArray = new Float32Array(frameCount);
      for (let channel = 0; channel < channels; channel++) {
        audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
        // eslint-disable-next-line no-magic-numbers
        if (channel === 0) {
          const temp = Float32Array2Int16Array(anotherArray);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-magic-numbers
          extractWaterMark(temp);
          //1s放得下 96000bit = 12000byte = 12kb
          anotherArray = Int16Array2Float32Array(temp);
        }
      }
    });
  };

  return (
    <div>
      {flag && (
        <div
          className={
            currentFile ? styles.fullOtherContainer : styles.fullContainer
          }
        >
          {currentFile ? (
            <audio className={styles.image} src={currentFile} controls={true} />
          ) : (
            <div className={styles.leftContent}>
              <Dragger {...props}>
                <div className={styles.fileUpload}>
                  <div className={styles.file}>
                    <DownloadLine />
                  </div>
                  <div className={styles.file}>
                    音频上传
                    <p className={styles.fileText}>
                      音频格式仅支持上传mp3、wav、ogg
                    </p>
                  </div>
                </div>
              </Dragger>
            </div>
          )}
          <div className={classNames(styles.container, styles.imageBtn)}>
            <Button
              type="primary"
              className={styles.button}
              onClick={handleExtractWaterMark}
            >
              水印提取
            </Button>
            <div className={styles.currentWater}>{currentWater}</div>
          </div>
        </div>
      )}
    </div>
  );
}
