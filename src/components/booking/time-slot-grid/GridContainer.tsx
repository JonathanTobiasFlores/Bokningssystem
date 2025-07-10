import { memo, ReactNode } from 'react';

export const GridContainer = memo(({ 
  children, 
}: { 
  children: ReactNode; 
}) => {
  return (
    <div className="border border-[#BDBDBD] rounded-lg">
      {children}
    </div>
  );
});
GridContainer.displayName = "GridContainer";