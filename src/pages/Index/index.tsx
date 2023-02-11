import { Button, Input, message } from '@aloudata/aloudata-design';
import { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

export default function IndexPage() {
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  const MAX_USERNAME_LENGTH = 10;
  const MAX_USERPHONE_LENGTH = 11;

  /**
   * 清空
   */
  const handleReset = () => {
    setUserName('');
    setUserPhone('');
  };

  /**
   * 登录
   */
  const handleConfirm = () => {
    if (checkRule()) {
      currentLocalStorage();
      history.push('/buttons');
    }
  };

  /**
   * 校验规则
   * @returns
   */
  const checkRule = () => {
    const reName = new RegExp('^[\u4E00-\u9FFF]+$');
    const rePhone = new RegExp('^[1]([3-9])[0-9]{9}$');
    // 用户名
    if (!userName) {
      message.error('请输入姓名.');
      return false;
    } else if (userName.length > MAX_USERNAME_LENGTH) {
      message.error('内容超出10字符,请重新输入.');
      setUserName('');
      return false;
    } else if (!reName.test(userName)) {
      message.error('用户名仅支持中文.');
      setUserName('');
      return false;
    }
    // 手机号
    if (!userPhone) {
      message.error('请输入手机号.');
      return false;
    } else if (userName.length > MAX_USERPHONE_LENGTH) {
      message.error('内容超出11字符,请重新输入.');
      setUserPhone('');
      return false;
    } else if (!rePhone.test(userPhone)) {
      message.error('请输入正确的手机号.');
      setUserPhone('');
      return false;
    }
    return true;
  };

  /**
   * 删除上一次信息，并且添加当前信息
   */
  const currentLocalStorage = () => {
    window.localStorage.removeItem('userMsg');
    const userMsg = {
      userName,
      userPhone,
    };
    window.localStorage.setItem('userMsg', JSON.stringify(userMsg));
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperCenter}>
          <div className={styles.title}>用户信息登录</div>
          <div className={styles.message}>
            <div className={styles.header}>用户名：</div>
            <Input
              placeholder="请输入用户名"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className={styles.message}>
            <div className={styles.header}>手机号：</div>
            <Input
              placeholder="请输入手机号"
              value={userPhone}
              onChange={(e) => {
                setUserPhone(e.target.value);
              }}
            />
          </div>
          <div className={styles.footer}>
            <Button onClick={handleReset}>清空</Button>
            <Button type="primary" onClick={handleConfirm}>
              登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
