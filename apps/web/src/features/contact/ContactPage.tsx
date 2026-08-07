import { useEffect, useState, useRef, FormEvent } from 'react';
import { PublicLayoutShell } from '../../components/layout/PublicLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getContactContent } from './content';
import { apiService } from '../../services/api';

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

type SubmissionState = 'IDLE' | 'TYPING' | 'SUBMITTING' | 'SUCCESS' | 'ERROR';

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface ZeroIconSelectProps {
  id: string;
  options: SelectOption[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

/* Custom Zero-Icon Monochrome Select Component (Chống chói màu 100% & Zero-Icon) */
function ZeroIconSelect({ id, options, value, placeholder, onChange, isInvalid }: ZeroIconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={isInvalid}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2.5 bg-background border text-xs text-left font-mono flex items-center justify-between transition-colors focus:outline-none ${
          isInvalid ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground'
        }`}
      >
        <span className={selectedOption ? 'text-foreground font-semibold' : 'text-muted-foreground/70'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold tracking-tighter">
          {isOpen ? '[ ^ ]' : '[ v ]'}
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-30 left-0 right-0 top-full mt-1 bg-card border border-border shadow-xl max-h-56 overflow-y-auto font-mono py-1 space-y-0.5 focus:outline-none"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-xs cursor-pointer select-none transition-colors ${
                  isSelected
                    ? 'bg-foreground text-background font-bold'
                    : 'text-foreground hover:bg-foreground hover:text-background'
                }`}
              >
                {option.label} {isSelected ? '[✓]' : ''}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { locale } = useLanguageStore();
  const { user } = useAuthStore();

  const [formState, setFormState] = useState<SubmissionState>('IDLE');
  const [fields, setFields] = useState<FormFields>({
      name: user?.fullName || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [submissionHistory, setSubmissionHistory] = useState<number[]>([]);

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  useEffect(() => {
    document.title = 'Contact Us - nodetask Support & Feedback';
  }, []);

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
    if (formState === 'ERROR') {
      setFormState('TYPING');
      setErrorMessage(null);
    } else if (formState === 'IDLE') {
      setFormState('TYPING');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Rate-limit validation: Max 3 submissions per 60 seconds
    const now = Date.now();
    const recentSubmissions = submissionHistory.filter((timestamp) => now - timestamp < 60000);
    if (recentSubmissions.length >= 3) {
      setFormState('ERROR');
      setErrorMessage(getContactContent('contact.error.rate_limit', locale));
      return;
    }

    // 2. Client-side Form Validation
    const newErrors: FormErrors = {
      name: !fields.name.trim(),
      email: !fields.email.trim() || !fields.email.includes('@'),
      subject: !fields.subject.trim(),
      message: !fields.message.trim(),
    };

    if (newErrors.name || newErrors.email || newErrors.subject || newErrors.message) {
      setErrors(newErrors);
      setFormState('ERROR');
      setErrorMessage(getContactContent('contact.error.validation_failed', locale));
      return;
    }

    // 3. Submitting State & RPC API Execution
    setFormState('SUBMITTING');

    try {
      const res = await apiService.submitContactEnquiry({
        name: fields.name.trim(),
        email: fields.email.trim(),
        subject: fields.subject.trim(),
        message: fields.message.trim(),
      });

      setSubmissionHistory((prev) => [...prev, now]);
      setSubmittedTicketId(res.ticketId);
      setFormState('SUCCESS');
    } catch (err: unknown) {
      setFormState('ERROR');
      if (err instanceof Error && err.message.includes('422')) {
        setErrorMessage(getContactContent('contact.error.validation_failed', locale));
      } else {
        setErrorMessage(getContactContent('contact.error.server_error', locale));
      }
    }
  };

  const handleResetForm = () => {
    setFields({
        name: user?.fullName || '',
      email: user?.email || '',
      subject: '',
      message: '',
    });
    setErrors({});
    setErrorMessage(null);
    setSubmittedTicketId(null);
    setFormState('IDLE');
  };

  const subjectOptions: SelectOption[] = [
    { value: 'GENERAL', label: getContactContent('contact.form.subject_general', locale) },
    { value: 'SUPPORT', label: getContactContent('contact.form.subject_support', locale) },
    { value: 'FEEDBACK', label: getContactContent('contact.form.subject_feedback', locale) },
    { value: 'PARTNERSHIP', label: getContactContent('contact.form.subject_partnership', locale) },
  ];

  return (
    <PublicLayoutShell currentPath="/contact" onNavigate={handleNavigate}>
      <main
        id="main-content"
        role="main"
        className="max-w-[clamp(800px,90vw,1100px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-mono space-y-16"
      >
        {/* Section 1: Hero Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-block px-3 py-1 border border-border text-[11px] uppercase tracking-widest text-muted-foreground bg-muted/20">
            {getContactContent('contact.badge', locale)}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] uppercase [text-wrap:balance]">
            {getContactContent('contact.title', locale)}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            {getContactContent('contact.subheading', locale)}
          </p>
        </header>

        {/* Section 2: Form & Info Grid Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form Card (max-w-[650px] container archetype) */}
          <article className="lg:col-span-7 border border-border bg-card p-6 sm:p-8 space-y-6">
            <header className="border-b border-border pb-4 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest font-bold text-foreground">
                [ ENQUIRY FORM ]
              </h2>
              <span className="text-[10px] text-muted-foreground font-mono">
                STATUS: {formState}
              </span>
            </header>

            {formState === 'SUCCESS' ? (
              <div className="space-y-6 py-6" role="alert">
                <div className="p-4 border border-foreground bg-muted/20 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground block">
                    [ SUBMISSION RECEIVED ]
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {getContactContent('contact.success', locale)}
                  </p>
                  {submittedTicketId && (
                    <div className="pt-2 text-xs border-t border-border flex items-center justify-between">
                      <span className="text-muted-foreground">{getContactContent('contact.ticket_id', locale)}:</span>
                      <code className="font-bold text-foreground bg-background px-2 py-1 border border-border">
                        {submittedTicketId}
                      </code>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleResetForm}
                  className="w-full py-3 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
                >
                  {getContactContent('contact.submit_another', locale)}
                </button>
              </div>
            ) : (
              <form role="form" onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Global Error Banner */}
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-4 border border-destructive bg-destructive/10 text-destructive text-xs space-y-1"
                  >
                    <span className="font-bold uppercase tracking-widest block">[ ERROR ]</span>
                    <p>{errorMessage}</p>
                  </div>
                )}

                {/* Field 1: Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    01 // {getContactContent('contact.form.name', locale)}{' '}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={errors.name}
                    placeholder={getContactContent('contact.form.name_placeholder', locale)}
                    value={fields.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2.5 bg-background border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors ${
                      errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground'
                    }`}
                  />
                </div>

                {/* Field 2: Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    02 // {getContactContent('contact.form.email', locale)}{' '}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={errors.email}
                    placeholder={getContactContent('contact.form.email_placeholder', locale)}
                    value={fields.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2.5 bg-background border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors ${
                      errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground'
                    }`}
                  />
                </div>

                {/* Field 3: Subject Select (Zero-Icon Custom Select) */}
                <div className="space-y-2">
                  <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    03 // {getContactContent('contact.form.subject', locale)}{' '}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <ZeroIconSelect
                    id="contact-subject"
                    options={subjectOptions}
                    value={fields.subject}
                    placeholder={getContactContent('contact.form.subject_placeholder', locale)}
                    onChange={(val) => handleInputChange('subject', val)}
                    isInvalid={errors.subject}
                  />
                </div>

                {/* Field 4: Message Textarea (Strictly bounded height - No free resize) */}
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-foreground">
                    04 // {getContactContent('contact.form.message', locale)}{' '}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    aria-required="true"
                    aria-invalid={errors.message}
                    placeholder={getContactContent('contact.form.message_placeholder', locale)}
                    value={fields.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-3 py-2.5 bg-background border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-colors resize-none min-h-[140px] max-h-[220px] overflow-y-auto ${
                      errors.message ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground'
                    }`}
                  />
                </div>

                {/* Submit Button Atom */}
                <button
                  type="submit"
                  disabled={formState === 'SUBMITTING'}
                  className="w-full py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity border border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formState === 'SUBMITTING'
                    ? getContactContent('contact.form.submitting', locale)
                    : getContactContent('contact.form.submit', locale)}
                </button>
              </form>
            )}
          </article>

          {/* Section 3: Contact Info & Channels Block */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="border border-border bg-card p-6 sm:p-8 space-y-6">
              <header className="border-b border-border pb-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-foreground">
                  {getContactContent('contact.info.title', locale)}
                </h3>
              </header>

              <div className="space-y-5 text-xs">
                {/* Info item 1 */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    [ 01 // {getContactContent('contact.info.email_label', locale)} ]
                  </span>
                  <p className="font-bold text-foreground">
                    <a href="mailto:support@nodetask.dev" className="hover:underline">
                      {getContactContent('contact.info.email_val', locale)}
                    </a>
                  </p>
                </div>

                {/* Info item 2 */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    [ 02 // {getContactContent('contact.info.hours_label', locale)} ]
                  </span>
                  <p className="text-muted-foreground">
                    {getContactContent('contact.info.hours_val', locale)}
                  </p>
                </div>

                {/* Info item 3 */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    [ 03 // {getContactContent('contact.info.location_label', locale)} ]
                  </span>
                  <p className="text-muted-foreground">
                    {getContactContent('contact.info.location_val', locale)}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice Block */}
            <div className="border border-border bg-muted/10 p-6 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                [ SECURITY & DISCLOSURE ]
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {getContactContent('contact.info.security_notice', locale)}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleNavigate('/security')}
                  className="text-xs uppercase font-bold text-foreground hover:underline"
                >
                  [ VIEW SECURITY POLICY → ]
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </PublicLayoutShell>
  );
}

export default ContactPage;
