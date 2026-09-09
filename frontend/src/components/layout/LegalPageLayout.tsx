import { type ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  updatedDate?: string;
  children: ReactNode;
}

const LegalPageLayout = ({ title, updatedDate, children }: LegalPageLayoutProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {updatedDate && <p className="text-xs text-gray-400 mb-8">Last updated: {updatedDate}</p>}
      <div className="prose prose-sm max-w-none text-gray-700 space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
};

export default LegalPageLayout;
