import { useLayoutEffect } from 'react';
import { runOasis } from '@/pages/oasis';

export default function IndexPage() {
  useLayoutEffect(() => {
    runOasis().then();
  }, []);
  return (
    <canvas
      id="canvas"
      style={{ width: '100vw', height: '100vh', position: 'absolute' }}
    />
  );
}
