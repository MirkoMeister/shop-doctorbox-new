import Image from "next/image";
import { Highlight } from "@/components/ui/Highlight";
import { LabIcon, PhoneIcon, ShieldIcon } from "@/components/ui/Icons";
import type { Locale } from "@/lib/i18n/config";
import { APP_STORE_URL, PLAY_STORE_URL, REGISTER_TEST_URL } from "@/lib/links";

/**
 * Data protection and security on test product pages (issue #13): results only in the DoctorBox app,
 * end-to-end encryption, the TÜV NORD certificates of DoctorBox GmbH. The certificates cover the
 * management systems of DoctorBox GmbH, not individual products; the wording below says so, as on
 * doctorbox.de. Seal images: public/trust (from doctorbox.de/images/awards).
 */
const copy = {
  de: {
    kicker: "Datenschutz & Sicherheit",
    title: "Dein Befund gehört [[nur dir]]",
    points: [
      {
        icon: PhoneIcon,
        title: "Nur in der DoctorBox App",
        text: "Deinen Befund siehst du ausschließlich in der DoctorBox App, im Browser als Web-App oder auf iPhone und Android. Nicht per E-Mail, nicht per Post.",
      },
      {
        icon: ShieldIcon,
        title: "Ende-zu-Ende-verschlüsselt",
        text: "Dein Befund kommt Ende-zu-Ende-verschlüsselt vom Labor in deine App. Mit wem du ihn teilst, entscheidest nur du.",
      },
      {
        icon: LabIcon,
        title: "Hosting in Deutschland",
        text: "Die Daten liegen auf Servern in Deutschland und werden nach DSGVO verarbeitet.",
      },
    ],
    apps: "DoctorBox App",
    web: "Web-App",
    seals: [
      {
        src: "/trust/DIN-EN-ISO-IEC-27001.jpg",
        alt: "TÜV NORD CERT – DIN EN ISO/IEC 27001",
        title: "ISO/IEC 27001 – Informationssicherheit",
        text: "Die DoctorBox GmbH betreibt ein nach ISO 27001 zertifiziertes Informationssicherheitsmanagementsystem. Die Zertifizierung bezieht sich auf die Managementsysteme der DoctorBox GmbH im zertifizierten Geltungsbereich und nicht auf einzelne Produkte.",
      },
      {
        src: "/trust/DIN-EN-ISO-9001.jpg",
        alt: "TÜV NORD CERT – DIN EN ISO 9001",
        title: "ISO 9001 – Qualitätsmanagement",
        text: "Die DoctorBox GmbH betreibt ein nach ISO 9001 zertifiziertes Qualitätsmanagementsystem. Die Zertifizierung bezieht sich auf das Qualitätsmanagementsystem der DoctorBox GmbH im zertifizierten Geltungsbereich und nicht auf einzelne Produkte oder Dienstleistungen.",
      },
    ],
  },
  en: {
    kicker: "Data protection & security",
    title: "Your result belongs [[to you only]]",
    points: [
      {
        icon: PhoneIcon,
        title: "Only in the DoctorBox app",
        text: "You see your result only in the DoctorBox app, in the browser as a web app or on iPhone and Android. Not by e-mail, not by post.",
      },
      {
        icon: ShieldIcon,
        title: "End-to-end encrypted",
        text: "Your result travels end-to-end encrypted from the laboratory to your app. Only you decide who you share it with.",
      },
      {
        icon: LabIcon,
        title: "Hosted in Germany",
        text: "Data is stored on servers in Germany and processed under the GDPR.",
      },
    ],
    apps: "DoctorBox app",
    web: "Web app",
    seals: [
      {
        src: "/trust/DIN-EN-ISO-IEC-27001.jpg",
        alt: "TÜV NORD CERT – DIN EN ISO/IEC 27001",
        title: "ISO/IEC 27001 – information security",
        text: "DoctorBox GmbH operates an information security management system certified to ISO 27001. The certification covers the management systems of DoctorBox GmbH within the certified scope and does not apply to individual products.",
      },
      {
        src: "/trust/DIN-EN-ISO-9001.jpg",
        alt: "TÜV NORD CERT – DIN EN ISO 9001",
        title: "ISO 9001 – quality management",
        text: "DoctorBox GmbH operates a quality management system certified to ISO 9001. The certification covers the quality management system of DoctorBox GmbH within the certified scope and does not apply to individual products or services.",
      },
    ],
  },
};

export function SecurityTrust({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="security-trust">
      <div className="rounded-[var(--radius-panel)] bg-soft p-6 sm:p-10">
        <p className="text-sm font-medium text-green">{t.kicker}</p>
        <h2 id="security-trust" className="h2 mt-2 scroll-mt-32 text-balance">
          <Highlight text={t.title} />
        </h2>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {t.points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lind text-moss">
                <Icon width={20} height={20} />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="mt-1 block text-[0.95rem] leading-relaxed text-ink-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span className="text-ink-muted">{t.apps}:</span>
          <a href={REGISTER_TEST_URL} target="_blank" rel="noopener" className="font-medium text-green underline underline-offset-4">
            {t.web}
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noopener" className="font-medium text-green underline underline-offset-4">
            App Store
          </a>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="font-medium text-green underline underline-offset-4">
            Google Play
          </a>
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {t.seals.map((s) => (
            <li key={s.src} className="flex gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-card">
              <Image src={s.src} alt={s.alt} width={96} height={96} className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24" />
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{s.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
