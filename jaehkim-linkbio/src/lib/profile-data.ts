export type ProfileLinks = {
  research?: string;
  openKakao?: string;
  youtubeChannel?: string;
  x?: string;
  linkedin?: string;
};

export type Profile = {
  slug: string;
  displayName: string;
  /** Used when locale is English (e.g. "Jaehkim") */
  displayNameEn?: string;
  links: ProfileLinks;
};

const profiles: Profile[] = [
  {
    slug: "jaekim",
    displayName: "재킴",
    displayNameEn: "Jaehkim",
    links: {
      research: "https://jaehkim-research.vercel.app/",
      openKakao: "https://open.kakao.com/o/xxxx",
      youtubeChannel: "https://www.youtube.com/@xxxx",
      x: "https://x.com/@xxxx",
      linkedin: "https://www.linkedin.com/in/jaehoon-kim-93017b140",
    },
  },
];

export function getProfile(slug: string): Profile | null {
  return profiles.find((p) => p.slug === slug) ?? null;
}
