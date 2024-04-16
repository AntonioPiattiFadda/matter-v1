import { Skeleton } from '@/components/ui/skeleton';

export function InvoiceTableSkeleton() {
  return (
    <div className="flex flex-col space-y-6">
      <div
        className="flex flex-row justify-between items-center m-6"
        style={{
          width: 'calc(100vw - 500px)',
        }}
      >
        <Skeleton className="h-[40px] w-[400px] rounded-xl" />
        <Skeleton className="h-[40px] w-[150px] rounded-xl" />
      </div>
      <div
        className="flex flex-row justify-between items-center m-6"
        style={{
          width: 'calc(100vw - 500px)',
        }}
      >
        <Skeleton className="h-[700px] w-[100%] rounded-xl" />
      </div>
    </div>
  );
}
