'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';

interface ContactSectionProps {
  locale: Locale;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  area: string;
  message: string;
}

export function ContactSection({ locale }: ContactSectionProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', form);
  };

  const practiceAreaOptions = [
    { es: 'Derecho de Familia', en: 'Family Law' },
    { es: 'Derecho Migratorio', en: 'Immigration Law' },
    { es: 'Derecho Penal', en: 'Criminal Law' },
    { es: 'Derecho Civil', en: 'Civil Law' },
    { es: 'Derecho Laboral', en: 'Labor Law' },
    { es: 'Derecho Administrativo', en: 'Administrative Law' },
    { es: 'Derecho Corporativo y Comercial', en: 'Corporate and Commercial Law' },
    { es: 'Otro', en: 'Other' },
  ];

  const inputClass =
    'w-full bg-[#FAFAF7] border border-[#E6E6E6] focus:border-[#C9A449] focus:outline-none px-4 py-3 font-sans text-sm text-[#1C1C1C] placeholder:text-[#6B6B6B]/60 transition-colors duration-200';

  return (
    <section className="bg-white py-20 sm:py-28 border-t border-[#E6E6E6]" id="contacto">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column: contact info */}
          <FadeIn>
            <SectionEyebrow>
              {t(locale, 'Contáctenos', 'Contact Us')}
            </SectionEyebrow>
            <SectionTitle>
              {t(
                locale,
                'Estamos listos para escucharle',
                'We are ready to listen'
              )}
            </SectionTitle>
            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-10">
              {t(
                locale,
                'Póngase en contacto con nosotros para una consulta confidencial. Nuestro equipo le responderá a la brevedad posible.',
                'Get in touch with us for a confidential consultation. Our team will respond as soon as possible.'
              )}
            </p>

            {/* Contact details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 border border-[#E6E6E6] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#C9A449]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold mb-1">
                    {t(locale, 'Ubicación', 'Location')}
                  </p>
                  <p className="font-sans text-sm text-[#1C1C1C] leading-relaxed">
                    {t(
                      locale,
                      'Obarrio, Ciudad de Panamá, República de Panamá',
                      'Obarrio, Panama City, Republic of Panama'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 border border-[#E6E6E6] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#C9A449]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold mb-1">
                    {t(locale, 'Teléfono', 'Phone')}
                  </p>
                  <a
                    href="tel:+50769491006"
                    className="font-sans text-sm text-[#1C1C1C] hover:text-[#C9A449] transition-colors duration-200"
                  >
                    +507 6949-1006
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 border border-[#E6E6E6] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#C9A449]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold mb-1">
                    {t(locale, 'Correo electrónico', 'Email')}
                  </p>
                  <a
                    href="mailto:info@quintanareyes.com"
                    className="font-sans text-sm text-[#1C1C1C] hover:text-[#C9A449] transition-colors duration-200"
                  >
                    info@quintanareyes.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 border border-[#E6E6E6] flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#C9A449]" />
                </div>
                <div>
                  <p className="font-sans text-xs text-[#C9A449] tracking-[0.15em] uppercase font-semibold mb-1">
                    {t(locale, 'Horario', 'Hours')}
                  </p>
                  <p className="font-sans text-sm text-[#1C1C1C] leading-relaxed">
                    {t(
                      locale,
                      'Lunes – Viernes: 8:00 AM – 6:00 PM',
                      'Monday – Friday: 8:00 AM – 6:00 PM'
                    )}
                  </p>
                  <p className="font-sans text-sm text-[#6B6B6B]">
                    {t(
                      locale,
                      'Sábados: 9:00 AM – 1:00 PM',
                      'Saturdays: 9:00 AM – 1:00 PM'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right column: form */}
          <FadeIn delay={200}>
            <div className="bg-[#FAFAF7] border border-[#E6E6E6] p-8 sm:p-10">
              <h3 className="font-serif text-2xl text-[#0E0E0E] mb-8">
                {t(locale, 'Enviar mensaje', 'Send message')}
              </h3>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                    {t(locale, 'Nombre completo *', 'Full name *')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t(locale, 'Su nombre completo', 'Your full name')}
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                    {t(locale, 'Teléfono *', 'Phone *')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t(locale, 'Su número de teléfono', 'Your phone number')}
                    className={inputClass}
                    autoComplete="tel"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                    {t(locale, 'Correo electrónico *', 'Email *')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t(locale, 'Su correo electrónico', 'Your email address')}
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>

                {/* Area of interest */}
                <div>
                  <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                    {t(locale, 'Área de interés', 'Area of interest')}
                  </label>
                  <select
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    <option value="">
                      {t(locale, 'Seleccionar área', 'Select area')}
                    </option>
                    {practiceAreaOptions.map((opt) => (
                      <option
                        key={opt.es}
                        value={locale === 'es' ? opt.es : opt.en}
                      >
                        {locale === 'es' ? opt.es : opt.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                    {t(locale, 'Mensaje *', 'Message *')}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t(
                      locale,
                      'Describa brevemente su caso o consulta',
                      'Briefly describe your case or inquiry'
                    )}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold mt-2"
                >
                  {t(locale, 'Enviar consulta', 'Send inquiry')}
                </button>

                <p className="font-sans text-xs text-[#6B6B6B] text-center leading-relaxed">
                  {t(
                    locale,
                    'Sus datos son tratados con absoluta confidencialidad.',
                    'Your data is handled with absolute confidentiality.'
                  )}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
