import { PageShell, Section } from './PageComponents';

export function EditorialPage({ goHome }) {
  return (
    <PageShell goHome={goHome} title="Editorial Standards"
      subtitle="PRIMEWORLDNEWS is committed to accurate, independent, and ethical journalism. These standards guide every story we publish.">

      <Section label="Independence">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          Our newsroom operates independently of advertisers, political parties, and corporate owners. No advertiser,
          sponsor, or external party may review or approve editorial content before publication. Journalists disclose
          any potential conflicts of interest.
        </p>
      </Section>

      <Section label="Accuracy & Corrections">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
          Every story is fact-checked before publication. We verify claims with primary sources wherever possible.
          When we make an error, we publish a prominent correction noting what changed and when. Readers can report
          errors to{' '}
          <a href="mailto:corrections@primeworld.news" style={{ color: 'var(--gold)' }}>corrections@primeworld.news</a>.
        </p>
      </Section>

      <Section label="Sourcing">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {[
            { heading: 'On the Record', body: 'Named sources speaking with authority and permission are preferred for all significant claims.' },
            { heading: 'Anonymous Sources', body: 'Used only when the information is vital to the public interest and cannot be obtained otherwise. At least one editor must know the source\'s identity.' },
            { heading: 'Original Reporting', body: 'We prioritise original reporting and analysis. Aggregated content is clearly labelled and always adds independent context or verification.' },
            { heading: 'Opinion vs News', body: 'Analysis and opinion pieces are clearly distinguished from straight news reporting.' },
          ].map(b => (
            <div key={b.heading} style={{ background: 'var(--d3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{b.heading}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Diversity & Fairness">
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
          We seek diverse perspectives in our reporting and newsroom. Subjects of critical coverage are given a fair
          opportunity to respond before publication when practicable. We do not publish content intended to harass,
          defame, or endanger individuals without clear public-interest justification.
        </p>
      </Section>
    </PageShell>
  );
}
