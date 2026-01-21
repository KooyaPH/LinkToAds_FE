import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-white hover:text-zinc-300 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Main Title */}
        <h1 className="mb-4 text-4xl font-bold text-white">
          Terms of Service
        </h1>

        {/* Last Updated Date */}
        <p className="mb-12 text-sm text-zinc-400">
          Last updated: January 4, 2025
        </p>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              1. Agreement to Terms
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using LinkToAds, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              2. Use License
            </h2>
            <p className="mb-4 text-zinc-300 leading-relaxed">
              Permission is granted to temporarily use LinkToAds for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-zinc-300">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on LinkToAds</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or mirror the materials on any other server</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              3. Service Description
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              LinkToAds provides AI-powered ad generation services. We use artificial intelligence to analyze your website and create advertising content. While we strive to provide high-quality outputs, the generated content should be reviewed before use in any advertising campaign.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              4. Account Responsibilities
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              5. Intellectual Property
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              The content generated through our service is owned by you, the user. However, LinkToAds retains all rights to the underlying technology, algorithms, and platform. You may not claim ownership of our technology or use it to create competing services.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              6. Payment Terms
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Certain features of LinkToAds require payment. By subscribing to a paid plan, you agree to pay all fees associated with your chosen plan. Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              7. Limitation of Liability
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              In no event shall LinkToAds or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our services, even if we have been notified of the possibility of such damage.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              8. Modifications
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              LinkToAds may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              9. Governing Law
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              10. Contact Us
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:legal@linktoads.com"
                className="text-white underline hover:text-zinc-300 transition-colors"
              >
                legal@linktoads.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
