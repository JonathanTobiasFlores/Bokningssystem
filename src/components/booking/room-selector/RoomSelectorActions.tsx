import { Button } from '@/components/ui/button';

interface RoomSelectorActionsProps {
  onConfirm: () => void;
  onDeselectAll: () => void;
}

export function RoomSelectorActions({ onConfirm, onDeselectAll }: RoomSelectorActionsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        onClick={onConfirm}
        className="w-[145px] h-[48px] p-4 rounded-2xl bg-[#1D1D1D] text-white border border-white/10 backdrop-blur-[25px] flex items-center justify-center"
      >
        Välj
      </Button>
      <Button
        onClick={onDeselectAll}
        className="w-[145px] h-[48px] p-4 rounded-2xl bg-[#3C3C3C] text-white border border-white/10 backdrop-blur-[25px] flex items-center justify-center"
      >
        Avmarkera
      </Button>
    </div>
  );
}