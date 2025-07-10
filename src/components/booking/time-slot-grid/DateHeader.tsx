import { memo } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export const DateHeader = memo(({ date }: { date: Date }) => (
  <div className="text-center p-2 font-medium capitalize border-r border-[#BDBDBD] last:border-r-0">
    {format(date, "eee d", { locale: sv })}
  </div>
));
DateHeader.displayName = "DateHeader";