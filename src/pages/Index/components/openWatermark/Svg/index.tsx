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
  const [svgImg, setSvgImg] = useState<string>('');

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
    setSvgImg(createWaterMark(waterMarking));
  }, [waterMarking]);

  const createWaterMark = (waterMark: string) => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="200px" height="50px">
    <text x="0px" y="30px" dy="16px"
    text-anchor="start"
    stroke="#000"
    stroke-opacity="0.3"
    fill="none"
    transform="rotate(-10)"
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {currentImage && (
          <div className={styles.wrapperContent}>
            <img src={svgImg} />
            <img src={svgImg} />
            <img src={svgImg} />
          </div>
        )}
      </div>
      {flag && <img src={currentImage} className={styles.image} />}
    </div>
  );
}
