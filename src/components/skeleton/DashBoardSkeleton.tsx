import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardDescription, CardTitle } from '../ui/card';
import matterLogo from '../../assets/matterLogo.png';
import { Button } from '../ui/button';

const style = {
  background: 'linear-gradient(90deg, #F8FAFC 0%, #E2E8F0 100%)',
};

export function DashboardSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Card
        className="w-[400px] sm-w-screen h-screen rounded-none p-6"
        style={{
          borderTop: 'none',
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      >
        <CardTitle className="mb-6">
          {' '}
          <img className="h-7" src={matterLogo} alt="Matter Logo" />
        </CardTitle>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[16px] w-[200px] rounded-xl" style={style} />
          <Skeleton
            className="h-[16px] w-[150px] rounded-xl bg-slate-200"
            style={style}
          />
          <Skeleton
            className="h-[16px] w-[100px] rounded-xl bg-slate-200"
            style={style}
          />
        </div>
        <div
          style={{ height: 'calc(100vh - 160px)' }}
          className="flex flex-col justify-end"
        >
          <div className="flex flex-col gap-2">
            <Skeleton
              className="h-[16px] w-[100px] rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[16px] w-[150px] rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[16px] w-[200px] rounded-xl bg-slate-200"
              style={style}
            />
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <Skeleton
              className="h-[16px] w-[100px] rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[16px] w-[150px] rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[16px] w-[200px] rounded-xl bg-slate-200"
              style={style}
            />
          </div>
          <CardDescription>
            <div className="flex w-full gap-3 mt-6">
              <Button
                className="flex p-1 text-slate-400 text-sm	"
                disabled
                variant="link"
              >
                Log Out
              </Button>
              <Button
                className="flex p-1 text-slate-400 text-sm	"
                variant="link"
                disabled
              >
                Support
              </Button>
            </div>
          </CardDescription>
        </div>
      </Card>

      <div className="hidden  sm:flex flex-col w-full bg-white rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center w-full h-24 pl-6 pr-6">
          <Skeleton
            className="h-[16px] w-[200px] rounded-xl bg-slate-200"
            style={style}
          />
        </div>
        <div
          className="p-6 bg-slate-100 border"
          style={{
            height: 'calc(100vh - 6rem)',
          }}
        >
          <div className="flex flex-col gap-3">
            <Skeleton
              className="h-[16px] w-[200px] rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[40px]  rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[40px]  rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[40px]  rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[40px]  rounded-xl bg-slate-200"
              style={style}
            />
            <Skeleton
              className="h-[40px]  rounded-xl bg-slate-200"
              style={style}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
