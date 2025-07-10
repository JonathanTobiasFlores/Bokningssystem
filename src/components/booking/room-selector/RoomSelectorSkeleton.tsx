import { Skeleton } from '@/components/ui/skeleton';

export function RoomSelectorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[200px]">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-5 rounded-[2px]" />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="w-[145px] h-[48px] rounded-2xl" />
        <Skeleton className="w-[145px] h-[48px] rounded-2xl" />
      </div>
    </div>
  );
}