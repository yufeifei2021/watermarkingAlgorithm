import { Button } from '@aloudata/aloudata-design';
import { ArrowsRightSmLine } from '@aloudata/icons-react';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { history } from 'umi';
import Superposition from '../Index/components/Superposition';
import styles from './index.less';

interface IUserMessage {
  userName: string;
  userPhone: string;
}

export default function Robustness() {
  const [waterMark, setWaterMark] = useState<string>('');

  useMount(() => {
    const userMessage = window.localStorage.getItem('userMsg');
    if (userMessage) {
      const messageMap: IUserMessage = JSON.parse(userMessage);
      setWaterMark(messageMap.userName + '-' + messageMap.userPhone);
    }
  });

  const handleTable = () => {
    history.push('/buttons/robustness/tableList');
  };

  const handleReturn = () => {
    history.push('/buttons');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <div className={styles.iconLeft}>鲁棒性对比</div>
          <div className={styles.iconRight}>
            <Button onClick={handleTable}>查看鲁棒性对比表格</Button>
            <Button onClick={handleReturn}>
              <span>返回</span>
              <ArrowsRightSmLine />
            </Button>
          </div>
        </div>
        <div>
          <Superposition waterMark={waterMark} flag={false} />
        </div>
      </div>
    </div>
  );
}
