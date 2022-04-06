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
  slogan: string;
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
  slogan: string;
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

export type Quest = {
  id: string;
  streamId: string;
  image: string;
  completedBy: string[];
  projectId: string;
  pathwayId: string;
  owner: string;
  name: string;
  questType: string;
  description: string;
  slogan: string;
  isPending: string;
  website: string;
  network: string;
  rewardAmount: string;
  rewardUserCap: number;
  rewardCurrency: string;
  // unlocked: boolean;
};
