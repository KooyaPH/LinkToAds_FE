import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
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
              1. Introduction
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Welcome to LinkToAds. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              2. Information We Collect
            </h2>
            <p className="mb-4 text-zinc-300 leading-relaxed">
              We may collect, use, store and transfer different kinds of personal data about you, including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-zinc-300">
              <li><strong className="text-white">Identity Data:</strong> name, username, or similar identifier</li>
              <li><strong className="text-white">Contact Data:</strong> email address</li>
              <li><strong className="text-white">Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types</li>
              <li><strong className="text-white">Usage Data:</strong> information about how you use our website and services</li>
              <li><strong className="text-white">Marketing Data:</strong> your preferences in receiving marketing from us</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              3. How We Use Your Information
            </h2>
            <p className="mb-4 text-zinc-300 leading-relaxed">
              We use your personal data for the following purposes:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-zinc-300">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              4. Data Security
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              5. Your Rights
            </h2>
            <p className="mb-4 text-zinc-300 leading-relaxed">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-zinc-300">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              6. Cookies
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">
              7. Contact Us
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:privacy@linktoads.com"
                className="text-white underline hover:text-zinc-300 transition-colors"
              >
                privacy@linktoads.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
