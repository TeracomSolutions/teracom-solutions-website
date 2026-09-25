import TurnstileWidget from '@/components/TurnstileWidget';

export default function ContactForm({ preselectedInterest = '', returnTo = '/' }) {
  return (
    <form className="contact-form" action="/api/leads" method="post">
      <input type="hidden" name="return_to" value={returnTo} />
      <TurnstileWidget />
      <div className="field">
        <label htmlFor="lead-name">Name</label>
        <input id="lead-name" name="name" autoComplete="name" required/>
      </div>
      <div className="field">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" autoComplete="organization"/>
      </div>
      <div className="field">
        <label htmlFor="lead-email">Email</label>
        <input id="lead-email" name="email" type="email" autoComplete="email" required/>
      </div>
      <div className="field">
        <label htmlFor="lead-interest">Enquiry type</label>
        <select id="lead-interest" name="interest" required defaultValue={preselectedInterest}>
          <option value="">Please select</option>
          <option>Talk to Sales</option>
          <option>Request Demo</option>
          <option>Teracom AI</option>
          <option>Monitoring</option>
          <option>Technical Consulting</option>
          <option>Teracom Store</option>
          <option>Partnership</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="lead-message">How can we help?</label>
        <textarea id="lead-message" name="message" rows={4}></textarea>
      </div>
      <button className="btn btn-primary" type="submit">Get In Touch</button>
      <p className="form-note">We usually reply within one business day. Weekdays 9am &ndash; 4:30pm AEST.</p>
    </form>
  );
}