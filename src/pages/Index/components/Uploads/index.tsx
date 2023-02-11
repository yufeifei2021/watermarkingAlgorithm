import { message, Upload, UploadProps } from '@aloudata/aloudata-design';
import { RcFile } from '@aloudata/aloudata-design/es/Upload';
import { DownloadLine } from '@aloudata/icons-react';
import styles from './index.less';

interface IProps {
  currentImg: string;
  setCurrentImg: Function;
  currentImgFile?: File;
  setCurrentImgFile?: Function;
}

export default function Uploads({
  currentImg,
  setCurrentImg,
  setCurrentImgFile,
}: IProps) {
  const { Dragger } = Upload;

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const props: UploadProps = {
    name: 'file',
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        if (!info.file.url && !info.file.preview) {
          info.file.preview = await getBase64(
            info.file.originFileObj as RcFile,
          );
        }
        if (setCurrentImgFile) {
          setCurrentImgFile(info.file.originFileObj as RcFile);
        }
        setCurrentImg(info.file.preview);
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
    <div className={styles.leftContent}>
      {currentImg ? (
        <img className={styles.img} src={currentImg} />
      ) : (
        <Dragger {...props}>
          <div className={styles.fileUpload}>
            <div className={styles.file}>
              <DownloadLine />
            </div>
            <div className={styles.file}>
              原图上传
              <p className={styles.fileText}>
                图像格式仅支持上传JPEG、PNG、SVG
              </p>
            </div>
          </div>
        </Dragger>
      )}
    </div>
  );
}
