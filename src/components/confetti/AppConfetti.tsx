import { ConfettiConfig } from '@/types';
import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';

const AppConfetti = () => {
  const [someProps, setSomeProps] = useState(false);

  const config: ConfettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 94,
    dragFriction: 0.09,
    duration: 3940,
    stagger: 8,
    width: '10px',
    height: '24px',
    perspective: '500px',
    colors: ['#A855F7', '#60A5FA', '#86EFAC', '#F87171', '#FEF08A'],
  };

  useEffect(() => {
    setTimeout(() => {
      setSomeProps(true);
    }, 1000);
  }, []);

  return <Confetti active={someProps} config={config} />;
};

export default AppConfetti;
