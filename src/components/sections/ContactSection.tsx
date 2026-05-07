'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, Loader2, ChevronDown, Search } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale, t } from '@/lib/i18n';
import {
  detectInjection,
  isValidEmail,
  isValidName,
} from '@/lib/sanitize';

interface Country {
  name: string;
  dialCode: string;
  flag: string;
  code: string;
}

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

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const tipoCasoMap: Record<string, string> = {
  'Derecho de Familia': 'FAMILIA',
  'Family Law': 'FAMILIA',
  'Derecho Migratorio': 'MIGRATORIO',
  'Immigration Law': 'MIGRATORIO',
  'Derecho Penal': 'PENAL',
  'Criminal Law': 'PENAL',
  'Derecho Civil': 'CIVIL',
  'Civil Law': 'CIVIL',
  'Derecho Laboral': 'LABORAL',
  'Labor Law': 'LABORAL',
  'Derecho Administrativo': 'ADMINISTRATIVO',
  'Administrative Law': 'ADMINISTRATIVO',
  'Derecho Corporativo y Comercial': 'CORPORATIVO',
  'Corporate and Commercial Law': 'CORPORATIVO',
  Otro: 'CIVIL',
  Other: 'CIVIL',
};

export function ContactSection({ locale }: ContactSectionProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [solicitudRef, setSolicitudRef] = useState('');

  // Country selector state
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryLoading, setCountryLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setCountryLoading(true);
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2',
        );
        const data = await response.json();
        const formatted: Country[] = data
          .filter((c: { idd?: { root?: string } }) => c.idd && c.idd.root)
          .map(
            (c: {
              name: { common: string };
              idd: { root: string; suffixes?: string[] };
              flags: { svg: string };
              cca2: string;
            }) => ({
              name: c.name.common,
              dialCode: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ''),
              flag: c.flags.svg,
              code: c.cca2,
            }),
          )
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(formatted);
        const defaultCountry =
          formatted.find((c: Country) => c.dialCode === '+507') || formatted[0];
        setSelectedCountry(defaultCountry);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setCountryLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const filteredCountries = countrySearch
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.dialCode.includes(countrySearch) ||
          c.code.toLowerCase().includes(countrySearch.toLowerCase()),
      )
    : countries;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const securityMsg = t(
    locale,
    'Se detectó contenido no permitido. Por favor revise su entrada.',
    'Disallowed content detected. Please review your input.',
  );

  const validateFields = (): boolean => {
    const errors: FieldErrors = {};

    // Required
    if (!form.name.trim()) {
      errors.name = t(locale, 'El nombre es obligatorio.', 'Name is required.');
    } else if (!isValidName(form.name.trim())) {
      errors.name = t(locale, 'Ingrese un nombre válido.', 'Enter a valid name.');
    } else if (detectInjection(form.name)) {
      errors.name = securityMsg;
    }

    if (!form.phone.trim()) {
      errors.phone = t(locale, 'El teléfono es obligatorio.', 'Phone is required.');
    } else if (!/^[0-9\-() ]{4,20}$/.test(form.phone.trim())) {
      errors.phone = t(locale, 'Ingrese un teléfono válido.', 'Enter a valid phone number.');
    }

    if (!form.email.trim()) {
      errors.email = t(locale, 'El correo es obligatorio.', 'Email is required.');
    } else if (!isValidEmail(form.email.trim())) {
      errors.email = t(locale, 'Ingrese un correo válido.', 'Enter a valid email.');
    } else if (detectInjection(form.email)) {
      errors.email = securityMsg;
    }

    if (!form.message.trim()) {
      errors.message = t(locale, 'El mensaje es obligatorio.', 'Message is required.');
    } else if (form.message.trim().length < 10) {
      errors.message = t(locale, 'El mensaje debe tener al menos 10 caracteres.', 'Message must be at least 10 characters.');
    } else if (detectInjection(form.message)) {
      errors.message = securityMsg;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateFields()) {
      setStatus('error');
      setErrorMsg(t(locale, 'Corrija los errores en el formulario.', 'Fix the errors in the form.'));
      return;
    }

    if (!acceptedPrivacy) {
      setStatus('error');
      setErrorMsg(
        t(locale, 'Debe aceptar la Política de Privacidad para enviar el formulario.', 'You must accept the Privacy Policy to submit the form.'),
      );
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.name.trim(),
          telefono: `${selectedCountry?.dialCode ?? ''} ${form.phone.trim()}`.trim(),
          email: form.email.trim(),
          tipoCaso: tipoCasoMap[form.area] || 'CIVIL',
          mensaje: form.message.trim(),
          origen: 'web',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al enviar');
      }

      const refId = data.data?.id ? `QR-${String(data.data.id).padStart(5, '0')}` : '';
      setSolicitudRef(refId);
      setStatus('success');
      setForm({ name: '', phone: '', email: '', area: '', message: '' });
      setAcceptedPrivacy(false);
      setFieldErrors({});
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : t(locale, 'Ocurrió un error. Intente nuevamente.', 'An error occurred. Please try again.'),
      );
    }
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

  const baseInput =
    'w-full bg-white border rounded-lg px-4 py-3 font-sans text-sm text-[#1C1C1C] placeholder:text-[#6B6B6B]/60 transition-colors duration-200 outline-none';
  const inputOk = `${baseInput} border-[#E6E6E6] focus:border-[#C9A449] focus:ring-1 focus:ring-[#C9A449]`;
  const inputErr = `${baseInput} border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400`;

  const isLoading = status === 'loading';

  return (
    <section className="bg-white py-20 sm:py-28 border-t border-[#E6E6E6]" id="contacto">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column: contact info */}
          <FadeIn>
            <SectionEyebrow>{t(locale, 'Contáctenos', 'Contact Us')}</SectionEyebrow>
            <SectionTitle>{t(locale, 'Estamos listos para escucharle', 'We are ready to listen')}</SectionTitle>
            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-10">
              {t(
                locale,
                'Póngase en contacto con nosotros para una consulta confidencial. Nuestro equipo le responderá a la brevedad posible.',
                'Get in touch with us for a confidential consultation. Our team will respond as soon as possible.',
              )}
            </p>

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
                    {t(locale, 'Ciudad de Panamá, Obarrio,', 'Panama City, Obarrio,')}
                    <br />
                    {t(locale, 'PH Twist Tower, piso 27, oficina 27H.', 'PH Twist Tower, 27th floor, office 27H.')}
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
                  <p className="font-sans text-sm text-[#1C1C1C]">
                    <a href="tel:+50762810554" className="hover:text-[#C9A449] transition-colors">
                      +507 6281-0554
                    </a>
                    {' | '}
                    <a href="tel:+50766069100" className="hover:text-[#C9A449] transition-colors">
                      +507 6606-9100
                    </a>
                  </p>
                  <p className="font-sans text-sm text-[#6B6B6B] mt-0.5">373-6404</p>
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
                    href="mailto:info@quintanareyesabogados.com"
                    className="font-sans text-sm text-[#1C1C1C] hover:text-[#C9A449] transition-colors"
                  >
                    info@quintanareyesabogados.com
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
                  <p className="font-sans text-sm text-[#1C1C1C]">
                    {t(locale, 'Lunes a Viernes: 8:00 a.m. – 6:00 p.m.', 'Monday to Friday: 8:00 a.m. – 6:00 p.m.')}
                  </p>
                  <p className="font-sans text-sm text-[#6B6B6B]">
                    {t(locale, 'Sábados y Domingos: Cerrados', 'Saturdays and Sundays: Closed')}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right column: form */}
          <FadeIn delay={200}>
            <div className="bg-[#FAFAF7] border border-[#E6E6E6] rounded-xl p-8 sm:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#0E0E0E] mb-3">
                    {t(locale, '¡Mensaje enviado!', 'Message sent!')}
                  </h3>
                  {solicitudRef && (
                    <div className="bg-[#0E0E0E] px-6 py-3 mb-4 inline-block rounded-lg">
                      <p className="font-sans text-xs text-[#C9A449] tracking-widest uppercase font-semibold mb-1">
                        {t(locale, 'N° de referencia', 'Reference number')}
                      </p>
                      <p className="font-mono text-lg text-white font-bold tracking-wider">{solicitudRef}</p>
                    </div>
                  )}
                  <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed max-w-sm mb-6">
                    {t(
                      locale,
                      'Hemos recibido su solicitud. Nuestro equipo legal se pondrá en contacto con usted a la brevedad posible. Revise su correo para la confirmación.',
                      'We have received your request. Our legal team will contact you as soon as possible. Check your email for confirmation.',
                    )}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="font-sans text-sm text-[#C9A449] hover:text-[#8C6F2A] transition-colors font-semibold tracking-wider uppercase"
                  >
                    {t(locale, 'Enviar otra consulta', 'Send another inquiry')}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif text-2xl text-[#0E0E0E] mb-8">
                    {t(locale, 'Enviar mensaje', 'Send message')}
                  </h3>

                  {status === 'error' && errorMsg && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

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
                        className={fieldErrors.name ? inputErr : inputOk}
                        autoComplete="name"
                        maxLength={200}
                        disabled={isLoading}
                      />
                      {fieldErrors.name && (
                        <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>

                    {/* Phone with country selector */}
                    <div>
                      <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                        {t(locale, 'Teléfono *', 'Phone *')}
                      </label>
                      <div className="flex relative" ref={dropdownRef}>
                        {/* Country selector button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsDropdownOpen((prev) => !prev);
                              setCountrySearch('');
                            }}
                            disabled={isLoading}
                            className={`h-full min-w-[108px] px-3 bg-white border rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-200 mr-2 hover:border-[#C9A449] ${
                              fieldErrors.phone ? 'border-red-400' : 'border-[#E6E6E6] focus:border-[#C9A449]'
                            }`}
                          >
                            {countryLoading ? (
                              <Loader2 className="animate-spin mx-auto w-4 h-4 text-[#6B6B6B]" />
                            ) : selectedCountry ? (
                              <div className="flex items-center gap-2 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={selectedCountry.flag}
                                  alt={selectedCountry.code}
                                  className="w-6 h-4 object-cover shadow-sm flex-shrink-0 rounded-sm"
                                />
                                <span className="text-sm font-medium text-[#1C1C1C] truncate">
                                  {selectedCountry.dialCode}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-[#6B6B6B]">...</span>
                            )}
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ml-1 text-[#6B6B6B] ${
                                isDropdownOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Country dropdown */}
                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-[300px] bg-white shadow-2xl max-h-72 overflow-hidden z-50 mt-1.5 rounded-lg border border-[#E6E6E6] flex flex-col">
                              {/* Search input */}
                              <div className="p-2 border-b border-[#E6E6E6] flex-shrink-0">
                                <div className="relative">
                                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                                  <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    placeholder={t(locale, 'Buscar país...', 'Search country...')}
                                    className="w-full pl-8 pr-3 py-2 text-sm bg-[#FAFAF7] border border-[#E6E6E6] rounded-md outline-none focus:border-[#C9A449] placeholder:text-[#6B6B6B]/60"
                                  />
                                </div>
                              </div>
                              {/* Country list */}
                              <div className="overflow-y-auto flex-1">
                                {filteredCountries.length === 0 ? (
                                  <p className="text-sm text-[#6B6B6B] text-center py-4">
                                    {t(locale, 'Sin resultados', 'No results')}
                                  </p>
                                ) : (
                                  filteredCountries.map((country) => (
                                    <div
                                      key={country.code}
                                      onClick={() => {
                                        setSelectedCountry(country);
                                        setIsDropdownOpen(false);
                                        setCountrySearch('');
                                      }}
                                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#FAFAF7] cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-0"
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={country.flag}
                                        alt={country.code}
                                        className="w-6 h-4 object-cover shadow-sm flex-shrink-0 rounded-sm"
                                      />
                                      <span className="text-sm font-semibold w-14 text-right text-[#6B6B6B]">
                                        {country.dialCode}
                                      </span>
                                      <span className="text-sm text-[#1C1C1C] truncate font-medium">
                                        {country.name}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone number input */}
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="6000-0000"
                          className={`flex-1 min-w-0 ${fieldErrors.phone ? inputErr : inputOk}`}
                          autoComplete="tel-national"
                          maxLength={20}
                          disabled={isLoading}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                      )}
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
                        className={fieldErrors.email ? inputErr : inputOk}
                        autoComplete="email"
                        maxLength={255}
                        disabled={isLoading}
                      />
                      {fieldErrors.email && (
                        <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block font-sans text-xs text-[#1C1C1C] tracking-[0.1em] uppercase font-semibold mb-2">
                        {t(locale, 'Área de interés', 'Area of interest')}
                      </label>
                      <select
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        className={`${inputOk} cursor-pointer appearance-none`}
                        disabled={isLoading}
                      >
                        <option value="">{t(locale, 'Seleccionar área', 'Select area')}</option>
                        {practiceAreaOptions.map((opt) => (
                          <option key={opt.es} value={locale === 'es' ? opt.es : opt.en}>
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
                        placeholder={t(locale, 'Describa brevemente su caso o consulta', 'Briefly describe your case or inquiry')}
                        className={`${fieldErrors.message ? inputErr : inputOk} resize-none`}
                        maxLength={5000}
                        disabled={isLoading}
                      />
                      {fieldErrors.message && (
                        <p className="font-sans text-xs text-red-500 mt-1">{fieldErrors.message}</p>
                      )}
                    </div>

                    {/* Privacy checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer mt-1 select-none">
                      <span
                        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                          acceptedPrivacy
                            ? 'bg-[#C9A449] border-[#C9A449]'
                            : 'bg-white border-[#E6E6E6] hover:border-[#C9A449]'
                        }`}
                        onClick={() => !isLoading && setAcceptedPrivacy(!acceptedPrivacy)}
                      >
                        {acceptedPrivacy && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="font-sans text-xs text-[#6B6B6B] leading-relaxed">
                        {t(locale, 'He leído y acepto la ', 'I have read and accept the ')}
                        <Link
                          href={locale === 'es' ? '/es/politica-de-privacidad' : '/en/privacy-policy'}
                          target="_blank"
                          className="text-[#C9A449] hover:text-[#8C6F2A] underline transition-colors"
                        >
                          {t(locale, 'Política de Privacidad', 'Privacy Policy')}
                        </Link>
                      </span>
                    </label>

                    {/* Submit */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !acceptedPrivacy}
                      className="w-full bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 rounded-lg px-8 py-4 font-sans text-sm tracking-widest uppercase font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t(locale, 'Enviando...', 'Sending...')}
                        </>
                      ) : (
                        t(locale, 'Enviar consulta', 'Send inquiry')
                      )}
                    </button>

                    <p className="font-sans text-xs text-[#6B6B6B] text-center leading-relaxed">
                      {t(
                        locale,
                        'Sus datos son tratados con absoluta confidencialidad.',
                        'Your data is handled with absolute confidentiality.',
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
