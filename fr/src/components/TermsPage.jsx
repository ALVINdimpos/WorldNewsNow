import { PageShell, Section } from './PageComponents';

export function TermsPage({ goHome }) {
  return (
    <PageShell goHome={goHome} title="Terms of Use"
      subtitle="Last updated: June 1, 2026. By accessing PRIMEWORLDNEWS you agree to these terms. Please read them carefully.">

      <Section label="Use of Our Service">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          PRIMEWORLDNEWS provides news and editorial content for personal, non-commercial use unless otherwise agreed in writing.
          You may share links to our articles and quote brief excerpts with attribution. You may not republish full articles,
          scrape our content at scale, circumvent paywalls, or use automated tools to access the site in ways that impair its operation.
        </p>
      </Section>

      <Section label="Accounts & Comments">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          When you create an account or post a comment, you are responsible for the content you submit. Comments must not
          contain harassment, hate speech, spam, misinformation, or unlawful material. We reserve the right to remove comments
          and suspend accounts that violate our community standards or editorial policies.
        </p>
      </Section>

      <Section label="Intellectual Property">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          All articles, photographs, graphics, logos, and design elements on PRIMEWORLDNEWS are protected by copyright and
          other intellectual property laws. Content is owned by PRIMEWORLDNEWS or its licensors. Unauthorised reproduction is prohibited.
        </p>
      </Section>

      <Section label="Disclaimer">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          Our journalism is provided for informational purposes. While we strive for accuracy, we make no warranties that content
          is complete, current, or error-free. PRIMEWORLDNEWS is not liable for decisions made based on information published on this site.
        </p>
      </Section>

      <Section label="Advertising">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          We may display third-party advertising, including Google AdSense. Advertisers are solely responsible for their ad content.
          Our editorial coverage is independent of advertising relationships. See our Privacy Policy for data practices related to ads.
        </p>
      </Section>

      <Section label="Contact">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          Legal inquiries:{' '}
          <a href="mailto:legal@primeworld.news" style={{ color: 'var(--gold)' }}>legal@primeworld.news</a>
        </p>
      </Section>
    </PageShell>
  );
}
