import LegalPageLayout from "../../components/layout/LegalPageLayout";

const TermsOfService = () => {
  return (
    <LegalPageLayout title="Terms of Service">
      <div className="legal-doc max-w-[70ch] space-y-4">
        <style>{`
          .legal-doc { counter-reset: section; }
          .legal-doc > h2 {
            counter-increment: section;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 2.75rem;
            padding-top: 1.25rem;
            border-top: 1px solid #ece1d0;
          }
          .legal-doc > h2:first-of-type {
            margin-top: 0;
            padding-top: 0;
            border-top: 0;
          }
          .legal-doc > h2::before {
            content: counter(section, decimal-leading-zero);
            display: block;
            font-family: var(--font-sans);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2em;
            color: #d18029;
            margin-bottom: 0.35rem;
          }
          .legal-doc p { line-height: 1.75; color: #4a3f39; }
          .legal-doc a {
            color: #c01e2e;
            text-decoration-color: rgba(192, 30, 46, 0.4);
            text-underline-offset: 3px;
          }
          .legal-doc a:hover { color: #9e1526; }
          .legal-doc li::marker { color: #c01e2e; }
          .legal-doc strong { color: #2f211b; }
        `}</style>

        <h2>Overview</h2>
        <p>
          By accessing or using ElysianEcommerce, you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use this site.
        </p>

        <h2>Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and password, and for
          all activity that occurs under your account.
        </p>

        <h2>Products and pricing</h2>
        <p>
          Prices and product availability are subject to change without notice. We reserve the right to
          limit quantities, refuse orders, or discontinue products at our discretion.
        </p>

        <h2>Prohibited use</h2>
        <p>
          You agree not to use this site for any unlawful purpose, to submit false information, or to
          interfere with the security or normal operation of the site.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          This site and its products are provided "as is" without warranties of any kind. We are not
          liable for indirect, incidental, or consequential damages arising from your use of the site.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms of Service at any time. Continued use of the site after changes are
          posted constitutes acceptance of the updated terms.
        </p>
      </div>
    </LegalPageLayout>
  );
};

export default TermsOfService;
