import { PageShell, Section } from './PageComponents';

export function PrivacyPage({ goHome }) {
  return (
    <PageShell goHome={goHome} title="Privacy Policy"
      subtitle="Last updated: June 1, 2026. PRIMEWORLDNEWS is committed to protecting your privacy and being transparent about how we collect and use information.">

      <Section label="Information We Collect">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { heading: 'Information You Provide', body: 'When you create an account, subscribe to our newsletter, submit a comment, or contact us, we may collect your name, email address, and any message content you choose to share. Journalist accounts may also include a professional bio and profile photo.' },
            { heading: 'Automatically Collected Data', body: 'We collect standard log data including IP address, browser type, device information, referring URLs, and pages viewed. We use this data to operate the site, prevent abuse, measure readership, and improve our journalism.' },
            { heading: 'Cookies', body: 'We use essential cookies to maintain your login session and remember preferences. Analytics and advertising partners may set additional cookies. You can manage cookie preferences through your browser settings.' },
          ].map(b => (
            <div key={b.heading} style={{ background: 'var(--d2)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 22px' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2, color: 'var(--gold)', marginBottom: 10 }}>{b.heading}</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="How We Use Your Information">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          We use collected information to deliver and personalise our news service, send newsletters you have subscribed to,
          moderate comments, respond to inquiries, analyse site performance, comply with legal obligations, and — where you
          have consented — serve relevant advertising through partners such as Google AdSense.
        </p>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          We do not sell your personal information to third parties. We may share data with service providers who assist
          in hosting, email delivery, analytics, and advertising, subject to contractual confidentiality obligations.
        </p>
      </Section>

      <Section label="Your Rights">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data,
          and to opt out of marketing communications. To exercise these rights, contact us at{' '}
          <a href="mailto:privacy@primeworld.news" style={{ color: 'var(--gold)' }}>privacy@primeworld.news</a>.
          EU/UK residents may also lodge a complaint with their local data protection authority.
        </p>
      </Section>

      <Section label="Contact">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          Questions about this policy? Email{' '}
          <a href="mailto:privacy@primeworld.news" style={{ color: 'var(--gold)' }}>privacy@primeworld.news</a>.
        </p>
      </Section>
    </PageShell>
  );
}
