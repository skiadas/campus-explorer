import React, { ReactElement, useRef } from 'react';
import { VideoPlayer } from './VideoPlayer';
import './Camera.css';

interface CameraProps {
  onScreenshot?: (dataUrl: string) => void;
}

export function Camera({ onScreenshot }: CameraProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  function saveImage(): void {
    if (!canvasRef.current) return;
    const src = canvasRef.current.toDataURL().replace('image/png', 'image/octet-stream');
    if (onScreenshot) onScreenshot(src);
  }
  return (
    <section>
      <div className="cameraImage" style={{ position: 'relative' }}>
        <VideoPlayer ref={canvasRef} />
        {/* <img ref={imgRef} width="100%" style={{ position: 'absolute' }}></img> */}
        <button style={{ position: 'absolute' }} onClick={saveImage}>
          Save Image
        </button>
      </div>
    </section>
  );
}
