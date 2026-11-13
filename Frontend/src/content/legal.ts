import type { Localized } from "@/i18n/types";

/**
 * The four legal notices (site map section 08). Separate pages, so each can be
 * linked to directly from the footer, the enquiry form and any cookie banner.
 *
 * DRAFTS FOR THE FIRM'S REVIEW. The firm supplies or approves the final wording
 * of every notice before launch. Decision 02 (separate cookie notice) is
 * assumed "yes".
 */
export type LegalId = "privacy" | "disclaimer" | "terms" | "cookies";

export interface LegalDoc {
  id: LegalId;
  slug: Localized;
  title: Localized;
  summary: Localized;
  sections: { heading: Localized; body: Localized[] }[];
}

export const LEGAL_UPDATED = "2026-11-01";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: "privacy",
    slug: { en: "privacy-policy", fr: "politique-de-confidentialite" },
    title: { en: "Privacy Policy", fr: "Politique de confidentialité" },
    summary: {
      en: "How we collect, use and protect personal data when you use this website or contact us.",
      fr: "Comment nous collectons, utilisons et protégeons les données personnelles lorsque vous utilisez ce site ou nous contactez.",
    },
    sections: [
      {
        heading: { en: "Who we are", fr: "Qui nous sommes" },
        body: [{
          en: "54 Law Partners is a law firm based in Nairobi, Kenya. We are the data controller for personal data collected through this website, and we process it in accordance with the Data Protection Act, 2019 of Kenya.",
          fr: "54 Law Partners est un cabinet d’avocats établi à Nairobi, au Kenya. Nous sommes responsables du traitement des données personnelles collectées par ce site, que nous traitons conformément à la loi kényane de 2019 sur la protection des données (Data Protection Act, 2019).",
        }],
      },
      {
        heading: { en: "What we collect", fr: "Ce que nous collectons" },
        body: [{
          en: "When you send an enquiry, subscribe to alerts or apply for a role, we collect the details you provide: typically your name, email address, organisation, the content of your message and, for applications, your CV.",
          fr: "Lorsque vous nous adressez une demande, vous abonnez à nos alertes ou postulez à une offre, nous collectons les informations que vous fournissez : en général votre nom, votre adresse e-mail, votre organisation, le contenu de votre message et, pour les candidatures, votre CV.",
        }],
      },
      {
        heading: { en: "How we use it", fr: "Comment nous les utilisons" },
        body: [{
          en: "We use these details only to respond to you, to send the alerts you asked for, or to consider your application. We do not sell personal data, and we share it only with service providers who help us operate this website and our communications, under appropriate safeguards.",
          fr: "Nous utilisons ces informations uniquement pour vous répondre, vous adresser les alertes demandées ou étudier votre candidature. Nous ne vendons pas de données personnelles et ne les partageons qu’avec les prestataires qui nous aident à exploiter ce site et nos communications, avec les garanties appropriées.",
        }],
      },
      {
        heading: { en: "Your rights", fr: "Vos droits" },
        body: [{
          en: "You may ask to access, correct or delete the personal data we hold about you, or object to its processing. To do so, contact us using the details on our contact page.",
          fr: "Vous pouvez demander à accéder aux données personnelles que nous détenons à votre sujet, à les rectifier ou à les supprimer, ou vous opposer à leur traitement. Pour cela, contactez-nous via les coordonnées figurant sur notre page de contact.",
        }],
      },
      {
        heading: { en: "Retention", fr: "Conservation" },
        body: [{
          en: "We keep personal data only for as long as necessary for the purpose for which it was collected, or as required by law or professional rules.",
          fr: "Nous ne conservons les données personnelles que le temps nécessaire à la finalité pour laquelle elles ont été collectées, ou selon ce qu’exigent la loi ou nos règles professionnelles.",
        }],
      },
    ],
  },
  {
    id: "disclaimer",
    slug: { en: "disclaimer", fr: "avertissement" },
    title: { en: "Disclaimer", fr: "Avertissement" },
    summary: {
      en: "The content of this website is general information, not legal advice.",
      fr: "Le contenu de ce site constitue une information générale et non un conseil juridique.",
    },
    sections: [
      {
        heading: { en: "No legal advice", fr: "Absence de conseil juridique" },
        body: [{
          en: "Material on this website, including our insights, is provided for general information only. It is not legal advice and should not be relied on as such. You should take specific advice on your circumstances before acting.",
          fr: "Les contenus de ce site, y compris nos analyses, sont fournis à titre d’information générale uniquement. Ils ne constituent pas un conseil juridique et ne doivent pas être utilisés comme tel. Vous devez obtenir un conseil adapté à votre situation avant d’agir.",
        }],
      },
      {
        heading: { en: "No lawyer–client relationship", fr: "Absence de relation avocat-client" },
        body: [{
          en: "Using this website, or sending us an enquiry through it, does not create a lawyer–client relationship. Please do not send confidential information until we have confirmed in writing that we can act for you.",
          fr: "L’utilisation de ce site, ou l’envoi d’une demande par son intermédiaire, ne crée pas de relation avocat-client. Merci de ne transmettre aucune information confidentielle avant que nous ayons confirmé par écrit pouvoir vous représenter.",
        }],
      },
      {
        heading: { en: "Representative matters", fr: "Dossiers représentatifs" },
        body: [{
          en: "Some matters described on this website were handled by our lawyers before they joined the firm. Past outcomes do not indicate future results.",
          fr: "Certains dossiers présentés sur ce site ont été traités par nos avocats avant leur arrivée au cabinet. Les résultats passés ne préjugent pas des résultats futurs.",
        }],
      },
    ],
  },
  {
    id: "terms",
    slug: { en: "terms-of-use", fr: "conditions-d-utilisation" },
    title: { en: "Terms of Use", fr: "Conditions d’utilisation" },
    summary: {
      en: "The terms on which you may use this website.",
      fr: "Les conditions auxquelles vous pouvez utiliser ce site.",
    },
    sections: [
      {
        heading: { en: "Use of this website", fr: "Utilisation du site" },
        body: [{
          en: "You may view and print material from this website for your own information. You may not reproduce or distribute it for commercial purposes without our written permission.",
          fr: "Vous pouvez consulter et imprimer les contenus de ce site pour votre propre information. Vous ne pouvez pas les reproduire ni les diffuser à des fins commerciales sans notre autorisation écrite.",
        }],
      },
      {
        heading: { en: "Intellectual property", fr: "Propriété intellectuelle" },
        body: [{
          en: "The content, design and marks on this website belong to 54 Law Partners or its licensors.",
          fr: "Les contenus, la conception et les signes distinctifs de ce site appartiennent à 54 Law Partners ou à ses concédants.",
        }],
      },
      {
        heading: { en: "Links to other sites", fr: "Liens vers d’autres sites" },
        body: [{
          en: "Where we link to articles published elsewhere, we are not responsible for the content or availability of those sites.",
          fr: "Lorsque nous renvoyons vers des articles publiés ailleurs, nous ne sommes pas responsables du contenu ni de la disponibilité de ces sites.",
        }],
      },
      {
        heading: { en: "Governing law", fr: "Droit applicable" },
        body: [{
          en: "These terms are governed by the laws of Kenya.",
          fr: "Les présentes conditions sont régies par le droit kényan.",
        }],
      },
    ],
  },
  {
    id: "cookies",
    slug: { en: "cookie-notice", fr: "politique-cookies" },
    title: { en: "Cookie Notice", fr: "Politique relative aux cookies" },
    summary: {
      en: "What this website stores on your device, and why.",
      fr: "Ce que ce site enregistre sur votre appareil, et pourquoi.",
    },
    sections: [
      {
        heading: { en: "What we use", fr: "Ce que nous utilisons" },
        body: [{
          en: "This website does not use advertising or tracking cookies. It uses only what is strictly necessary for the site to work, such as remembering that the opening animation has already played during your visit.",
          fr: "Ce site n’utilise pas de cookies publicitaires ou de suivi. Il n’utilise que ce qui est strictement nécessaire à son fonctionnement, par exemple pour se souvenir que l’animation d’ouverture a déjà été jouée pendant votre visite.",
        }],
      },
      {
        heading: { en: "Changes", fr: "Évolutions" },
        body: [{
          en: "If we introduce analytics or other non-essential cookies, we will update this notice and ask for your consent first.",
          fr: "Si nous introduisons des cookies de mesure d’audience ou d’autres cookies non essentiels, nous mettrons cette politique à jour et vous demanderons d’abord votre consentement.",
        }],
      },
    ],
  },
];

export function getLegalDoc(slug: string, locale: "en" | "fr"): LegalDoc | undefined {
  return LEGAL_DOCS.find((doc) => doc.slug[locale] === slug);
}

export function getLegalById(id: LegalId): LegalDoc {
  return LEGAL_DOCS.find((doc) => doc.id === id)!;
}
