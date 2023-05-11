import React, {
  ForwardedRef,
  MutableRefObject,
  ReactElement,
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react';
import { useScreenOrientation } from '../utils/useScreenOrientation';

type VideoPlayerProps = React.RefAttributes<HTMLCanvasElement>;

const constraints = {
  video: {
    facingMode: 'environment',
    width: 1080,
    height: 1080,
    aspectRatio: 1
  },
  audio: false
};

export const VideoPlayer = forwardRef(function VideoPlayer(
  // eslint-disable-next-line no-empty-pattern
  {}: VideoPlayerProps,
  canvasRef: ForwardedRef<HTMLCanvasElement>
): ReactElement {
  const [playerRef, playerDimensions, screenOrientation] = useScreenCapture();

  const internalCanvasRef = useCanvasCopy(playerRef);
  return (
    <>
      <video
        key={screenOrientation}
        ref={playerRef}
        id="player"
        autoPlay
        muted
        playsInline
        width="1px"
        height="1px"
        style={{ position: 'fixed', top: 0, left: 0 }}
      ></video>
      <canvas
        ref={(el): void => {
          internalCanvasRef.current = el;
          if (typeof canvasRef === 'function') canvasRef(el);
          else if (canvasRef != null) canvasRef.current = el;
        }}
        id="canvas"
        width={playerDimensions.width}
        height={playerDimensions.height}
      ></canvas>
    </>
  );
});

function useCanvasCopy(
  playerRef: React.MutableRefObject<HTMLVideoElement | null>
): React.MutableRefObject<HTMLCanvasElement | null> {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!internalCanvasRef.current || !playerRef.current) return;
    const player = playerRef.current;
    const canvas = internalCanvasRef.current;
    const id = setInterval(() => {
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(player, 0, 0, canvas.width, canvas.height);
    }, 100);
    return () => clearInterval(id);
  }, [internalCanvasRef.current, playerRef.current]);
  return internalCanvasRef;
}

function useScreenCapture(): [
  MutableRefObject<HTMLVideoElement | null>,
  { width: number; height: number },
  string
] {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const screenOrientation = useScreenOrientation();
  const [playerDimensions, setPlayerDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    let recoveredStream: MediaStreamTrack;
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      recoveredStream = stream.getVideoTracks()[0];
      player.onloadedmetadata = (): void => {
        setPlayerDimensions({
          width: player.videoWidth,
          height: player.videoHeight
        });
      };

      player.srcObject = stream;
    });
    return (): void => {
      if (recoveredStream) recoveredStream.stop();
      if (playerRef.current) playerRef.current.srcObject = null;
    };
  }, [screenOrientation]);
  return [playerRef, playerDimensions, screenOrientation];
}
