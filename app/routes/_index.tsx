import type { MetaFunction } from "@remix-run/node";
import MapComponent from "~/components/map-component";
import { Analytics } from "@vercel/analytics/remix";
export const meta: MetaFunction = () => {
  return [
    { title: "OpenIndoorMaps" },
    {
      name: "description",
      content:
        "OpenIndoorMaps is a community-based tool that helps people navigate large indoor spaces like malls, airports, hospitals, and universities. Collaborate and add your building to help others find their way.",
    },
  ];
};

export default function Index() {
  return (
    <div className="relative flex h-svh items-center justify-center">
      <Analytics />
      <MapComponent />

      {/* Preline Test Link */}
      <div className="absolute top-4 right-4 z-10">
        <a
          href="/preline-test"
          className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Test Preline
        </a>
      </div>
    </div>
  );
}
