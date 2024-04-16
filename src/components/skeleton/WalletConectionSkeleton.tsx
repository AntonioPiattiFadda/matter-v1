import { Skeleton } from '@/components/ui/skeleton';

export function WalletConectionSkeleton() {
  return (
    <div className="flex flex-col space-y-6  m-6">
      <Skeleton className="h-[40px] w-[100px] rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-[20px] w-[200px] " />
        <Skeleton className="h-[50px] w-[340px] " />
        <Skeleton className="h-[20px] w-[200px] " />
        <Skeleton className="h-[50px] w-[340px] " />
        <Skeleton className="h-[20px] w-[200px] " />
        <Skeleton className="h-[50px] w-[340px] " />
      </div>
    </div>
  );
}
