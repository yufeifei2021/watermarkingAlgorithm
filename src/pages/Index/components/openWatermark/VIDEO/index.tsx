import { message, UploadProps } from '@aloudata/aloudata-design';
import { RcFile } from '@aloudata/aloudata-design/es/Upload';
import { DownloadLine } from '@aloudata/icons-react';
import { useMount } from 'ahooks';
import Dragger from 'antd/lib/upload/Dragger';
import { useState } from 'react';
import styles from './index.less';

interface IProps {
  flag: boolean;
  waterMark: string;
}

interface ICss {
  [x: string]: string | number;
}

export default function VIDEO({ flag, waterMark }: IProps) {
  const [cssHelper, setCssHelper] = useState<ICss>();
  const [currentFile, setCurrentFile] = useState<string>('');

  useMount(() => {
    if (waterMark) {
      setCssHelper({
        width: '300px',
        fontSize: `16px`,
        color: '#000',
        lineHeight: 1.5,
        opacity: 0.2,
        transform: `rotate(-10deg)`,
        transformOrigin: '0 0',
        userSelect: 'none',
      });
    }
  });

  const props: UploadProps = {
    name: 'file',
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        if (!info.file.url && !info.file.preview) {
          const url = window.webkitURL.createObjectURL(
            info.file.originFileObj as RcFile,
          );
          setCurrentFile(url);
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {flag && (
          <div className={styles.video}>
            {currentFile ? (
              <video
                id="example_video"
                width="350"
                height="250"
                controls
                poster=""
              >
                <source src={currentFile} type="video/mp4"></source>
              </video>
            ) : (
              <div className={styles.leftContent}>
                <Dragger {...props}>
                  <div className={styles.fileUpload}>
                    <div className={styles.file}>
                      <DownloadLine />
                    </div>
                    <div className={styles.file}>
                      视频上传
                      <p className={styles.fileText}>视频格式仅支持上传mp4</p>
                    </div>
                  </div>
                </Dragger>
              </div>
            )}
          </div>
        )}
        {currentFile && (
          <div className={styles.wrapperContent}>
            <div style={cssHelper}>{waterMark}</div>
            <div style={cssHelper}>{waterMark}</div>
          </div>
        )}
      </div>
    </div>
  );
}
