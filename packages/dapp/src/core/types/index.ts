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

export type Pathway = {
  id: string;
  streamId: string;
  image: string;
  title: string;
  description: string;
  projectId: string;
  projectStreamId: string;
  quests: { id: string; name: string }[];
  difficulty: string;
  rewardCurrency: string;
  rewardAmount: string;
  rewardUserCap: number;
  isPending: boolean;
  createdBy: string;
};
