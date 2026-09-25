import { Avatar, AvatarFallback, AvatarImage, cn } from '@qlp/ui';
import { DataTableCellVariant } from '../types';

interface DataTableCellProps {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  variant?: DataTableCellVariant;
}

export default function DataTableCell({ className, variant, value }: DataTableCellProps) {
  if (variant === DataTableCellVariant.TEXT) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.NUMBER) {
    return <div className={className}>{value}</div>;
  } else if (variant === DataTableCellVariant.DATE) {
    if (!value) return <div className={className}>No Date</div>;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return <div className={className} />;
    return <div className={className}>{date.toLocaleDateString()}</div>;
  } else if (variant === DataTableCellVariant.DATE_TIME) {
    if (!value) return <div className={className}>No Date</div>;
    return (
      <div className="flex items-start flex-col">
        <div>{value?.toLocaleDateString()}</div>
        <div className="text-muted-foreground">{value?.toLocaleTimeString()}</div>
      </div>
    );
  } else if (variant === DataTableCellVariant.AVATAR) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Avatar className="h-6 w-6 shrink-0">
          <AvatarImage src={value?.src || value?.url} />
          <AvatarFallback className="text-[10px]">{value?.fallback}</AvatarFallback>
        </Avatar>
        {value?.label && <span>{value.label}</span>}
      </div>
    );
  }
  return <div className={className}>{value}</div>;
}
