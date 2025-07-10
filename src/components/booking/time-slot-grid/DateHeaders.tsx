import { memo, useMemo } from 'react';
import { DateHeader } from './DateHeader';

export const DateHeaders = memo(({ dates }: { dates: Date[] }) => {
  const gridStyle = useMemo(() => ({
    display: "grid",
    gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
  }), [dates.length]);

  return (
    <div style={gridStyle} className="border-b border-[#BDBDBD]">
      {dates.map((date) => (
        <DateHeader key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`} date={date} />
      ))}
    </div>
  );
});
DateHeaders.displayName = "DateHeaders";