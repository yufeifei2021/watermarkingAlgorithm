import { Button } from '@aloudata/aloudata-design';
import { ArrowsRightSmLine } from '@aloudata/icons-react';
import { history } from 'umi';
import AddOrExtract from '../Index/components/AddOrExtract';
import styles from './index.less';

export default function AddExtractWatermark() {
  const handleReturn = () => {
    history.push('/buttons');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <div className={styles.iconLeft}>添加/提取水印</div>
          <div className={styles.iconRight}>
            <Button onClick={handleReturn}>
              <span>返回</span>
              <ArrowsRightSmLine />
            </Button>
          </div>
        </div>
        <div>
          <AddOrExtract />
        </div>
      </div>
    </div>
  );
}
