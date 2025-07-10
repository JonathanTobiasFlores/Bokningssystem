import { memo } from 'react';
import { Button } from '@/components/ui/button';

interface RoomSelectorErrorProps {
  error: string;
  onRetry: () => void;
}

export const RoomSelectorError = memo(({ 
  error, 
  onRetry 
}: RoomSelectorErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="cta">
        Försök igen
      </Button>
    </div>
  );
});

RoomSelectorError.displayName = 'RoomSelectorError';