export type Tag = {
  id: string;
  label: string;
  color: string;
};

export type Project = {
  id: string;
  logo: string;
  name: string;
  avatar: string;
  createdBy: string;
  description: string;
  isFeatured: boolean;
  website: string;
  discord: string;
  twitter: string;
  github: string;
  gitbook: string;
  whitepaper: string;
  createdAt: string;
  squads: {
    name: string;
    image: string;
    members: string[];
  }[];
  tags: Tag[];
};
