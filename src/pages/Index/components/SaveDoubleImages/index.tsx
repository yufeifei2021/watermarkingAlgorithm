import { useMount } from 'ahooks';
import { useState } from 'react';
import { EDark, ELight } from '../AddOrExtract/type';
import Middleware from '../Middleware';
import styles from './index.less';

interface IProps {
  currentImg: string;
  currentWaterMarking: string;
  currentImgFile?: File;
}
interface IUserMessage {
  userName: string;
  userPhone: string;
}

export default function SaveDoubleImages({
  currentImg,
  currentWaterMarking,
  currentImgFile,
}: IProps) {
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  useMount(() => {
    const message = window.localStorage.getItem('userMsg');
    if (message) {
      const messageMap: IUserMessage = JSON.parse(message);
      setUserName(messageMap.userName);
      setUserPhone(messageMap.userPhone);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperContent}>
          <div
            className={
              currentWaterMarking !== EDark.LSB &&
              currentWaterMarking !== ELight.VIDEO
                ? styles.images
                : styles.otherImages
            }
          >
            <div className={styles.inner}>
              <div className={styles.innerUp}>
                <Middleware
                  currentImg={currentImg}
                  currentWaterMarking={currentWaterMarking}
                  flag={true}
                  waterMark={userName + '-' + userPhone}
                  currentImgFile={currentImgFile}
                />
              </div>
            </div>
          </div>
          {currentWaterMarking !== EDark.LSB &&
            currentWaterMarking !== ELight.VIDEO && (
              <div className={styles.images}>
                <div className={styles.inner}>
                  <div className={styles.innerUp}>
                    <Middleware
                      currentImg={currentImg}
                      currentWaterMarking={currentWaterMarking}
                      flag={false}
                      waterMark={userName + '-' + userPhone}
                      currentImgFile={currentImgFile}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
