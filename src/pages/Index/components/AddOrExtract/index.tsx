import { Tabs } from '@aloudata/aloudata-design';
import { useState } from 'react';
import SaveDoubleImages from '../SaveDoubleImages';
import Uploads from '../Uploads';
import styles from './index.less';
import { darkList, lightList } from './type';

export default function AddOrExtract() {
  const [currentImg, setCurrentImg] = useState<string>('');
  const [currentImgFile, setCurrentImgFile] = useState<File>();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperContent}>
          <div className={styles.leftContent}>
            <Uploads
              currentImg={currentImg}
              setCurrentImg={setCurrentImg}
              currentImgFile={currentImgFile}
              setCurrentImgFile={setCurrentImgFile}
            />
          </div>
          <div className={styles.rightContent}>
            <Tabs
              destroyInactiveTabPane
              tabPosition="left"
              className={styles.tabs}
            >
              <Tabs.TabPane tab="明水印" key="light">
                <Tabs destroyInactiveTabPane className={styles.tabs}>
                  {lightList.map((item) => {
                    return (
                      <Tabs.TabPane tab={item.tab} key={item.key}>
                        <SaveDoubleImages
                          currentImg={currentImg}
                          currentImgFile={currentImgFile}
                          currentWaterMarking={item.tab}
                        />
                      </Tabs.TabPane>
                    );
                  })}
                </Tabs>
              </Tabs.TabPane>
              <Tabs.TabPane tab="暗水印" key="dark">
                <Tabs destroyInactiveTabPane className={styles.tabs}>
                  {darkList.map((item) => {
                    return (
                      <Tabs.TabPane tab={item.tab} key={item.key}>
                        <SaveDoubleImages
                          currentImg={currentImg}
                          currentImgFile={currentImgFile}
                          currentWaterMarking={item.tab}
                        />
                      </Tabs.TabPane>
                    );
                  })}
                </Tabs>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
