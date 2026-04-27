'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export function PrivacyPolicy({ locale }: Props) {
  if (locale === 'en') return <PrivacyPolicyEN />;
  return <PrivacyPolicyES />;
}

function Wrapper({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[900px]">
        <FadeIn className="mb-12">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle>{title}</SectionTitle>
          <p className="font-sans text-sm text-[#6B6B6B] mt-4">
            Última actualización: abril de 2026
          </p>
        </FadeIn>
        <div className="prose-legal font-sans text-sm text-[#0E0E0E] leading-relaxed space-y-8">
          {children}
        </div>
      </div>
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-xl text-[#0E0E0E] mb-3 mt-10">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[#6B6B6B] leading-relaxed">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 text-[#6B6B6B] space-y-2 leading-relaxed">{children}</ul>;
}

function PrivacyPolicyES() {
  return (
    <Wrapper eyebrow="Legal" title="Política de Privacidad">
      <P>
        En Quintana Reyes &amp; Asociados valoramos y respetamos la privacidad de nuestros usuarios y clientes.
        La presente Política de Privacidad tiene por objeto informarle de manera clara y transparente sobre cómo
        recopilamos, utilizamos, almacenamos y protegemos sus datos personales a través de nuestro sitio web
        quintanareyes.com, en cumplimiento de la Ley 81 de 26 de marzo de 2019 sobre Protección de Datos Personales
        de la República de Panamá y su reglamentación mediante el Decreto Ejecutivo 285 de 28 de mayo de 2021.
      </P>
      <P>
        Al acceder a nuestro sitio web y proporcionarnos sus datos personales, usted manifiesta haber leído y
        comprendido los términos de la presente Política de Privacidad.
      </P>

      <H2>1. Responsable del Tratamiento de Datos</H2>
      <P>El responsable del tratamiento de los datos personales recopilados a través de este sitio web es:</P>
      <UL>
        <li><strong>Razón social:</strong> Quintana Reyes &amp; Asociados</li>
        <li><strong>Domicilio:</strong> PH Twist Tower, Piso 27, Oficina 27H, Obarrio, Ciudad de Panamá, República de Panamá</li>
        <li><strong>Correo electrónico:</strong> info@quintanareyes.com</li>
        <li><strong>Teléfonos:</strong> +507 6281-0554 / +507 6606-9100</li>
      </UL>

      <H2>2. Datos Personales que Recopilamos</H2>
      <P>
        A través de nuestro sitio web recopilamos únicamente los datos personales que usted nos proporciona de forma
        voluntaria mediante nuestro formulario de contacto. Estos datos incluyen:
      </P>
      <UL>
        <li>Nombre completo</li>
        <li>Número de teléfono</li>
        <li>Dirección de correo electrónico</li>
        <li>Tipo de caso o consulta</li>
        <li>Mensaje o descripción de su consulta</li>
      </UL>
      <P>
        No recopilamos datos personales sensibles (tales como datos sobre salud, orientación sexual, creencias
        religiosas, afiliación política u origen étnico) a través de nuestro sitio web.
      </P>

      <H2>3. Finalidad del Tratamiento de Datos</H2>
      <P>Los datos personales que usted nos proporcione serán tratados exclusivamente para las siguientes finalidades:</P>
      <UL>
        <li><strong>Atención de consultas:</strong> Recibir, gestionar y responder las solicitudes de información o consultas que usted realice a través de nuestro formulario de contacto.</li>
        <li><strong>Contacto y seguimiento:</strong> Comunicarnos con usted para dar seguimiento a su consulta, coordinar reuniones o brindarle información adicional sobre nuestros servicios legales.</li>
        <li><strong>Evaluación preliminar del caso:</strong> Realizar una valoración inicial del tipo de caso o situación jurídica que nos describe para determinar si podemos asistirle.</li>
        <li><strong>Mejora del servicio:</strong> Analizar de forma agregada y anónima el tipo de consultas recibidas para mejorar la calidad de nuestros servicios.</li>
      </UL>
      <P>
        En ningún caso sus datos personales serán utilizados con fines comerciales, de mercadeo o publicidad no
        solicitada, ni serán vendidos o cedidos a terceros con fines distintos a los aquí descritos.
      </P>

      <H2>4. Base Legal del Tratamiento</H2>
      <P>El tratamiento de sus datos personales se fundamenta en las siguientes bases legales, conforme a la Ley 81 de 26 de marzo de 2019:</P>
      <UL>
        <li><strong>Consentimiento del titular:</strong> Al completar y enviar el formulario de contacto, usted otorga su consentimiento libre, expreso e informado para el tratamiento de sus datos personales.</li>
        <li><strong>Ejecución de medidas precontractuales:</strong> El tratamiento puede ser necesario para la ejecución de medidas previas a la celebración de un contrato de prestación de servicios legales.</li>
        <li><strong>Interés legítimo:</strong> Cuando el tratamiento sea necesario para la satisfacción de intereses legítimos, siempre que no prevalezcan los derechos y libertades fundamentales del titular.</li>
      </UL>

      <H2>5. Derechos del Titular de los Datos (Derechos ARCO)</H2>
      <P>De conformidad con la Ley 81 de 2019 y el Decreto Ejecutivo 285 de 2021, usted tiene derecho a:</P>
      <UL>
        <li><strong>Derecho de Acceso:</strong> Obtener información sobre si sus datos personales están siendo objeto de tratamiento, así como conocer el origen, la finalidad y las condiciones del tratamiento. Plazo de respuesta: diez (10) días hábiles.</li>
        <li><strong>Derecho de Rectificación:</strong> Solicitar la corrección de sus datos personales cuando sean inexactos, incompletos o erróneos. Plazo: cinco (5) días hábiles.</li>
        <li><strong>Derecho de Cancelación:</strong> Solicitar la eliminación o supresión de sus datos personales cuando hayan dejado de ser necesarios o cuando desee revocar el consentimiento otorgado.</li>
        <li><strong>Derecho de Oposición:</strong> Oponerse al tratamiento de sus datos personales o revocar el consentimiento previamente otorgado.</li>
        <li><strong>Derecho de Portabilidad:</strong> Solicitar la entrega de sus datos personales en un formato estructurado, de uso común y lectura mecánica.</li>
      </UL>
      <P>
        Para ejercer cualquiera de estos derechos, envíe una solicitud a <strong>info@quintanareyes.com</strong> indicando
        su nombre completo, el derecho que desea ejercer, una descripción de su solicitud y copia de un documento
        de identidad. Las actuaciones serán gratuitas conforme a la Ley 81 de 2019.
      </P>
      <P>
        Si considera que sus derechos no han sido debidamente atendidos, puede presentar una queja ante la Autoridad
        Nacional de Transparencia y Acceso a la Información (ANTAI).
      </P>

      <H2>6. Protección y Seguridad de los Datos</H2>
      <P>
        Implementamos medidas técnicas, administrativas y organizativas para proteger sus datos personales contra el
        acceso no autorizado, pérdida, alteración, destrucción o divulgación indebida, incluyendo:
      </P>
      <UL>
        <li>Protocolos de cifrado SSL/TLS para la transmisión de datos.</li>
        <li>Restricción de acceso a datos solo al personal autorizado.</li>
        <li>Políticas internas de confidencialidad y manejo de información.</li>
        <li>Revisión periódica de las medidas de seguridad.</li>
      </UL>

      <H2>7. Período de Retención de los Datos</H2>
      <UL>
        <li><strong>Consultas sin relación contractual:</strong> Máximo doce (12) meses desde la fecha de recepción.</li>
        <li><strong>Datos vinculados a relación contractual:</strong> Durante la vigencia del contrato y el período adicional conforme a obligaciones legales.</li>
        <li><strong>Obligaciones legales:</strong> El tiempo que establezca la normativa vigente.</li>
      </UL>

      <H2>8. Uso de Cookies</H2>
      <P>
        Nuestro sitio web utiliza únicamente cookies técnicas y estrictamente necesarias para el correcto funcionamiento
        del sitio. Estas cookies no recopilan datos personales identificables y no se utilizan con fines de rastreo,
        publicidad o elaboración de perfiles. No utilizamos cookies de terceros con fines analíticos o publicitarios.
      </P>

      <H2>9. Transferencia de Datos a Terceros</H2>
      <P>No vendemos, alquilamos ni comercializamos sus datos personales. Sus datos podrán ser compartidos únicamente cuando:</P>
      <UL>
        <li>Sea necesario para proveedores de servicios tecnológicos bajo obligación contractual de confidencialidad.</li>
        <li>Lo exija una orden judicial o requerimiento de autoridad competente.</li>
        <li>Usted haya otorgado consentimiento expreso.</li>
      </UL>

      <H2>10. Legislación Aplicable</H2>
      <P>
        La presente Política de Privacidad se rige por la Ley 81 de 26 de marzo de 2019 sobre Protección de Datos
        Personales, el Decreto Ejecutivo 285 de 28 de mayo de 2021 y demás normativa vigente en la República de Panamá.
      </P>

      <H2>11. Contacto</H2>
      <P>Para preguntas o solicitudes relacionadas con esta Política de Privacidad:</P>
      <UL>
        <li><strong>Correo electrónico:</strong> info@quintanareyes.com</li>
        <li><strong>Teléfonos:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Dirección:</strong> PH Twist Tower, Piso 27, Oficina 27H, Obarrio, Ciudad de Panamá</li>
      </UL>
    </Wrapper>
  );
}

function PrivacyPolicyEN() {
  return (
    <Wrapper eyebrow="Legal" title="Privacy Policy">
      <P>
        At Quintana Reyes &amp; Asociados, we value and respect the privacy of our users and clients. This Privacy
        Policy aims to inform you clearly and transparently about how we collect, use, store, and protect your
        personal data through our website quintanareyes.com, in compliance with Law 81 of March 26, 2019, on
        Personal Data Protection of the Republic of Panama and its regulations under Executive Decree 285 of May 28, 2021.
      </P>
      <P>
        By accessing our website and providing us with your personal data, you acknowledge that you have read and
        understood the terms of this Privacy Policy.
      </P>

      <H2>1. Data Controller</H2>
      <P>The entity responsible for the processing of personal data collected through this website is:</P>
      <UL>
        <li><strong>Entity:</strong> Quintana Reyes &amp; Asociados</li>
        <li><strong>Address:</strong> PH Twist Tower, 27th Floor, Office 27H, Obarrio, Panama City, Republic of Panama</li>
        <li><strong>Email:</strong> info@quintanareyes.com</li>
        <li><strong>Phone:</strong> +507 6281-0554 / +507 6606-9100</li>
      </UL>

      <H2>2. Personal Data We Collect</H2>
      <P>We only collect personal data that you voluntarily provide through our contact form:</P>
      <UL>
        <li>Full name</li>
        <li>Phone number</li>
        <li>Email address</li>
        <li>Type of case or inquiry</li>
        <li>Message or description of your inquiry</li>
      </UL>
      <P>We do not collect sensitive personal data (such as health data, sexual orientation, religious beliefs, political affiliation, or ethnic origin) through our website.</P>

      <H2>3. Purpose of Data Processing</H2>
      <UL>
        <li><strong>Inquiry management:</strong> Receiving, managing, and responding to information requests submitted through our contact form.</li>
        <li><strong>Follow-up:</strong> Contacting you to follow up on your inquiry, schedule meetings, or provide additional information about our legal services.</li>
        <li><strong>Preliminary assessment:</strong> Conducting an initial evaluation of your legal situation to determine if we can assist you.</li>
        <li><strong>Service improvement:</strong> Analyzing inquiries in an aggregated and anonymous manner to improve our services.</li>
      </UL>
      <P>Your personal data will never be used for commercial purposes, unsolicited marketing, or sold to third parties.</P>

      <H2>4. Legal Basis for Processing</H2>
      <UL>
        <li><strong>Consent:</strong> By submitting the contact form, you grant your free, express, and informed consent.</li>
        <li><strong>Pre-contractual measures:</strong> Processing may be necessary for steps prior to entering into a legal services agreement.</li>
        <li><strong>Legitimate interest:</strong> When processing is necessary for legitimate interests, provided they do not override your fundamental rights.</li>
      </UL>

      <H2>5. Data Subject Rights (ARCO Rights)</H2>
      <P>Under Law 81 of 2019, you have the right to:</P>
      <UL>
        <li><strong>Access:</strong> Obtain information about whether your personal data is being processed. Response time: ten (10) business days.</li>
        <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data. Response time: five (5) business days.</li>
        <li><strong>Cancellation:</strong> Request deletion of your personal data when no longer necessary or when revoking consent.</li>
        <li><strong>Opposition:</strong> Object to the processing of your personal data or revoke previously given consent.</li>
        <li><strong>Portability:</strong> Request delivery of your personal data in a structured, commonly used format.</li>
      </UL>
      <P>To exercise any of these rights, send a request to <strong>info@quintanareyes.com</strong>.</P>

      <H2>6. Data Security</H2>
      <UL>
        <li>SSL/TLS encryption protocols for data transmission.</li>
        <li>Access restricted to authorized personnel only.</li>
        <li>Internal confidentiality and information handling policies.</li>
        <li>Periodic review of security measures.</li>
      </UL>

      <H2>7. Data Retention</H2>
      <UL>
        <li><strong>Non-contractual inquiries:</strong> Maximum twelve (12) months from date of receipt.</li>
        <li><strong>Contractual data:</strong> During the term of the contract and any legally required additional period.</li>
      </UL>

      <H2>8. Cookies</H2>
      <P>Our website uses only strictly necessary technical cookies. We do not use third-party cookies for analytics or advertising purposes.</P>

      <H2>9. Third-Party Data Transfers</H2>
      <P>We do not sell, rent, or trade your personal data. Data may only be shared with technology service providers under confidentiality obligations, when required by law, or with your express consent.</P>

      <H2>10. Applicable Law</H2>
      <P>This Privacy Policy is governed by Law 81 of March 26, 2019 on Personal Data Protection, Executive Decree 285 of May 28, 2021, and applicable regulations of the Republic of Panama.</P>

      <H2>11. Contact</H2>
      <UL>
        <li><strong>Email:</strong> info@quintanareyes.com</li>
        <li><strong>Phone:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Address:</strong> PH Twist Tower, 27th Floor, Office 27H, Obarrio, Panama City</li>
      </UL>
    </Wrapper>
  );
}
