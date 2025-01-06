import { LoaderPage } from "@/components/LoaderPage";
import { Suspense } from "react";

function AppLayout({ children }) {
  return (
    <Suspense fallback={<LoaderPage />}>
      <div className="min-h-screen">
        <div className="flex w-full h-full">
          <div className="fixed bg-slate-600 top-0 left-0 lg:w-[264px] hidden lg:block h-full overflow-auto">
            {/* <Sidebar /> */}
            sidebar
          </div>
          <div className="lg:pl-[264px] w-full">
            <div className="mx-auto max-w-screen-2xl h-full">
              {/* <Navbar /> */}
              navbar
              <main className="h-full mx-auto py-8 px-6 flex flex-col">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

// Simple Navbar Component

export default AppLayout;
