import type { Metadata } from 'next';
import ToolWrapper from '../components/ToolWrapper';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy – Good Patrone',
  description: 'Privacy policy for Good Patrone. Learn how we handle your data when using our free online tools.',
  alternates: { canonical: 'https://goodpatrone.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <ToolWrapper
      title="Privacy Policy"
      subtitle="Last updated: February 2026"
      icon={<ShieldCheck size={17} className="text-gray-400" />}
      adSlot="privacy"
    >
      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">

        <p>
          This Privacy Policy describes how Good Patrone ("we", "us", or "our") handles
          information when you use our website at <strong className="text-gray-300">goodpatrone.com</strong>.
        </p>

        {[
          {
            title: '1. Information we collect',
            content: `We do not require you to create an account or provide personal information to use any of our tools.
            When you visit our website, basic technical data may be automatically collected by our hosting provider
            (Netlify) and analytics tools, including your IP address, browser type, operating system, referring URLs,
            and pages visited. This data is used solely for operating and improving the service.`,
          },
          {
            title: '2. Cookies',
            content: `We may use essential cookies to ensure the website functions correctly. If advertising is enabled
            on our site (via Google AdSense), third-party cookies may be placed by Google to serve personalised
            advertisements based on your browsing behaviour. You can opt out of personalised ads at
            g.co/adsettings or by using your browser's cookie settings.`,
          },
          {
            title: '3. Google AdSense',
            content: `We use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies
            to serve ads based on your prior visits to our website or other websites. Google's use of advertising
            cookies enables it and its partners to serve ads based on your visit to our site and/or other sites
            on the internet. You may opt out of personalised advertising by visiting Google's Ads Settings.`,
          },
          {
            title: '4. Analytics',
            content: `We may use analytics tools (such as Google Analytics) to understand how visitors interact with
            our website. Data collected is anonymised and aggregated. We do not sell this data to third parties.`,
          },
          {
            title: '5. Data retention',
            content: `We do not store any personal data on our servers. Any data processed by third-party services
            (Google, Netlify) is subject to their respective privacy policies.`,
          },
          {
            title: '6. Third-party links',
            content: `Our website may contain links to third-party websites. We are not responsible for the
            privacy practices of those sites and encourage you to read their privacy policies.`,
          },
          {
            title: '7. Children\'s privacy',
            content: `Our services are not directed at children under 13. We do not knowingly collect personal
            information from children under 13. If you believe a child has provided us with personal information,
            please contact us so we can delete it.`,
          },
          {
            title: '8. Changes to this policy',
            content: `We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated date. Continued use of the site after changes constitutes acceptance of the new policy.`,
          },
          {
            title: '9. Contact',
            content: `If you have any questions about this Privacy Policy, please contact us at: hello@goodpatrone.com`,
          },
        ].map(section => (
          <div key={section.title}>
            <div className="h-px bg-white/5 mb-4" />
            <h2 className="text-white font-bold text-xs uppercase tracking-widest mb-2">{section.title}</h2>
            <p className="text-gray-500 text-xs leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="h-px bg-white/5" />
        <p className="text-xs text-gray-700 text-center">
          © 2026 Good Patrone ·{' '}
          <a href="/contact" className="hover:text-gray-400 transition-colors">Contact</a>
        </p>

      </div>
    </ToolWrapper>
  );
}
