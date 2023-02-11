import { Button, Input, Modal } from '@aloudata/aloudata-design';
import { UserCircleLine } from '@aloudata/icons-react';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

interface IProps {
  userName: string;
  userPhone: string;
}

export default function Buttons() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  useMount(() => {
    const message = window.localStorage.getItem('userMsg');
    if (message) {
      const messageMap: IProps = JSON.parse(message);
      setUserName(messageMap.userName);
      setUserPhone(messageMap.userPhone);
    }
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  /**
   * 登出
   */
  const handleLoginOut = () => {
    history.push('/');
    setIsModalVisible(false);
  };

  /**
   * 详情
   */
  const handleDetail = () => {
    setIsModalVisible(false);
  };
  const handleOtherDetail = () => {
    setIsDetailVisible(true);
  };

  /**
   * 取消
   */
  const cancel = () => {
    setIsDetailVisible(false);
  };

  const footer = (
    <Button size="large" onClick={cancel}>
      取消
    </Button>
  );

  const Footer = (
    <div className={styles.footer}>
      <div>
        <Button size="large" onClick={handleOtherDetail}>
          详情
        </Button>
        <Modal
          title="用户信息登录"
          visible={isDetailVisible}
          footer={footer}
          onCancel={cancel}
        >
          <div className={styles.wrapperCenter}>
            <div className={styles.message}>
              <div className={styles.header}>用户名：</div>
              <Input disabled value={userName} />
            </div>
            <div className={styles.message}>
              <div className={styles.header}>手机号：</div>
              <Input disabled value={userPhone} />
            </div>
          </div>
        </Modal>
      </div>
      <Button type="primary" size="large" onClick={handleLoginOut}>
        登出
      </Button>
    </div>
  );

  /**
   * 添加提取水印
   */
  const handleAddExtractWatermark = () => {
    history.push('/buttons/addExtractWatermark');
  };

  /**
   * 水印叠加
   */
  const handleWatermarkSuperposition = () => {
    history.push('/buttons/watermarkSuperposition');
  };

  /**
   * 鲁棒性对比
   */
  const handleRobustness = () => {
    history.push('/buttons/robustness');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperContent}>
          <div className={styles.icon}>
            <Modal
              title="个人信息"
              visible={isModalVisible}
              footer={null}
              onCancel={handleDetail}
            >
              {Footer}
            </Modal>
            <UserCircleLine fill="rgba(0, 26, 51, 0.7)" onClick={showModal} />
          </div>
          <div className={styles.contentButton}>
            <Button size="large" onClick={handleAddExtractWatermark}>
              添加提取水印
            </Button>
          </div>
          <div className={styles.contentButton}>
            <Button size="large" onClick={handleWatermarkSuperposition}>
              水印叠加
            </Button>
            <Button size="large" onClick={handleRobustness}>
              鲁棒性对比
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
