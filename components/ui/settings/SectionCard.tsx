import React from "react";

interface SectionCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mobile:p-5 mb-5">
      <h2 className="font-lato text-lg font-bold text-gray-900 mb-1">
        {title}
      </h2>
      <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}
