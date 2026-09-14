import { Dictionary, SupportedLanguage } from '@/models/locale';
import { APIResponse, APIResponseData } from '@/types/types';
import {
  EducationalOrganization,
  Event as EventSchema,
  NewsArticle,
  Person,
  WithContext,
} from 'schema-dts';
import { getPlainText } from '../strapi/blocks-converter';
import { getStrapiUrl } from '../strapi/get-strapi-url';

export const getOrganizationJsonLd = (dictionary: Dictionary) => {
  const jsonLd: WithContext<EducationalOrganization> = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Biopsi ry',
    description: dictionary.pages_home.hero.description,
    openingHours: 'Mo,Tu,We,Th 09:00-15:00',
    foundingDate: '2001-01-01',
    url: 'https://biopsi.fi',
    keywords: 'Biopsi, Biopsi ry, Tampere, Tampereen yliopisto, Ainejärjestö',
    logo: 'https://biopsi.fi/logo.png',
    address: {
      '@type': 'PostalAddress',
      postalCode: '33520',
      streetAddress: 'Arvo Ylpön katu 34, huone F108',
      addressCountry: 'FI',
      addressLocality: 'Tampere',
    },
    vatID: 'FI21011761',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: dictionary.navigation.board,
      email: 'hallitus@biopsi.fi',
      availableLanguage: ['Finnish', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/biopsiuta',
      'https://www.tiktok.com/@biopsiry',
      'https://www.instagram.com/biopsiry/'
    ]
  };

  return jsonLd;
};

export const getEventJsonLd = (
  event: APIResponse<'api::event.event'>,
  lang: SupportedLanguage,
) => {
  const description = getPlainText(
    event.data[lang === 'en' ? 'DescriptionEn' : 'DescriptionFi'],
  ).slice(0, 300);

  const imageUrlLocalized =
    lang === 'en' && event.data.ImageEn?.url
      ? event.data.ImageEn?.url
      : event.data.Image?.url;

  const jsonLd: WithContext<EventSchema> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.data[lang === 'en' ? 'NameEn' : 'NameFi'],
    url: `https://biopsi.fi/${lang}/events/${event.data.Slug}`,
    startDate: new Date(event.data.StartDate).toISOString(),
    endDate: new Date(event.data.EndDate).toISOString(),
    description: description.slice(0, 300),
    image: imageUrlLocalized ? getStrapiUrl(imageUrlLocalized) : undefined,
    location: {
      '@type': 'Place',
      name: event.data[lang === 'en' ? 'LocationEn' : 'LocationFi'],
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    offers: event.data.Registration?.TicketTypes.map((ticket) => ({
      '@type': 'Offer',
      name: lang === 'en' ? ticket.NameEn : ticket.NameFi,
      price: ticket.Price,
      priceCurrency: 'EUR',
      url: `https://biopsi.fi/${lang}/events/${event.data.Slug}`,
      validFrom: new Date(event.data.StartDate).toISOString(),
      seller: {
        '@type': 'Organization',
        name: 'Biopsi ry',
        url: 'https://biopsi.fi',
      },
    })),
    organizer: {
      '@type': 'Organization',
      name: 'Biopsi ry',
      url: 'https://biopsi.fi',
      logo: {
        '@type': 'ImageObject',
        url: 'https://biopsi.fi/logo.png',
      },
    },
    inLanguage: {
      '@type': 'Language',
      name: lang === 'en' ? 'English' : 'Finnish',
      alternateName: lang === 'en' ? 'en' : 'fi',
    },
  };

  return jsonLd;
};

export const getNewsJsonLd = (
  news: APIResponseData<'api::news-single.news-single'>,
  lang: SupportedLanguage,
) => {
  const jsonLd: WithContext<NewsArticle> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.description,
    image: news.banner?.url ? getStrapiUrl(news.banner.url) : undefined,
    datePublished: new Date(news.createdAt!).toISOString(),
    dateModified: new Date(news.updatedAt!).toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Biopsi ry',
      logo: {
        '@type': 'ImageObject',
        url: 'https://biopsi.fi/logo.png',
      },
    },
    author: {
      '@type': 'Person',
      name: news.authorName,
      image: news.authorImage?.url
        ? getStrapiUrl(news.authorImage.url)
        : undefined,
    },
    inLanguage: {
      '@type': 'Language',
      name: lang === 'en' ? 'English' : 'Finnish',
      alternateName: lang === 'en' ? 'en' : 'fi',
    },
  };

  return jsonLd;
};

export const getBoardMemberJsonLd = (
  member: APIResponseData<'api::board-member.board-member'>,
) => {
  const jsonLd: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member?.fullName,
    email: member.boardRoles!.map((role) => role.email!),
    image: member!.image?.url ? getStrapiUrl(member?.image.url) : undefined,
    jobTitle: member.boardRoles!.map((role) => role.title!),
    worksFor: {
      '@type': 'Organization',
      name: 'Biopsi ry',
      url: 'https://biopsi.fi',
    },
  };

  return jsonLd;
};
