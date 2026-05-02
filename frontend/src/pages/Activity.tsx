import { ActivityFeed } from "@/components/features/ActivityFeed";

const Activity = () => (
  <div className="px-6 md:px-10 py-8 md:py-10 max-w-[900px] mx-auto">
    <div className="mb-8">
      <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">Activity</h1>
      <p className="text-text-secondary text-[14px] mt-1">A live feed of everything happening across your tools.</p>
    </div>
    <ActivityFeed />
  </div>
);

export default Activity;