import type { MetaFunction } from "@remix-run/node";
import MapComponent from "~/components/map-component";
import { Analytics } from "@vercel/analytics/remix";
export const meta: MetaFunction = () => {
  return [
    { title: "Umap" },
    {
      name: "Get direction",
      content:"you can navigate and find locations from where you are",
    },
  ];
};

export default function Index() {
  return (
    <div className="relative flex h-svh items-center justify-center">
      <Analytics />
      <MapComponent />
    </div>
  );
}
