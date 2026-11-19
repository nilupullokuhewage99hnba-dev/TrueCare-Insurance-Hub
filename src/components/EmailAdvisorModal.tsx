import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Mail, X } from 'lucide-react';

interface EmailAdvisorModalProps {
  open: boolean;
  advisorEmail: string;
  initialSubject?: string;
  initialBody?: string;
  onClose: () => void;
}

export const EmailAdvisorModal: React.FC<EmailAdvisorModalProps> = ({
  open,
  advisorEmail,
  initialSubject = '',
  initialBody = '',
  onClose,
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [senderPhone, setSenderPhone] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (open) {
      setSubject(initialSubject || 'Life Insurance Inquiry — TrueCare');
      setBody(
        initialBody ||
          'Hello Nilupul,\n\nI would like to schedule a brief conversation regarding HNB Life protection plans.\n\nThank you.'
      );
      setCopiedEmail(false);
    }
  }, [open, initialSubject, initialBody]);

  if (!open) return null;

  const fullBody = senderPhone.trim()
    ? `${body.trim()}\n\nContact Number: ${senderPhone.trim()}`
    : body.trim();

  const mailtoHref = `mailto:${advisorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(advisorEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Ignore clipboard failures safely
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="email-modal-title" className="text-lg font-semibold text-[#0F172A]">
              Email Nilupul Lokuhewage
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>To:</span>
              <span className="font-mono-tabular text-slate-700">{advisorEmail}</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-[#0B2545] hover:text-[#B4832D] font-medium cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close email dialog"
            className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="email-subject" className="block text-xs font-medium text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email-phone" className="block text-xs font-medium text-slate-700 mb-1.5">
              Your Phone Number (optional, for quick callback)
            </label>
            <input
              id="email-phone"
              type="tel"
              placeholder="07X XXX XXXX"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="email-body" className="block text-xs font-medium text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              id="email-body"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-[#0F172A] focus:bg-white focus:border-[#0B2545] focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <a
              href={mailtoHref}
              onClick={() => onClose()}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-xl bg-[#0B2545] text-sm font-medium text-white hover:bg-[#133863] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Open in Mail App</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
