import React, { useState, useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PhotoPreview from '..';

describe('PhotoPreview', () => {
  let video,
    image,
    src = 'https://www.w3school.com.cn/i/eg_tulip.jpg',
    previewHeight = 300;

  it('Render video correctly', async () => {
    const Demo = () => {
      const [actionCount, setActionCount] = useState(0);
      const videoRef = useRef(null);
      const canvasRef = useRef(null);

      function drawFrameOfVideo() {
        setActionCount(count => count + 1);
      }
      return (
        <div>
          <PhotoPreview
            height={previewHeight}
            videoRef={videoRef}
            canvasRef={canvasRef}
            actionCount={actionCount}
          ></PhotoPreview>
          <video
            ref={videoRef}
            src="https://www.w3school.com.cn/i/movie.ogg"
          ></video>
          <button onClick={drawFrameOfVideo}>test{actionCount}</button>
        </div>
      );
    };
    render(<Demo></Demo>);
    expect(canvasRef.current).not.toBe(null);
    const button = screen.getByText('test0');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(await screen.findByText('test1')).toBeInTheDocument();
    // if (canvasRef.current) {
    //   expect(canvasRef.current.width).toBe(previewHeight);
    //   expect(canvasRef.current.height).toBe(previewHeight);
    // }
  });

  it('Render image correctly', () => {});

  it('Render src correctly', () => {});
});
