import { useMount } from 'ahooks';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface IUserMessage {
  userName: string;
  userPhone: string;
}

interface IProps {
  currentImage: string;
  flag: boolean;
}

export default function CanvasWaterMarking({ currentImage, flag }: IProps) {
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [canvasImg, setCanvasImg] = useState<string>('');

  const waterMarking = userName + '-' + userPhone;

  useMount(() => {
    const message = window.localStorage.getItem('userMsg');
    if (message) {
      const messageMap: IUserMessage = JSON.parse(message);
      setUserName(messageMap.userName);
      setUserPhone(messageMap.userPhone);
    }
  });

  useEffect(() => {
    setCanvasImg(createWaterMark(waterMarking));
  }, [waterMarking]);

  const createWaterMark = (waterMark: string) => {
    const angle = -15;
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {currentImage && (
          <div className={styles.wrapperContent}>
            <img src={canvasImg} />
            <img src={canvasImg} />
            <img src={canvasImg} />
          </div>
        )}
      </div>
      {flag && <img src={currentImage} className={styles.image} />}
    </div>
  );
}
