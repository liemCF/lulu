"use client";

import { useState } from "react";
import { info } from "@/lib/content";
import Magnetic from "./Magnetic";

/**
 * Contact form with no server behind it: submitting opens the visitor's own email app with the
 * message already written to the restaurant, so nothing is ever silently dropped.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "General Inquiry",
    guests: "2-4",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${formData.type} from ${formData.name}`;
    const body = [
      formData.message,
      "",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.phone ? `Phone: ${formData.phone}` : "",
    ]
      .filter((line, i) => i < 2 || line)
      .join("\n");
    window.location.href = `mailto:${info.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
  };

  return (
    <div className="relative rounded-2xl border border-cream/15 bg-night/70 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
      <div className="mb-8 border-b border-cream/10 pb-6">
        <p className="eyebrow mb-2 text-gold">Get in Touch</p>
        <h3 className="font-display text-2xl sm:text-3xl text-cream">
          Send Us a <em className="text-gold-soft font-serif italic">Message</em>
        </h3>
        <p className="mt-2 text-[0.92rem] text-cream/70">
          For table reservations, please use OpenTable. For private events, press inquiries, or general questions, fill out the form below and it will open as an email to us.
        </p>
      </div>

      {status === "success" ? (
        <div className="py-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold text-2xl">
            ✓
          </div>
          <h4 className="font-display text-2xl text-cream">Almost There</h4>
          <p className="max-w-md mx-auto text-cream/75 text-[0.95rem]">
            Your email app has opened with your message ready. Press send there to reach us. If nothing opened,
            write to{" "}
            <a href={`mailto:${info.email}`} className="text-gold hover:underline">
              {info.email}
            </a>{" "}
            or call {info.phone}.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFormData({ name: "", email: "", phone: "", type: "General Inquiry", guests: "2-4", message: "" });
            }}
            className="btn btn-solid mt-4 !px-6 !py-2.5 text-xs"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-[0.75rem] font-medium tracking-[0.16em] text-cream/80 uppercase mb-2">
                Full Name <span className="text-gold">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-cream/20 bg-ink/70 px-4 py-3 text-cream placeholder-cream/35 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-[0.75rem] font-medium tracking-[0.16em] text-cream/80 uppercase mb-2">
                Email Address <span className="text-gold">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-cream/20 bg-ink/70 px-4 py-3 text-cream placeholder-cream/35 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-phone" className="block text-[0.75rem] font-medium tracking-[0.16em] text-cream/80 uppercase mb-2">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(214) 000-0000"
                className="w-full rounded-xl border border-cream/20 bg-ink/70 px-4 py-3 text-cream placeholder-cream/35 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label htmlFor="contact-type" className="block text-[0.75rem] font-medium tracking-[0.16em] text-cream/80 uppercase mb-2">
                Inquiry Type
              </label>
              <select
                id="contact-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-xl border border-cream/20 bg-ink/70 px-4 py-3 text-cream transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="General Inquiry" className="bg-ink text-cream">General Inquiry</option>
                <option value="Private Dining & Events" className="bg-ink text-cream">Private Dining & Events</option>
                <option value="Flaming Duck Experience" className="bg-ink text-cream">Flaming Duck Experience</option>
                <option value="Press & Media" className="bg-ink text-cream">Press & Media</option>
                <option value="Careers" className="bg-ink text-cream">Careers</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-[0.75rem] font-medium tracking-[0.16em] text-cream/80 uppercase mb-2">
              Message <span className="text-gold">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your inquiry, event date, or dining requests..."
              className="w-full rounded-xl border border-cream/20 bg-ink/70 px-4 py-3 text-cream placeholder-cream/35 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
            />
          </div>

          <div className="pt-2">
            <Magnetic strength={0.35}>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn btn-solid w-full sm:w-auto min-w-[200px] justify-center text-center shadow-lg shadow-gold/15"
              >
                Open Email to Send ↗
              </button>
            </Magnetic>
          </div>
        </form>
      )}
    </div>
  );
}

