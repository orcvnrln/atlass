import React from 'react';
import { useDrag } from '@use-gesture/react';
import { toast } from '@/components/ui/use-toast';

const MobileProWrapper = ({ children }) => {
  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX !== 0) {
      const direction = swipeX > 0 ? 'right' : 'left';
      toast({
        title: `Swiped ${direction}!`,
        description: 'Mobile Pro Gestures are a work in progress.',
      });
    }
  });

  return (
    <div {...bind()} className="touch-none">
      {children}
    </div>
  );
};

export default MobileProWrapper;
