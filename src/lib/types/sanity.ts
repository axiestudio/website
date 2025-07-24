import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { CardPreview, Event, SeoSlug } from "./sanity.types";

export type InstantBook = {
  uuid: string;
  task_id: number;
  org_id: number;
  environment: number;
};

export type Seo = {
  title: string;
  thumbnail?: string;
  slug: SeoSlug;
  description?: string;
};

export type EventCard = Required<
  Pick<Event, "type" | "title" | "dates" | "thumbnail">
> & {
  slug: string;
  description: string;
};

export type AuthorClip = {
  name: string;
  slug?: { current: string };
  avatar?: SanityImageSource;
}

export type BlogPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body: string;
  publishedAt: string;
  featureImage: SanityImageSource;
  author?: AuthorClip;
  authors?: AuthorClip[];
};
