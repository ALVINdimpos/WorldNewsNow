import { useState } from 'react';
import { PageShell, Section } from './PageComponents';
import { useAdvertiseInquiryMutation } from '../store/contactApi';

export function ContactPage({ goHome }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [submit, { isLoading }] = useAdvertiseInquiryMutation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await submit(form).unwrap();
      setDone(true);
    } catch {
      setError('Something went wrong. Please email us directly.');
    }
  }

  return (
    <PageShell goHome={goHome} title="Contact Us"
      subtitle="We welcome tips, corrections, reader feedback, and general inquiries. Our editorial team reads every message.">

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 40 }}>
        {[
          { label: 'Editorial', email: 'editorial@primeworld.news', desc: 'Story tips, corrections, press releases' },
          { label: 'General', email: 'hello@primeworld.news', desc: 'Account help, partnerships, other inquiries' },
          { label: 'Privacy', email: 'privacy@primeworld.news', desc: 'Data requests and privacy concerns' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--d2)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>{c.label}</div>
            <a href={`mailto:${c.email}`} style={{ fontSize: 14, color: 'var(--gold)', textDecoration: 'none', wordBreak: 'break-all' }}>{c.email}</a>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <Section label="Send a Message">
        {done ? (
          <p style={{ fontSize: 14, color: 'var(--green)', fontFamily: "'DM Mono',monospace" }}>✓ Message sent. We will respond within 2 business days.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
            <input type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ background: 'var(--d4)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '11px 14px', fontSize: 14 }} />
            <input type="email" placeholder="your@email.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{ background: 'var(--d4)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '11px 14px', fontSize: 14 }} />
            <textarea placeholder="Your message" rows={6} value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ background: 'var(--d4)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, padding: '11px 14px', fontSize: 14, resize: 'vertical' }} />
            {error && <p style={{ fontSize: 12, color: '#F87171' }}>{error}</p>}
            <button type="submit" className="btn-gold" disabled={isLoading} style={{ alignSelf: 'flex-start', padding: '11px 24px', fontSize: 14 }}>
              {isLoading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </Section>
    </PageShell>
  );
}
