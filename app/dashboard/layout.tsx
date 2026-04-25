import DashboardNavbar from "@/components/ui/DashboardNavbar";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Breadcrumbs />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default layout;
