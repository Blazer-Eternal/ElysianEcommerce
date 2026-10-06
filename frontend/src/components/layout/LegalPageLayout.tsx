import { type ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  updatedDate?: string;
  children: ReactNode;
}

const LegalPageLayout = ({ title, updatedDate, children }: LegalPageLayoutProps) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14 sm:px-6 lg:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-2">{title}</h1>
      {updatedDate && <p className="text-xs tracking-wide text-ink/65 mb-8">Last updated: {updatedDate}</p>}
      <div className="prose prose-sm max-w-none text-ink/75 mt-8 border-t border-[#ece1d0] pt-8 space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-brand [&_a]:underline [&_a]:decoration-brand/40 hover:[&_a]:decoration-brand [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
};

export default LegalPageLayout;
