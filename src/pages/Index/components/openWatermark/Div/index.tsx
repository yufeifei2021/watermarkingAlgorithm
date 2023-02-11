import { useMount } from 'ahooks';
import { useState } from 'react';
import styles from './index.less';

interface IUserMessage {
  userName: string;
  userPhone: string;
}

interface IProps {
  currentImage: string;
  flag: boolean;
}

interface ICss {
  [x: string]: string | number;
}

export default function DivWaterMarking({ currentImage, flag }: IProps) {
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [cssHelper, setCssHelper] = useState<ICss>();
  const waterMarking = userName + '-' + userPhone;

  useMount(() => {
    const message = window.localStorage.getItem('userMsg');
    if (message) {
      const messageMap: IUserMessage = JSON.parse(message);
      setUserName(messageMap.userName);
      setUserPhone(messageMap.userPhone);
      setCssHelper({
        width: '300px',
        fontSize: `16px`,
        color: '#000',
        lineHeight: 1.5,
        opacity: 0.1,
        transform: `rotate(-15deg)`,
        transformOrigin: '0 0',
        userSelect: 'none',
      });
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {currentImage && (
          <div className={styles.wrapperContent}>
            <div style={cssHelper}>{waterMarking}</div>
            <div style={cssHelper}>{waterMarking}</div>
            <div style={cssHelper}>{waterMarking}</div>
          </div>
        )}
      </div>
      {flag && <img src={currentImage} className={styles.image} />}
    </div>
  );
}
