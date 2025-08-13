import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import "./tailwind.css";
import {
  useTheme,
  ThemeProvider,
  PreventFlashOnWrongTheme,
} from "remix-themes";
import { themeSessionResolver } from "./sessions.server";
import { AuthProvider } from "~/components/auth/auth-context";
import clsx from "clsx";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    href: "/favicon.svg",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

async function loadPreline() {
  return import("preline/dist/index.js");
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();

      const anyGlobal = globalThis as unknown as { HSStaticMethods?: { autoInit?: () => void } };
      if (
        anyGlobal?.HSStaticMethods &&
        typeof anyGlobal.HSStaticMethods.autoInit === "function"
      ) {
        anyGlobal.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, [location.pathname]);
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://tally.so/widgets/embed.js"></script>
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="selection:bg-emerald-600 selection:text-white dark:selection:bg-emerald-800">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}
