'use client';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Locale } from '@/lib/i18n';

interface Props {
  locale: Locale;
}

export function LegalNotice({ locale }: Props) {
  if (locale === 'en') return <LegalNoticeEN />;
  return <LegalNoticeES />;
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
        <div className="font-sans text-sm text-[#0E0E0E] leading-relaxed space-y-8">
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

function LegalNoticeES() {
  return (
    <Wrapper eyebrow="Legal" title="Aviso Legal">
      <H2>1. Identificación del Titular del Sitio Web</H2>
      <P>El presente sitio web, accesible a través del dominio quintanareyes.com, es propiedad y está operado por:</P>
      <UL>
        <li><strong>Denominación:</strong> Quintana Reyes &amp; Asociados</li>
        <li><strong>Actividad:</strong> Despacho de abogados / Firma de servicios legales</li>
        <li><strong>Domicilio:</strong> PH Twist Tower, Piso 27, Oficina 27H, Obarrio, Ciudad de Panamá, República de Panamá</li>
        <li><strong>Correo electrónico:</strong> info@quintanareyes.com</li>
        <li><strong>Teléfonos:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Sitio web:</strong> quintanareyes.com</li>
      </UL>

      <H2>2. Objeto del Sitio Web</H2>
      <P>
        El sitio web quintanareyes.com tiene como finalidad proporcionar información general sobre Quintana Reyes &amp;
        Asociados, sus áreas de práctica, su equipo profesional y sus datos de contacto, así como facilitar un medio de
        comunicación inicial con personas interesadas en nuestros servicios legales a través de un formulario de contacto.
      </P>

      <H2>3. Exclusión de Asesoría Legal</H2>
      <P>
        <strong>LA INFORMACIÓN CONTENIDA EN ESTE SITIO WEB ES DE CARÁCTER MERAMENTE INFORMATIVO Y GENERAL. BAJO
        NINGUNA CIRCUNSTANCIA DEBE INTERPRETARSE COMO ASESORÍA JURÍDICA, LEGAL, FISCAL O PROFESIONAL DE NINGUNA
        NATURALEZA.</strong>
      </P>
      <P>
        La información publicada en quintanareyes.com, incluyendo artículos, descripciones de áreas de práctica,
        publicaciones y cualquier otro contenido, no constituye ni pretende constituir una opinión legal, una
        recomendación profesional ni la creación de una relación abogado-cliente.
      </P>
      <P>
        La lectura, el acceso o el uso de este sitio web, así como el envío de un formulario de contacto o de
        comunicaciones electrónicas, no crea ni establece una relación abogado-cliente con Quintana Reyes &amp; Asociados.
        Dicha relación solo se perfeccionará mediante la formalización de un contrato de prestación de servicios legales
        suscrito por ambas partes.
      </P>
      <P>
        Cada situación jurídica es única y requiere un análisis particular. Le recomendamos consultar directamente con
        un abogado antes de tomar cualquier decisión basada en la información de este sitio web.
      </P>

      <H2>4. Propiedad Intelectual</H2>
      <P>
        Todos los contenidos del sitio web, incluyendo textos, imágenes, gráficos, logotipos, iconos, diseños,
        estructura de navegación, bases de datos, códigos fuente, marcas y nombres comerciales, son propiedad exclusiva
        de Quintana Reyes &amp; Asociados o se utilizan con la debida autorización.
      </P>
      <P>
        Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de
        explotación, total o parcial, de los contenidos sin autorización previa y por escrito de Quintana Reyes &amp;
        Asociados. Se permite únicamente la visualización para uso personal y privado, citando la fuente.
      </P>

      <H2>5. Limitación de Responsabilidad</H2>
      <P>Quintana Reyes &amp; Asociados no será responsable de:</P>
      <UL>
        <li>Daños derivados del acceso o uso del sitio web, incluyendo daños en sistemas informáticos o causados por virus.</li>
        <li>Daños derivados del uso inadecuado de la información contenida en el sitio web o decisiones tomadas sin consultar a un profesional.</li>
        <li>La interrupción, suspensión o cancelación del acceso al sitio web.</li>
        <li>Errores u omisiones en los contenidos del sitio web.</li>
        <li>La imposibilidad de conexión por causas ajenas, tales como fallos técnicos o fuerza mayor.</li>
      </UL>

      <H2>6. Condiciones de Uso</H2>
      <P>El acceso y uso del sitio web implica la aceptación plena del presente Aviso Legal. El usuario se compromete a:</P>
      <UL>
        <li>Utilizar el sitio web de conformidad con la ley y el presente Aviso Legal.</li>
        <li>No utilizar el sitio con fines ilícitos o fraudulentos.</li>
        <li>No introducir virus informáticos ni sistemas que puedan causar daños.</li>
        <li>No reproducir o modificar contenidos sin autorización.</li>
      </UL>

      <H2>7. Enlaces a Sitios Web de Terceros</H2>
      <P>
        Este sitio web puede contener enlaces a páginas de terceros proporcionados a título informativo. Quintana
        Reyes &amp; Asociados no ejerce control sobre dichos sitios y no asume responsabilidad por sus contenidos,
        políticas de privacidad o servicios. La inclusión de enlaces no implica aprobación, asociación o patrocinio.
      </P>

      <H2>8. Comunicaciones Electrónicas</H2>
      <P>
        Las comunicaciones realizadas a través del formulario de contacto o correo electrónico no constituyen, por sí
        solas, una relación abogado-cliente. La información transmitida por medios electrónicos puede no ser
        completamente segura. Se recomienda abstenerse de enviar información confidencial antes de formalizar una
        relación profesional.
      </P>

      <H2>9. Confidencialidad Profesional</H2>
      <P>
        Una vez formalizada la relación abogado-cliente, Quintana Reyes &amp; Asociados está sujeto al deber de secreto
        profesional y confidencialidad conforme a la legislación y normas éticas aplicables en la República de Panamá.
      </P>

      <H2>10. Ley Aplicable y Jurisdicción</H2>
      <P>
        El presente Aviso Legal se rige por las leyes vigentes de la República de Panamá. Para la resolución de
        cualquier controversia, las partes se someten a la jurisdicción de los juzgados y tribunales competentes de la
        Ciudad de Panamá, República de Panamá.
      </P>

      <H2>11. Modificaciones</H2>
      <P>
        Quintana Reyes &amp; Asociados se reserva el derecho de modificar el presente Aviso Legal en cualquier momento.
        Cualquier modificación será efectiva desde su publicación en este sitio web. Se recomienda revisar periódicamente
        este Aviso Legal.
      </P>

      <H2>12. Contacto</H2>
      <UL>
        <li><strong>Correo electrónico:</strong> info@quintanareyes.com</li>
        <li><strong>Teléfonos:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Dirección:</strong> PH Twist Tower, Piso 27, Oficina 27H, Obarrio, Ciudad de Panamá</li>
      </UL>
    </Wrapper>
  );
}

function LegalNoticeEN() {
  return (
    <Wrapper eyebrow="Legal" title="Legal Notice">
      <H2>1. Website Owner Identification</H2>
      <P>This website, accessible at quintanareyes.com, is owned and operated by:</P>
      <UL>
        <li><strong>Entity:</strong> Quintana Reyes &amp; Asociados</li>
        <li><strong>Activity:</strong> Law firm / Legal services</li>
        <li><strong>Address:</strong> PH Twist Tower, 27th Floor, Office 27H, Obarrio, Panama City, Republic of Panama</li>
        <li><strong>Email:</strong> info@quintanareyes.com</li>
        <li><strong>Phone:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Website:</strong> quintanareyes.com</li>
      </UL>

      <H2>2. Purpose of the Website</H2>
      <P>
        The website quintanareyes.com is intended to provide general information about Quintana Reyes &amp; Asociados,
        its practice areas, professional team, and contact information, as well as to facilitate initial communication
        with individuals interested in our legal services through a contact form.
      </P>

      <H2>3. Disclaimer - No Legal Advice</H2>
      <P>
        <strong>THE INFORMATION CONTAINED ON THIS WEBSITE IS FOR GENERAL INFORMATIONAL PURPOSES ONLY. IT SHOULD NOT
        BE CONSTRUED AS LEGAL, TAX, OR PROFESSIONAL ADVICE OF ANY KIND.</strong>
      </P>
      <P>
        The information published on quintanareyes.com, including articles, practice area descriptions, publications,
        and any other content, does not constitute a legal opinion, professional recommendation, or the creation of an
        attorney-client relationship.
      </P>
      <P>
        Accessing or using this website, as well as submitting a contact form or electronic communications, does not
        create an attorney-client relationship. Such a relationship is only established through a formal legal services
        agreement signed by both parties.
      </P>

      <H2>4. Intellectual Property</H2>
      <P>
        All content on this website, including text, images, graphics, logos, icons, designs, navigation structure,
        databases, source code, trademarks, and trade names, are the exclusive property of Quintana Reyes &amp;
        Asociados or used with proper authorization. Unauthorized reproduction, distribution, or exploitation is prohibited.
      </P>

      <H2>5. Limitation of Liability</H2>
      <P>Quintana Reyes &amp; Asociados shall not be liable for:</P>
      <UL>
        <li>Damages arising from access to or use of the website, including computer system damage or viruses.</li>
        <li>Damages from improper use of information or decisions made without consulting a professional.</li>
        <li>Interruption, suspension, or cancellation of website access.</li>
        <li>Errors or omissions in website content.</li>
        <li>Connection issues due to external causes such as technical failures or force majeure.</li>
      </UL>

      <H2>6. Terms of Use</H2>
      <P>By accessing this website, you agree to comply with this Legal Notice. Users agree to:</P>
      <UL>
        <li>Use the website lawfully and in accordance with this Legal Notice.</li>
        <li>Not use the website for illegal or fraudulent purposes.</li>
        <li>Not introduce viruses or systems that may cause damage.</li>
        <li>Not reproduce or modify content without authorization.</li>
      </UL>

      <H2>7. Third-Party Links</H2>
      <P>
        This website may contain links to third-party websites provided for informational purposes. Quintana Reyes &amp;
        Asociados has no control over such sites and assumes no responsibility for their content, privacy policies, or
        services.
      </P>

      <H2>8. Electronic Communications</H2>
      <P>
        Communications through the contact form or email do not, by themselves, establish an attorney-client
        relationship. Information transmitted electronically may not be fully secure. Refrain from sending confidential
        information before a professional relationship has been formally established.
      </P>

      <H2>9. Professional Confidentiality</H2>
      <P>
        Once an attorney-client relationship is formalized, Quintana Reyes &amp; Asociados is bound by professional
        secrecy and confidentiality obligations under applicable Panamanian law and ethical standards.
      </P>

      <H2>10. Applicable Law and Jurisdiction</H2>
      <P>
        This Legal Notice is governed by the laws of the Republic of Panama. Any disputes shall be submitted to the
        competent courts of Panama City, Republic of Panama.
      </P>

      <H2>11. Modifications</H2>
      <P>
        Quintana Reyes &amp; Asociados reserves the right to modify this Legal Notice at any time. Changes are effective
        upon publication on this website. Users are encouraged to review this Legal Notice periodically.
      </P>

      <H2>12. Contact</H2>
      <UL>
        <li><strong>Email:</strong> info@quintanareyes.com</li>
        <li><strong>Phone:</strong> +507 6281-0554 / +507 6606-9100</li>
        <li><strong>Address:</strong> PH Twist Tower, 27th Floor, Office 27H, Obarrio, Panama City</li>
      </UL>
    </Wrapper>
  );
}
