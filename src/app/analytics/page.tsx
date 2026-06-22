
/**
 * Analytics page — server component wrapper.
 *
 * Recharts (~380 KB) is deferred via dynamic() with ssr:false so it never
 * blocks the initial HTML response. The skeleton from loading.tsx covers the
 * brief fetch gap.
 */
import AnalyticsClient from "./AnalyticsClient";

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
