// https://davidwalsh.name/browser-camera
// https://davidwalsh.name/convert-canvas-image
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  RefObject,
} from 'react';
import PhotoPreview from '@/components/PhotoPreview';
import Camera from '@/components/Camera';
import { Button } from 'antd';
import styles from './CameraAPI.less';

// 整体尺寸以预览的高度为基准
const PREVIEW_HEIGHT = 266;

const CameraAPI: React.FC = () => {
  const [actionCount, setActionCount] = useState(0);
  const onPhotoConfirm = useCallback(
    (canvasRef: RefObject<HTMLCanvasElement>) => {
      if (canvasRef && canvasRef.current) {
        // 输出dataUrl
        alert('请到控制台查看');
        console.log(canvasRef.current.toDataURL('image/png'));
      }
    },
    [],
  );
  const onSnapPhoto = useCallback(() => {
    setActionCount(count => count + 1);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className={styles.takePhotos}>
      <div className={styles.photoWrapper}>
        <PhotoPreview
          height={PREVIEW_HEIGHT}
          videoRef={videoRef}
          canvasRef={canvasRef}
          actionCount={actionCount}
        ></PhotoPreview>
        <p className={styles.title}>考试头像</p>
        <p className={styles.subtitle}>
          为了保证考试正常进行，请先安装摄像头设备！
        </p>
        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            onClick={() => onPhotoConfirm(canvasRef)}
          >
            确定
          </Button>
        </div>
      </div>
      <div className={styles.cameraWrapper}>
        <Camera width={382} height={382} videoRef={videoRef}></Camera>
        <div className={styles.actions}>
          <Button type="primary" size="large" onClick={onSnapPhoto}>
            拍摄
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CameraAPI;