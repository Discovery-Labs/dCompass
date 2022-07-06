import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type ApprovePathwayInput = {
  id: Scalars["String"];
};

export type ApproveProjectInput = {
  id: Scalars["String"];
  tokenUris: Array<Scalars["String"]>;
};

export type ApproveQuestInput = {
  id: Scalars["String"];
  questType: Scalars["String"];
};

export type ApproveQuestSolutionInput = {
  adventurerDID: Scalars["String"];
  id: Scalars["String"];
  solutionId: Scalars["String"];
};

export type BountyQuest = {
  __typename?: "BountyQuest";
  chainId: Scalars["Int"];
  completedBy: Array<Scalars["String"]>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  expandedServerSignatures?: Maybe<Array<ExpandedServerSignature>>;
  id: Scalars["String"];
  image: Scalars["String"];
  isPending?: Maybe<Scalars["Boolean"]>;
  isProjectContributor: Scalars["Boolean"];
  name: Scalars["String"];
  namespace?: Maybe<Scalars["String"]>;
  pathwayId: Scalars["String"];
  questType: Scalars["String"];
  rewardAmount: Scalars["Float"];
  rewardCurrency: Scalars["String"];
  rewardUserCap: Scalars["Int"];
  slogan: Scalars["String"];
  streamId: Scalars["String"];
  submissions: Array<SolutionSubmission>;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

export type ClaimPathwayRewardsInput = {
  did: Scalars["String"];
  pathwayId: Scalars["String"];
};

export type ClaimQuestRewardsInput = {
  did: Scalars["String"];
  questId: Scalars["String"];
  questType: Scalars["String"];
};

export type CreatePathwayInput = {
  id: Scalars["String"];
  pathwayCreatorSignature: Scalars["String"];
};

export type CreateProjectInput = {
  id: Scalars["String"];
  tokenUris: Array<Scalars["String"]>;
};

export type CreateQuestInput = {
  id: Scalars["String"];
};

export type EditProjectInput = {
  color?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  discord?: InputMaybe<Scalars["String"]>;
  github?: InputMaybe<Scalars["String"]>;
  id: Scalars["String"];
  logo?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  squads?: InputMaybe<Array<ProjectSquadsInput>>;
  tokenUris?: InputMaybe<Array<Scalars["String"]>>;
  twitter?: InputMaybe<Scalars["String"]>;
  website?: InputMaybe<Scalars["String"]>;
  whitepaper?: InputMaybe<Scalars["String"]>;
};

export type ExpandedServerSignature = {
  __typename?: "ExpandedServerSignature";
  r: Scalars["String"];
  s: Scalars["String"];
  v: Scalars["Int"];
};

export type GetBountyQuestByIdInput = {
  did: Scalars["String"];
  questId: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  /** Approve a new Pathway in dCompass */
  approvePathway?: Maybe<Pathway>;
  /** Approves a new Project in dCompass */
  approveProject?: Maybe<Project>;
  /** Approve a new Quest in dCompass */
  approveQuest?: Maybe<Quest>;
  /** Approve a solution for a BountyQuest in dCompass */
  approveQuestSolution?: Maybe<BountyQuest>;
  /** Verify a new Pathway right before minting in dCompass */
  claimPathwayRewards?: Maybe<Pathway>;
  /** Verify a new Quest right before minting in dCompass */
  claimQuestRewards?: Maybe<Quest>;
  /** Create a new Pathway in dCompass */
  createPathway?: Maybe<Pathway>;
  /** Create a new Project in dCompass */
  createProject?: Maybe<Project>;
  /** Create a new Quest in dCompass */
  createQuest?: Maybe<Quest>;
  /** Create a new Quiz quest in dCompass */
  createQuizQuest?: Maybe<QuizQuest>;
  /** Edit project in dCompass */
  editProject?: Maybe<Project>;
  /** Sign in a user and notifies the connected clients */
  signIn: User;
  /** Logs out a user an notifies the connected clients */
  signOut: Scalars["Boolean"];
  /** Submits quest answers */
  submitQuestAnswers: SubmitQuestAnswersOutput;
  /** Submits quest solution */
  submitQuestSolution: Scalars["Boolean"];
  /** Verify a new Pathway right before minting in dCompass */
  verifyPathway?: Maybe<Pathway>;
  /** Verify a new Quest right before minting in dCompass */
  verifyQuest?: Maybe<Quest>;
};

export type MutationApprovePathwayArgs = {
  input: ApprovePathwayInput;
};

export type MutationApproveProjectArgs = {
  input: ApproveProjectInput;
};

export type MutationApproveQuestArgs = {
  input: ApproveQuestInput;
};

export type MutationApproveQuestSolutionArgs = {
  input: ApproveQuestSolutionInput;
};

export type MutationClaimPathwayRewardsArgs = {
  input: ClaimPathwayRewardsInput;
};

export type MutationClaimQuestRewardsArgs = {
  input: ClaimQuestRewardsInput;
};

export type MutationCreatePathwayArgs = {
  input: CreatePathwayInput;
};

export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};

export type MutationCreateQuestArgs = {
  input: CreateQuestInput;
};

export type MutationCreateQuizQuestArgs = {
  input: CreateQuestInput;
};

export type MutationEditProjectArgs = {
  input: EditProjectInput;
};

export type MutationSignInArgs = {
  input: SiweRegisterInput;
};

export type MutationSubmitQuestAnswersArgs = {
  input: QuestAnswersSubmitionInput;
};

export type MutationSubmitQuestSolutionArgs = {
  input: QuestSolutionSubmissionInput;
};

export type MutationVerifyPathwayArgs = {
  input: VerifyPathwayInput;
};

export type MutationVerifyQuestArgs = {
  input: VerifyQuestInput;
};

export type Pathway = {
  __typename?: "Pathway";
  bountyQuests?: Maybe<Array<BountyQuest>>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  difficulty: PathwayDifficultyEnum;
  expandedServerSignatures?: Maybe<Array<ExpandedServerSignature>>;
  id: Scalars["String"];
  image: Scalars["String"];
  isPending?: Maybe<Scalars["Boolean"]>;
  prerequisites?: Maybe<Array<Scalars["String"]>>;
  projectId: Scalars["String"];
  projectStreamId: Scalars["String"];
  quests?: Maybe<Array<Quest>>;
  quizQuests?: Maybe<Array<QuizQuest>>;
  rewardAmount: Scalars["Float"];
  rewardCurrency: Scalars["String"];
  rewardUserCap: Scalars["Int"];
  slogan: Scalars["String"];
  streamId: Scalars["String"];
  title: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

/** The difficulty of a pathway, from beginner to wizard where wizard is the most difficult mode */
export enum PathwayDifficultyEnum {
  Advanced = "ADVANCED",
  Beginner = "BEGINNER",
  Expert = "EXPERT",
  Intermediate = "INTERMEDIATE",
  Wizard = "WIZARD",
}

export type Project = {
  __typename?: "Project";
  color?: Maybe<Scalars["String"]>;
  contracts?: Maybe<Array<Scalars["String"]>>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  discord?: Maybe<Scalars["String"]>;
  gitbook?: Maybe<Scalars["String"]>;
  github?: Maybe<Scalars["String"]>;
  id: Scalars["String"];
  isFeatured: Scalars["Boolean"];
  logo?: Maybe<Scalars["String"]>;
  members?: Maybe<Array<Scalars["String"]>>;
  name: Scalars["String"];
  pathways: Array<Pathway>;
  peerProjects?: Maybe<Array<Scalars["String"]>>;
  pendingMembers?: Maybe<Array<Scalars["String"]>>;
  pendingPathways: Array<Pathway>;
  repos?: Maybe<Array<Scalars["String"]>>;
  slogan: Scalars["String"];
  squads: Array<Squad>;
  streamId: Scalars["String"];
  tags?: Maybe<Array<Tag>>;
  tokenUris: Array<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
  updatedBy?: Maybe<Scalars["String"]>;
  website: Scalars["String"];
  whitepaper?: Maybe<Scalars["String"]>;
};

export type ProjectSquadsInput = {
  image: Scalars["String"];
  members: Array<Scalars["String"]>;
  name: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  /** Gets all the pathways in dCompass */
  getAllPathwaysByProjectId?: Maybe<Project>;
  /** Gets all the projects in dCompass */
  getAllProjects?: Maybe<Array<Project>>;
  /** Gets all the quests in dCompass */
  getAllQuestsByPathwayId?: Maybe<Pathway>;
  /** Gets all the tags in Discovery */
  getAllTags?: Maybe<Array<Tag>>;
  /** Return the DID of the dCompass backend server */
  getAppDID?: Maybe<Scalars["String"]>;
  /** Gets a quiz quest by its ID */
  getBountyQuestById?: Maybe<BountyQuest>;
  /** Gets a nonce */
  getNonce?: Maybe<Scalars["String"]>;
  /** Gets a pathway by its Stream ID */
  getPathwayById?: Maybe<Pathway>;
  /** Gets a project by its document ID */
  getProjectById?: Maybe<Project>;
  /** Gets a quiz quest by its ID */
  getQuizQuestById?: Maybe<QuizQuest>;
  /** Gets the currently logged in user */
  me?: Maybe<User>;
};

export type QueryGetAllPathwaysByProjectIdArgs = {
  projectId: Scalars["String"];
};

export type QueryGetAllQuestsByPathwayIdArgs = {
  pathwayId: Scalars["String"];
};

export type QueryGetBountyQuestByIdArgs = {
  input: GetBountyQuestByIdInput;
};

export type QueryGetPathwayByIdArgs = {
  pathwayId: Scalars["String"];
};

export type QueryGetProjectByIdArgs = {
  projectId: Scalars["String"];
};

export type QueryGetQuizQuestByIdArgs = {
  questId: Scalars["String"];
};

export type Quest = {
  __typename?: "Quest";
  chainId: Scalars["Int"];
  completedBy: Array<Scalars["String"]>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  expandedServerSignatures?: Maybe<Array<ExpandedServerSignature>>;
  id: Scalars["String"];
  image: Scalars["String"];
  isPending?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  namespace?: Maybe<Scalars["String"]>;
  pathwayId: Scalars["String"];
  questType: Scalars["String"];
  rewardAmount: Scalars["Float"];
  rewardCurrency: Scalars["String"];
  rewardUserCap: Scalars["Int"];
  slogan: Scalars["String"];
  streamId: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

export type QuestAnswersSubmitionInput = {
  did: Scalars["String"];
  questId: Scalars["String"];
  questionAnswers: Array<QuestQuestionAnswerInput>;
};

export type QuestQuestionAnswerInput = {
  answer: Array<Scalars["String"]>;
  question: Scalars["String"];
};

export type QuestSolutionSubmissionInput = {
  did: Scalars["String"];
  questId: Scalars["String"];
  solution: Scalars["String"];
};

export type QuizQuest = {
  __typename?: "QuizQuest";
  chainId: Scalars["Int"];
  completedBy: Array<Scalars["String"]>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  expandedServerSignatures?: Maybe<Array<ExpandedServerSignature>>;
  id: Scalars["String"];
  image: Scalars["String"];
  isPending?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  namespace?: Maybe<Scalars["String"]>;
  pathwayId: Scalars["String"];
  questType: Scalars["String"];
  questions?: Maybe<Array<QuizQuestion>>;
  rewardAmount: Scalars["Float"];
  rewardCurrency: Scalars["String"];
  rewardUserCap: Scalars["Int"];
  slogan: Scalars["String"];
  streamId: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

export type QuizQuestion = {
  __typename?: "QuizQuestion";
  answer: Scalars["String"];
  choices: Array<Scalars["String"]>;
  id: Scalars["String"];
  question: Scalars["String"];
};

/** EIP-191 signature scheme */
export enum SignatureType {
  PersonalSignature = "PERSONAL_SIGNATURE",
}

export type SiweMessageInput = {
  address: Scalars["String"];
  chainId: Scalars["Int"];
  domain: Scalars["String"];
  expirationTime?: InputMaybe<Scalars["String"]>;
  issuedAt: Scalars["String"];
  nonce: Scalars["String"];
  notBefore?: InputMaybe<Scalars["String"]>;
  requestId?: InputMaybe<Scalars["String"]>;
  resources?: InputMaybe<Array<Scalars["String"]>>;
  signature: Scalars["String"];
  statement: Scalars["String"];
  type: SignatureType;
  uri: Scalars["String"];
  version: Scalars["String"];
};

export type SiweRegisterInput = {
  ens?: InputMaybe<Scalars["String"]>;
  message: SiweMessageInput;
};

export type SolutionSubmission = {
  __typename?: "SolutionSubmission";
  did: Scalars["String"];
  id: Scalars["String"];
  reviewComment?: Maybe<Scalars["String"]>;
  solution: Scalars["String"];
  status: Scalars["String"];
};

export type Squad = {
  __typename?: "Squad";
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  image?: Maybe<Scalars["String"]>;
  members: Array<Scalars["String"]>;
  name: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

export type SubmitQuestAnswersOutput = {
  __typename?: "SubmitQuestAnswersOutput";
  chainId: Scalars["Int"];
  completedBy?: Maybe<Array<Scalars["String"]>>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  createdBy: Scalars["String"];
  description: Scalars["String"];
  expandedServerSignatures?: Maybe<Array<ExpandedServerSignature>>;
  id: Scalars["String"];
  image: Scalars["String"];
  isPending?: Maybe<Scalars["Boolean"]>;
  isSuccess: Scalars["Boolean"];
  name: Scalars["String"];
  namespace?: Maybe<Scalars["String"]>;
  pathwayId: Scalars["String"];
  questType: Scalars["String"];
  rewardAmount: Scalars["Int"];
  rewardCurrency: Scalars["String"];
  rewardUserCap: Scalars["Int"];
  slogan: Scalars["String"];
  streamId: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
};

export type Tag = {
  __typename?: "Tag";
  color: Scalars["String"];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars["DateTime"];
  id: Scalars["String"];
  label: Scalars["String"];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars["DateTime"];
  value: Scalars["String"];
};

export type User = {
  __typename?: "User";
  addresses: Array<Scalars["String"]>;
  did: Scalars["String"];
  id: Scalars["String"];
};

export type VerifyPathwayInput = {
  id: Scalars["String"];
};

export type VerifyQuestInput = {
  id: Scalars["String"];
  questType: Scalars["String"];
};

export type GetAppDidQueryVariables = Exact<{ [key: string]: never }>;

export type GetAppDidQuery = {
  __typename?: "Query";
  getAppDID?: string | null;
};

export type CreatePathwayMutationVariables = Exact<{
  input: CreatePathwayInput;
}>;

export type CreatePathwayMutation = {
  __typename?: "Mutation";
  createPathway?: {
    __typename?: "Pathway";
    id: string;
    title: string;
    difficulty: PathwayDifficultyEnum;
    description: string;
    slogan: string;
  } | null;
};

export type ApprovePathwayMutationVariables = Exact<{
  input: ApprovePathwayInput;
}>;

export type ApprovePathwayMutation = {
  __typename?: "Mutation";
  approvePathway?: {
    __typename?: "Pathway";
    id: string;
    title: string;
    difficulty: PathwayDifficultyEnum;
    image: string;
    description: string;
    slogan: string;
    projectStreamId: string;
    isPending?: boolean | null;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type VerifyPathwayMutationVariables = Exact<{
  input: VerifyPathwayInput;
}>;

export type VerifyPathwayMutation = {
  __typename?: "Mutation";
  verifyPathway?: {
    __typename?: "Pathway";
    id: string;
    title: string;
    difficulty: PathwayDifficultyEnum;
    image: string;
    projectStreamId: string;
    description: string;
    slogan: string;
    isPending?: boolean | null;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type GetAllPathwaysByProjectIdQueryVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type GetAllPathwaysByProjectIdQuery = {
  __typename?: "Query";
  getAllPathwaysByProjectId?: {
    __typename?: "Project";
    id: string;
    streamId: string;
    pathways: Array<{
      __typename?: "Pathway";
      id: string;
      streamId: string;
      title: string;
      description: string;
      slogan: string;
      image: string;
      difficulty: PathwayDifficultyEnum;
      rewardCurrency: string;
      rewardAmount: number;
      rewardUserCap: number;
      isPending?: boolean | null;
      projectId: string;
      quizQuests?: Array<{
        __typename?: "QuizQuest";
        id: string;
        isPending?: boolean | null;
        completedBy: Array<string>;
      }> | null;
      bountyQuests?: Array<{
        __typename?: "BountyQuest";
        id: string;
        isPending?: boolean | null;
        completedBy: Array<string>;
      }> | null;
    }>;
  } | null;
};

export type GetPathwayByIdQueryVariables = Exact<{
  pathwayId: Scalars["String"];
}>;

export type GetPathwayByIdQuery = {
  __typename?: "Query";
  getPathwayById?: {
    __typename?: "Pathway";
    id: string;
    streamId: string;
    title: string;
    createdBy: string;
    createdAt: any;
    difficulty: PathwayDifficultyEnum;
    description: string;
    slogan: string;
    rewardCurrency: string;
    rewardAmount: number;
    rewardUserCap: number;
    image: string;
    projectId: string;
    prerequisites?: Array<string> | null;
    quests?: Array<{
      __typename?: "Quest";
      id: string;
      isPending?: boolean | null;
      completedBy: Array<string>;
    }> | null;
  } | null;
};

export type ClaimPathwayRewardsMutationVariables = Exact<{
  input: ClaimPathwayRewardsInput;
}>;

export type ClaimPathwayRewardsMutation = {
  __typename?: "Mutation";
  claimPathwayRewards?: {
    __typename?: "Pathway";
    id: string;
    streamId: string;
    title: string;
    rewardCurrency: string;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;

export type CreateProjectMutation = {
  __typename?: "Mutation";
  createProject?: {
    __typename?: "Project";
    id: string;
    tokenUris: Array<string>;
    isFeatured: boolean;
  } | null;
};

export type EditProjectMutationVariables = Exact<{
  input: EditProjectInput;
}>;

export type EditProjectMutation = {
  __typename?: "Mutation";
  editProject?: {
    __typename?: "Project";
    id: string;
    name: string;
    createdBy: string;
    createdAt: any;
    description: string;
    slogan: string;
    website: string;
    whitepaper?: string | null;
    tokenUris: Array<string>;
    discord?: string | null;
    twitter?: string | null;
    github?: string | null;
    gitbook?: string | null;
    isFeatured: boolean;
    logo?: string | null;
    squads: Array<{
      __typename?: "Squad";
      name: string;
      image?: string | null;
      members: Array<string>;
    }>;
    tags?: Array<{
      __typename?: "Tag";
      id: string;
      label: string;
      color: string;
    }> | null;
  } | null;
};

export type ApproveProjectMutationVariables = Exact<{
  input: ApproveProjectInput;
}>;

export type ApproveProjectMutation = {
  __typename?: "Mutation";
  approveProject?: {
    __typename?: "Project";
    id: string;
    tokenUris: Array<string>;
    isFeatured: boolean;
  } | null;
};

export type GetAllProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllProjectsQuery = {
  __typename?: "Query";
  getAllProjects?: Array<{
    __typename?: "Project";
    id: string;
    name: string;
    createdBy: string;
    description: string;
    slogan: string;
    tokenUris: Array<string>;
    website: string;
    whitepaper?: string | null;
    discord?: string | null;
    twitter?: string | null;
    github?: string | null;
    gitbook?: string | null;
    createdAt: any;
    isFeatured: boolean;
    logo?: string | null;
    squads: Array<{
      __typename?: "Squad";
      name: string;
      image?: string | null;
      members: Array<string>;
    }>;
    tags?: Array<{
      __typename?: "Tag";
      id: string;
      label: string;
      color: string;
    }> | null;
  }> | null;
};

export type GetProjectByIdQueryVariables = Exact<{
  projectId: Scalars["String"];
}>;

export type GetProjectByIdQuery = {
  __typename?: "Query";
  getProjectById?: {
    __typename?: "Project";
    id: string;
    streamId: string;
    name: string;
    createdBy: string;
    createdAt: any;
    description: string;
    slogan: string;
    tokenUris: Array<string>;
    isFeatured: boolean;
    website: string;
    whitepaper?: string | null;
    discord?: string | null;
    twitter?: string | null;
    github?: string | null;
    gitbook?: string | null;
    logo?: string | null;
    squads: Array<{
      __typename?: "Squad";
      name: string;
      image?: string | null;
      members: Array<string>;
    }>;
    tags?: Array<{
      __typename?: "Tag";
      id: string;
      label: string;
      color: string;
    }> | null;
  } | null;
};

export type CreateQuizQuestMutationVariables = Exact<{
  input: CreateQuestInput;
}>;

export type CreateQuizQuestMutation = {
  __typename?: "Mutation";
  createQuizQuest?: {
    __typename?: "QuizQuest";
    id: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
    questions?: Array<{
      __typename?: "QuizQuestion";
      question: string;
      choices: Array<string>;
      answer: string;
    }> | null;
  } | null;
};

export type CreateQuestMutationVariables = Exact<{
  input: CreateQuestInput;
}>;

export type CreateQuestMutation = {
  __typename?: "Mutation";
  createQuest?: {
    __typename?: "Quest";
    id: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
  } | null;
};

export type ApproveQuestMutationVariables = Exact<{
  input: ApproveQuestInput;
}>;

export type ApproveQuestMutation = {
  __typename?: "Mutation";
  approveQuest?: {
    __typename?: "Quest";
    id: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
    image: string;
    isPending?: boolean | null;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type ApproveQuestSolutionMutationVariables = Exact<{
  input: ApproveQuestSolutionInput;
}>;

export type ApproveQuestSolutionMutation = {
  __typename?: "Mutation";
  approveQuestSolution?: {
    __typename?: "BountyQuest";
    id: string;
    name: string;
    description: string;
    submissions: Array<{
      __typename?: "SolutionSubmission";
      id: string;
      did: string;
      status: string;
      reviewComment?: string | null;
      solution: string;
    }>;
  } | null;
};

export type VerifyQuestMutationVariables = Exact<{
  input: VerifyQuestInput;
}>;

export type VerifyQuestMutation = {
  __typename?: "Mutation";
  verifyQuest?: {
    __typename?: "Quest";
    id: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
    image: string;
    isPending?: boolean | null;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type GetAllQuestsByPathwayIdQueryVariables = Exact<{
  pathwayId: Scalars["String"];
}>;

export type GetAllQuestsByPathwayIdQuery = {
  __typename?: "Query";
  getAllQuestsByPathwayId?: {
    __typename?: "Pathway";
    id: string;
    streamId: string;
    title: string;
    description: string;
    slogan: string;
    image: string;
    difficulty: PathwayDifficultyEnum;
    rewardCurrency: string;
    rewardAmount: number;
    rewardUserCap: number;
    isPending?: boolean | null;
    projectId: string;
    quizQuests?: Array<{
      __typename?: "QuizQuest";
      id: string;
      streamId: string;
      name: string;
      description: string;
      slogan: string;
      pathwayId: string;
      questType: string;
      image: string;
      rewardCurrency: string;
      rewardAmount: number;
      rewardUserCap: number;
      isPending?: boolean | null;
      completedBy: Array<string>;
    }> | null;
    bountyQuests?: Array<{
      __typename?: "BountyQuest";
      id: string;
      streamId: string;
      name: string;
      description: string;
      slogan: string;
      pathwayId: string;
      questType: string;
      image: string;
      rewardCurrency: string;
      rewardAmount: number;
      rewardUserCap: number;
      isPending?: boolean | null;
      completedBy: Array<string>;
    }> | null;
  } | null;
};

export type GetBountyQuestByIdQueryVariables = Exact<{
  input: GetBountyQuestByIdInput;
}>;

export type GetBountyQuestByIdQuery = {
  __typename?: "Query";
  getBountyQuestById?: {
    __typename?: "BountyQuest";
    id: string;
    streamId: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
    questType: string;
    image: string;
    rewardCurrency: string;
    rewardAmount: number;
    rewardUserCap: number;
    isPending?: boolean | null;
    completedBy: Array<string>;
    createdBy: string;
    isProjectContributor: boolean;
    submissions: Array<{
      __typename?: "SolutionSubmission";
      id: string;
      did: string;
      status: string;
      reviewComment?: string | null;
      solution: string;
    }>;
  } | null;
};

export type GetQuizQuestByIdQueryVariables = Exact<{
  questId: Scalars["String"];
}>;

export type GetQuizQuestByIdQuery = {
  __typename?: "Query";
  getQuizQuestById?: {
    __typename?: "QuizQuest";
    id: string;
    streamId: string;
    name: string;
    description: string;
    slogan: string;
    pathwayId: string;
    questType: string;
    image: string;
    rewardCurrency: string;
    rewardAmount: number;
    rewardUserCap: number;
    isPending?: boolean | null;
    completedBy: Array<string>;
    createdBy: string;
    questions?: Array<{
      __typename?: "QuizQuestion";
      id: string;
      question: string;
      choices: Array<string>;
      answer: string;
    }> | null;
  } | null;
};

export type SubmitQuestAnswersMutationVariables = Exact<{
  input: QuestAnswersSubmitionInput;
}>;

export type SubmitQuestAnswersMutation = {
  __typename?: "Mutation";
  submitQuestAnswers: {
    __typename?: "SubmitQuestAnswersOutput";
    id: string;
    isSuccess: boolean;
    streamId: string;
    name: string;
    rewardCurrency: string;
    completedBy?: Array<string> | null;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  };
};

export type SubmitQuestSolutionMutationVariables = Exact<{
  input: QuestSolutionSubmissionInput;
}>;

export type SubmitQuestSolutionMutation = {
  __typename?: "Mutation";
  submitQuestSolution: boolean;
};

export type ClaimQuestRewardsMutationVariables = Exact<{
  input: ClaimQuestRewardsInput;
}>;

export type ClaimQuestRewardsMutation = {
  __typename?: "Mutation";
  claimQuestRewards?: {
    __typename?: "Quest";
    id: string;
    streamId: string;
    name: string;
    rewardCurrency: string;
    completedBy: Array<string>;
    expandedServerSignatures?: Array<{
      __typename?: "ExpandedServerSignature";
      r: string;
      s: string;
      v: number;
    }> | null;
  } | null;
};

export type GetAllTagsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllTagsQuery = {
  __typename?: "Query";
  getAllTags?: Array<{
    __typename?: "Tag";
    id: string;
    label: string;
    color: string;
    value: string;
  }> | null;
};

export type SignInMutationVariables = Exact<{
  input: SiweRegisterInput;
}>;

export type SignInMutation = {
  __typename?: "Mutation";
  signIn: {
    __typename?: "User";
    id: string;
    did: string;
    addresses: Array<string>;
  };
};

export type SignOutMutationVariables = Exact<{ [key: string]: never }>;

export type SignOutMutation = { __typename?: "Mutation"; signOut: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    id: string;
    did: string;
    addresses: Array<string>;
  } | null;
};

export type GetNonceQueryVariables = Exact<{ [key: string]: never }>;

export type GetNonceQuery = { __typename?: "Query"; getNonce?: string | null };

export const GetAppDidDocument = gql`
  query GetAppDID {
    getAppDID
  }
`;

/**
 * __useGetAppDidQuery__
 *
 * To run a query within a React component, call `useGetAppDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppDidQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAppDidQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAppDidQuery, GetAppDidQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAppDidQuery, GetAppDidQueryVariables>(
    GetAppDidDocument,
    options
  );
}
export function useGetAppDidLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAppDidQuery,
    GetAppDidQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAppDidQuery, GetAppDidQueryVariables>(
    GetAppDidDocument,
    options
  );
}
export type GetAppDidQueryHookResult = ReturnType<typeof useGetAppDidQuery>;
export type GetAppDidLazyQueryHookResult = ReturnType<
  typeof useGetAppDidLazyQuery
>;
export type GetAppDidQueryResult = Apollo.QueryResult<
  GetAppDidQuery,
  GetAppDidQueryVariables
>;
export const CreatePathwayDocument = gql`
  mutation CreatePathway($input: CreatePathwayInput!) {
    createPathway(input: $input) {
      id
      title
      difficulty
      description
      slogan
    }
  }
`;
export type CreatePathwayMutationFn = Apollo.MutationFunction<
  CreatePathwayMutation,
  CreatePathwayMutationVariables
>;

/**
 * __useCreatePathwayMutation__
 *
 * To run a mutation, you first call `useCreatePathwayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePathwayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPathwayMutation, { data, loading, error }] = useCreatePathwayMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePathwayMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePathwayMutation,
    CreatePathwayMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreatePathwayMutation,
    CreatePathwayMutationVariables
  >(CreatePathwayDocument, options);
}
export type CreatePathwayMutationHookResult = ReturnType<
  typeof useCreatePathwayMutation
>;
export type CreatePathwayMutationResult =
  Apollo.MutationResult<CreatePathwayMutation>;
export type CreatePathwayMutationOptions = Apollo.BaseMutationOptions<
  CreatePathwayMutation,
  CreatePathwayMutationVariables
>;
export const ApprovePathwayDocument = gql`
  mutation ApprovePathway($input: ApprovePathwayInput!) {
    approvePathway(input: $input) {
      id
      title
      difficulty
      image
      description
      slogan
      projectStreamId
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type ApprovePathwayMutationFn = Apollo.MutationFunction<
  ApprovePathwayMutation,
  ApprovePathwayMutationVariables
>;

/**
 * __useApprovePathwayMutation__
 *
 * To run a mutation, you first call `useApprovePathwayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApprovePathwayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approvePathwayMutation, { data, loading, error }] = useApprovePathwayMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApprovePathwayMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ApprovePathwayMutation,
    ApprovePathwayMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ApprovePathwayMutation,
    ApprovePathwayMutationVariables
  >(ApprovePathwayDocument, options);
}
export type ApprovePathwayMutationHookResult = ReturnType<
  typeof useApprovePathwayMutation
>;
export type ApprovePathwayMutationResult =
  Apollo.MutationResult<ApprovePathwayMutation>;
export type ApprovePathwayMutationOptions = Apollo.BaseMutationOptions<
  ApprovePathwayMutation,
  ApprovePathwayMutationVariables
>;
export const VerifyPathwayDocument = gql`
  mutation VerifyPathway($input: VerifyPathwayInput!) {
    verifyPathway(input: $input) {
      id
      title
      difficulty
      image
      projectStreamId
      description
      slogan
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type VerifyPathwayMutationFn = Apollo.MutationFunction<
  VerifyPathwayMutation,
  VerifyPathwayMutationVariables
>;

/**
 * __useVerifyPathwayMutation__
 *
 * To run a mutation, you first call `useVerifyPathwayMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyPathwayMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyPathwayMutation, { data, loading, error }] = useVerifyPathwayMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyPathwayMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VerifyPathwayMutation,
    VerifyPathwayMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    VerifyPathwayMutation,
    VerifyPathwayMutationVariables
  >(VerifyPathwayDocument, options);
}
export type VerifyPathwayMutationHookResult = ReturnType<
  typeof useVerifyPathwayMutation
>;
export type VerifyPathwayMutationResult =
  Apollo.MutationResult<VerifyPathwayMutation>;
export type VerifyPathwayMutationOptions = Apollo.BaseMutationOptions<
  VerifyPathwayMutation,
  VerifyPathwayMutationVariables
>;
export const GetAllPathwaysByProjectIdDocument = gql`
  query GetAllPathwaysByProjectId($projectId: String!) {
    getAllPathwaysByProjectId(projectId: $projectId) {
      id
      streamId
      pathways {
        id
        streamId
        title
        description
        slogan
        image
        difficulty
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        projectId
        quizQuests {
          id
          isPending
          completedBy
        }
        bountyQuests {
          id
          isPending
          completedBy
        }
      }
    }
  }
`;

/**
 * __useGetAllPathwaysByProjectIdQuery__
 *
 * To run a query within a React component, call `useGetAllPathwaysByProjectIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPathwaysByProjectIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPathwaysByProjectIdQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetAllPathwaysByProjectIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAllPathwaysByProjectIdQuery,
    GetAllPathwaysByProjectIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAllPathwaysByProjectIdQuery,
    GetAllPathwaysByProjectIdQueryVariables
  >(GetAllPathwaysByProjectIdDocument, options);
}
export function useGetAllPathwaysByProjectIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllPathwaysByProjectIdQuery,
    GetAllPathwaysByProjectIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAllPathwaysByProjectIdQuery,
    GetAllPathwaysByProjectIdQueryVariables
  >(GetAllPathwaysByProjectIdDocument, options);
}
export type GetAllPathwaysByProjectIdQueryHookResult = ReturnType<
  typeof useGetAllPathwaysByProjectIdQuery
>;
export type GetAllPathwaysByProjectIdLazyQueryHookResult = ReturnType<
  typeof useGetAllPathwaysByProjectIdLazyQuery
>;
export type GetAllPathwaysByProjectIdQueryResult = Apollo.QueryResult<
  GetAllPathwaysByProjectIdQuery,
  GetAllPathwaysByProjectIdQueryVariables
>;
export const GetPathwayByIdDocument = gql`
  query GetPathwayById($pathwayId: String!) {
    getPathwayById(pathwayId: $pathwayId) {
      id
      streamId
      title
      createdBy
      createdAt
      difficulty
      description
      slogan
      rewardCurrency
      rewardAmount
      rewardUserCap
      image
      projectId
      prerequisites
      quests {
        id
        isPending
        completedBy
      }
    }
  }
`;

/**
 * __useGetPathwayByIdQuery__
 *
 * To run a query within a React component, call `useGetPathwayByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPathwayByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPathwayByIdQuery({
 *   variables: {
 *      pathwayId: // value for 'pathwayId'
 *   },
 * });
 */
export function useGetPathwayByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetPathwayByIdQuery,
    GetPathwayByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPathwayByIdQuery, GetPathwayByIdQueryVariables>(
    GetPathwayByIdDocument,
    options
  );
}
export function useGetPathwayByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPathwayByIdQuery,
    GetPathwayByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPathwayByIdQuery, GetPathwayByIdQueryVariables>(
    GetPathwayByIdDocument,
    options
  );
}
export type GetPathwayByIdQueryHookResult = ReturnType<
  typeof useGetPathwayByIdQuery
>;
export type GetPathwayByIdLazyQueryHookResult = ReturnType<
  typeof useGetPathwayByIdLazyQuery
>;
export type GetPathwayByIdQueryResult = Apollo.QueryResult<
  GetPathwayByIdQuery,
  GetPathwayByIdQueryVariables
>;
export const ClaimPathwayRewardsDocument = gql`
  mutation ClaimPathwayRewards($input: ClaimPathwayRewardsInput!) {
    claimPathwayRewards(input: $input) {
      id
      streamId
      title
      rewardCurrency
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type ClaimPathwayRewardsMutationFn = Apollo.MutationFunction<
  ClaimPathwayRewardsMutation,
  ClaimPathwayRewardsMutationVariables
>;

/**
 * __useClaimPathwayRewardsMutation__
 *
 * To run a mutation, you first call `useClaimPathwayRewardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimPathwayRewardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimPathwayRewardsMutation, { data, loading, error }] = useClaimPathwayRewardsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useClaimPathwayRewardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ClaimPathwayRewardsMutation,
    ClaimPathwayRewardsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ClaimPathwayRewardsMutation,
    ClaimPathwayRewardsMutationVariables
  >(ClaimPathwayRewardsDocument, options);
}
export type ClaimPathwayRewardsMutationHookResult = ReturnType<
  typeof useClaimPathwayRewardsMutation
>;
export type ClaimPathwayRewardsMutationResult =
  Apollo.MutationResult<ClaimPathwayRewardsMutation>;
export type ClaimPathwayRewardsMutationOptions = Apollo.BaseMutationOptions<
  ClaimPathwayRewardsMutation,
  ClaimPathwayRewardsMutationVariables
>;
export const CreateProjectDocument = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      tokenUris
      isFeatured
    }
  }
`;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CreateProjectDocument, options);
}
export type CreateProjectMutationHookResult = ReturnType<
  typeof useCreateProjectMutation
>;
export type CreateProjectMutationResult =
  Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;
export const EditProjectDocument = gql`
  mutation EditProject($input: EditProjectInput!) {
    editProject(input: $input) {
      id
      name
      createdBy
      createdAt
      description
      slogan
      website
      whitepaper
      tokenUris
      discord
      twitter
      github
      gitbook
      isFeatured
      logo
      squads {
        name
        image
        members
      }
      tags {
        id
        label
        color
      }
    }
  }
`;
export type EditProjectMutationFn = Apollo.MutationFunction<
  EditProjectMutation,
  EditProjectMutationVariables
>;

/**
 * __useEditProjectMutation__
 *
 * To run a mutation, you first call `useEditProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProjectMutation, { data, loading, error }] = useEditProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EditProjectMutation,
    EditProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EditProjectMutation, EditProjectMutationVariables>(
    EditProjectDocument,
    options
  );
}
export type EditProjectMutationHookResult = ReturnType<
  typeof useEditProjectMutation
>;
export type EditProjectMutationResult =
  Apollo.MutationResult<EditProjectMutation>;
export type EditProjectMutationOptions = Apollo.BaseMutationOptions<
  EditProjectMutation,
  EditProjectMutationVariables
>;
export const ApproveProjectDocument = gql`
  mutation ApproveProject($input: ApproveProjectInput!) {
    approveProject(input: $input) {
      id
      tokenUris
      isFeatured
    }
  }
`;
export type ApproveProjectMutationFn = Apollo.MutationFunction<
  ApproveProjectMutation,
  ApproveProjectMutationVariables
>;

/**
 * __useApproveProjectMutation__
 *
 * To run a mutation, you first call `useApproveProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveProjectMutation, { data, loading, error }] = useApproveProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApproveProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ApproveProjectMutation,
    ApproveProjectMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ApproveProjectMutation,
    ApproveProjectMutationVariables
  >(ApproveProjectDocument, options);
}
export type ApproveProjectMutationHookResult = ReturnType<
  typeof useApproveProjectMutation
>;
export type ApproveProjectMutationResult =
  Apollo.MutationResult<ApproveProjectMutation>;
export type ApproveProjectMutationOptions = Apollo.BaseMutationOptions<
  ApproveProjectMutation,
  ApproveProjectMutationVariables
>;
export const GetAllProjectsDocument = gql`
  query GetAllProjects {
    getAllProjects {
      id
      name
      createdBy
      description
      slogan
      tokenUris
      website
      whitepaper
      discord
      twitter
      github
      gitbook
      createdAt
      isFeatured
      logo
      squads {
        name
        image
        members
      }
      tags {
        id
        label
        color
      }
    }
  }
`;

/**
 * __useGetAllProjectsQuery__
 *
 * To run a query within a React component, call `useGetAllProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProjectsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllProjectsQuery,
    GetAllProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllProjectsQuery, GetAllProjectsQueryVariables>(
    GetAllProjectsDocument,
    options
  );
}
export function useGetAllProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllProjectsQuery,
    GetAllProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllProjectsQuery, GetAllProjectsQueryVariables>(
    GetAllProjectsDocument,
    options
  );
}
export type GetAllProjectsQueryHookResult = ReturnType<
  typeof useGetAllProjectsQuery
>;
export type GetAllProjectsLazyQueryHookResult = ReturnType<
  typeof useGetAllProjectsLazyQuery
>;
export type GetAllProjectsQueryResult = Apollo.QueryResult<
  GetAllProjectsQuery,
  GetAllProjectsQueryVariables
>;
export const GetProjectByIdDocument = gql`
  query GetProjectById($projectId: String!) {
    getProjectById(projectId: $projectId) {
      id
      streamId
      name
      createdBy
      createdAt
      description
      slogan
      tokenUris
      isFeatured
      website
      whitepaper
      discord
      twitter
      github
      gitbook
      logo
      squads {
        name
        image
        members
      }
      tags {
        id
        label
        color
      }
    }
  }
`;

/**
 * __useGetProjectByIdQuery__
 *
 * To run a query within a React component, call `useGetProjectByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectByIdQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProjectByIdQuery,
    GetProjectByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(
    GetProjectByIdDocument,
    options
  );
}
export function useGetProjectByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProjectByIdQuery,
    GetProjectByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(
    GetProjectByIdDocument,
    options
  );
}
export type GetProjectByIdQueryHookResult = ReturnType<
  typeof useGetProjectByIdQuery
>;
export type GetProjectByIdLazyQueryHookResult = ReturnType<
  typeof useGetProjectByIdLazyQuery
>;
export type GetProjectByIdQueryResult = Apollo.QueryResult<
  GetProjectByIdQuery,
  GetProjectByIdQueryVariables
>;
export const CreateQuizQuestDocument = gql`
  mutation CreateQuizQuest($input: CreateQuestInput!) {
    createQuizQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      questions {
        question
        choices
        answer
      }
    }
  }
`;
export type CreateQuizQuestMutationFn = Apollo.MutationFunction<
  CreateQuizQuestMutation,
  CreateQuizQuestMutationVariables
>;

/**
 * __useCreateQuizQuestMutation__
 *
 * To run a mutation, you first call `useCreateQuizQuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuizQuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuizQuestMutation, { data, loading, error }] = useCreateQuizQuestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateQuizQuestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateQuizQuestMutation,
    CreateQuizQuestMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateQuizQuestMutation,
    CreateQuizQuestMutationVariables
  >(CreateQuizQuestDocument, options);
}
export type CreateQuizQuestMutationHookResult = ReturnType<
  typeof useCreateQuizQuestMutation
>;
export type CreateQuizQuestMutationResult =
  Apollo.MutationResult<CreateQuizQuestMutation>;
export type CreateQuizQuestMutationOptions = Apollo.BaseMutationOptions<
  CreateQuizQuestMutation,
  CreateQuizQuestMutationVariables
>;
export const CreateQuestDocument = gql`
  mutation CreateQuest($input: CreateQuestInput!) {
    createQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
    }
  }
`;
export type CreateQuestMutationFn = Apollo.MutationFunction<
  CreateQuestMutation,
  CreateQuestMutationVariables
>;

/**
 * __useCreateQuestMutation__
 *
 * To run a mutation, you first call `useCreateQuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuestMutation, { data, loading, error }] = useCreateQuestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateQuestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateQuestMutation,
    CreateQuestMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateQuestMutation, CreateQuestMutationVariables>(
    CreateQuestDocument,
    options
  );
}
export type CreateQuestMutationHookResult = ReturnType<
  typeof useCreateQuestMutation
>;
export type CreateQuestMutationResult =
  Apollo.MutationResult<CreateQuestMutation>;
export type CreateQuestMutationOptions = Apollo.BaseMutationOptions<
  CreateQuestMutation,
  CreateQuestMutationVariables
>;
export const ApproveQuestDocument = gql`
  mutation ApproveQuest($input: ApproveQuestInput!) {
    approveQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      image
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type ApproveQuestMutationFn = Apollo.MutationFunction<
  ApproveQuestMutation,
  ApproveQuestMutationVariables
>;

/**
 * __useApproveQuestMutation__
 *
 * To run a mutation, you first call `useApproveQuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveQuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveQuestMutation, { data, loading, error }] = useApproveQuestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApproveQuestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ApproveQuestMutation,
    ApproveQuestMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ApproveQuestMutation,
    ApproveQuestMutationVariables
  >(ApproveQuestDocument, options);
}
export type ApproveQuestMutationHookResult = ReturnType<
  typeof useApproveQuestMutation
>;
export type ApproveQuestMutationResult =
  Apollo.MutationResult<ApproveQuestMutation>;
export type ApproveQuestMutationOptions = Apollo.BaseMutationOptions<
  ApproveQuestMutation,
  ApproveQuestMutationVariables
>;
export const ApproveQuestSolutionDocument = gql`
  mutation ApproveQuestSolution($input: ApproveQuestSolutionInput!) {
    approveQuestSolution(input: $input) {
      id
      name
      description
      submissions {
        id
        did
        status
        reviewComment
        solution
      }
    }
  }
`;
export type ApproveQuestSolutionMutationFn = Apollo.MutationFunction<
  ApproveQuestSolutionMutation,
  ApproveQuestSolutionMutationVariables
>;

/**
 * __useApproveQuestSolutionMutation__
 *
 * To run a mutation, you first call `useApproveQuestSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveQuestSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveQuestSolutionMutation, { data, loading, error }] = useApproveQuestSolutionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApproveQuestSolutionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ApproveQuestSolutionMutation,
    ApproveQuestSolutionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ApproveQuestSolutionMutation,
    ApproveQuestSolutionMutationVariables
  >(ApproveQuestSolutionDocument, options);
}
export type ApproveQuestSolutionMutationHookResult = ReturnType<
  typeof useApproveQuestSolutionMutation
>;
export type ApproveQuestSolutionMutationResult =
  Apollo.MutationResult<ApproveQuestSolutionMutation>;
export type ApproveQuestSolutionMutationOptions = Apollo.BaseMutationOptions<
  ApproveQuestSolutionMutation,
  ApproveQuestSolutionMutationVariables
>;
export const VerifyQuestDocument = gql`
  mutation VerifyQuest($input: VerifyQuestInput!) {
    verifyQuest(input: $input) {
      id
      name
      description
      slogan
      pathwayId
      image
      isPending
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type VerifyQuestMutationFn = Apollo.MutationFunction<
  VerifyQuestMutation,
  VerifyQuestMutationVariables
>;

/**
 * __useVerifyQuestMutation__
 *
 * To run a mutation, you first call `useVerifyQuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyQuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyQuestMutation, { data, loading, error }] = useVerifyQuestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyQuestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VerifyQuestMutation,
    VerifyQuestMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VerifyQuestMutation, VerifyQuestMutationVariables>(
    VerifyQuestDocument,
    options
  );
}
export type VerifyQuestMutationHookResult = ReturnType<
  typeof useVerifyQuestMutation
>;
export type VerifyQuestMutationResult =
  Apollo.MutationResult<VerifyQuestMutation>;
export type VerifyQuestMutationOptions = Apollo.BaseMutationOptions<
  VerifyQuestMutation,
  VerifyQuestMutationVariables
>;
export const GetAllQuestsByPathwayIdDocument = gql`
  query GetAllQuestsByPathwayId($pathwayId: String!) {
    getAllQuestsByPathwayId(pathwayId: $pathwayId) {
      id
      streamId
      title
      description
      slogan
      image
      difficulty
      rewardCurrency
      rewardAmount
      rewardUserCap
      isPending
      projectId
      quizQuests {
        id
        streamId
        name
        description
        slogan
        pathwayId
        questType
        image
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        completedBy
      }
      bountyQuests {
        id
        streamId
        name
        description
        slogan
        pathwayId
        questType
        image
        rewardCurrency
        rewardAmount
        rewardUserCap
        isPending
        completedBy
      }
    }
  }
`;

/**
 * __useGetAllQuestsByPathwayIdQuery__
 *
 * To run a query within a React component, call `useGetAllQuestsByPathwayIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllQuestsByPathwayIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllQuestsByPathwayIdQuery({
 *   variables: {
 *      pathwayId: // value for 'pathwayId'
 *   },
 * });
 */
export function useGetAllQuestsByPathwayIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAllQuestsByPathwayIdQuery,
    GetAllQuestsByPathwayIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetAllQuestsByPathwayIdQuery,
    GetAllQuestsByPathwayIdQueryVariables
  >(GetAllQuestsByPathwayIdDocument, options);
}
export function useGetAllQuestsByPathwayIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllQuestsByPathwayIdQuery,
    GetAllQuestsByPathwayIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetAllQuestsByPathwayIdQuery,
    GetAllQuestsByPathwayIdQueryVariables
  >(GetAllQuestsByPathwayIdDocument, options);
}
export type GetAllQuestsByPathwayIdQueryHookResult = ReturnType<
  typeof useGetAllQuestsByPathwayIdQuery
>;
export type GetAllQuestsByPathwayIdLazyQueryHookResult = ReturnType<
  typeof useGetAllQuestsByPathwayIdLazyQuery
>;
export type GetAllQuestsByPathwayIdQueryResult = Apollo.QueryResult<
  GetAllQuestsByPathwayIdQuery,
  GetAllQuestsByPathwayIdQueryVariables
>;
export const GetBountyQuestByIdDocument = gql`
  query GetBountyQuestById($input: GetBountyQuestByIdInput!) {
    getBountyQuestById(input: $input) {
      id
      streamId
      name
      description
      slogan
      pathwayId
      questType
      image
      rewardCurrency
      rewardAmount
      rewardUserCap
      isPending
      completedBy
      createdBy
      submissions {
        id
        did
        status
        reviewComment
        solution
      }
      isProjectContributor
    }
  }
`;

/**
 * __useGetBountyQuestByIdQuery__
 *
 * To run a query within a React component, call `useGetBountyQuestByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBountyQuestByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBountyQuestByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetBountyQuestByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBountyQuestByIdQuery,
    GetBountyQuestByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetBountyQuestByIdQuery,
    GetBountyQuestByIdQueryVariables
  >(GetBountyQuestByIdDocument, options);
}
export function useGetBountyQuestByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBountyQuestByIdQuery,
    GetBountyQuestByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBountyQuestByIdQuery,
    GetBountyQuestByIdQueryVariables
  >(GetBountyQuestByIdDocument, options);
}
export type GetBountyQuestByIdQueryHookResult = ReturnType<
  typeof useGetBountyQuestByIdQuery
>;
export type GetBountyQuestByIdLazyQueryHookResult = ReturnType<
  typeof useGetBountyQuestByIdLazyQuery
>;
export type GetBountyQuestByIdQueryResult = Apollo.QueryResult<
  GetBountyQuestByIdQuery,
  GetBountyQuestByIdQueryVariables
>;
export const GetQuizQuestByIdDocument = gql`
  query GetQuizQuestById($questId: String!) {
    getQuizQuestById(questId: $questId) {
      id
      streamId
      name
      description
      slogan
      pathwayId
      questType
      image
      rewardCurrency
      rewardAmount
      rewardUserCap
      isPending
      completedBy
      createdBy
      questions {
        id
        question
        choices
        answer
      }
    }
  }
`;

/**
 * __useGetQuizQuestByIdQuery__
 *
 * To run a query within a React component, call `useGetQuizQuestByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuizQuestByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuizQuestByIdQuery({
 *   variables: {
 *      questId: // value for 'questId'
 *   },
 * });
 */
export function useGetQuizQuestByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetQuizQuestByIdQuery,
    GetQuizQuestByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetQuizQuestByIdQuery, GetQuizQuestByIdQueryVariables>(
    GetQuizQuestByIdDocument,
    options
  );
}
export function useGetQuizQuestByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetQuizQuestByIdQuery,
    GetQuizQuestByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetQuizQuestByIdQuery,
    GetQuizQuestByIdQueryVariables
  >(GetQuizQuestByIdDocument, options);
}
export type GetQuizQuestByIdQueryHookResult = ReturnType<
  typeof useGetQuizQuestByIdQuery
>;
export type GetQuizQuestByIdLazyQueryHookResult = ReturnType<
  typeof useGetQuizQuestByIdLazyQuery
>;
export type GetQuizQuestByIdQueryResult = Apollo.QueryResult<
  GetQuizQuestByIdQuery,
  GetQuizQuestByIdQueryVariables
>;
export const SubmitQuestAnswersDocument = gql`
  mutation SubmitQuestAnswers($input: QuestAnswersSubmitionInput!) {
    submitQuestAnswers(input: $input) {
      id
      isSuccess
      streamId
      name
      rewardCurrency
      completedBy
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type SubmitQuestAnswersMutationFn = Apollo.MutationFunction<
  SubmitQuestAnswersMutation,
  SubmitQuestAnswersMutationVariables
>;

/**
 * __useSubmitQuestAnswersMutation__
 *
 * To run a mutation, you first call `useSubmitQuestAnswersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitQuestAnswersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitQuestAnswersMutation, { data, loading, error }] = useSubmitQuestAnswersMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitQuestAnswersMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubmitQuestAnswersMutation,
    SubmitQuestAnswersMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubmitQuestAnswersMutation,
    SubmitQuestAnswersMutationVariables
  >(SubmitQuestAnswersDocument, options);
}
export type SubmitQuestAnswersMutationHookResult = ReturnType<
  typeof useSubmitQuestAnswersMutation
>;
export type SubmitQuestAnswersMutationResult =
  Apollo.MutationResult<SubmitQuestAnswersMutation>;
export type SubmitQuestAnswersMutationOptions = Apollo.BaseMutationOptions<
  SubmitQuestAnswersMutation,
  SubmitQuestAnswersMutationVariables
>;
export const SubmitQuestSolutionDocument = gql`
  mutation SubmitQuestSolution($input: QuestSolutionSubmissionInput!) {
    submitQuestSolution(input: $input)
  }
`;
export type SubmitQuestSolutionMutationFn = Apollo.MutationFunction<
  SubmitQuestSolutionMutation,
  SubmitQuestSolutionMutationVariables
>;

/**
 * __useSubmitQuestSolutionMutation__
 *
 * To run a mutation, you first call `useSubmitQuestSolutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitQuestSolutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitQuestSolutionMutation, { data, loading, error }] = useSubmitQuestSolutionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitQuestSolutionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubmitQuestSolutionMutation,
    SubmitQuestSolutionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SubmitQuestSolutionMutation,
    SubmitQuestSolutionMutationVariables
  >(SubmitQuestSolutionDocument, options);
}
export type SubmitQuestSolutionMutationHookResult = ReturnType<
  typeof useSubmitQuestSolutionMutation
>;
export type SubmitQuestSolutionMutationResult =
  Apollo.MutationResult<SubmitQuestSolutionMutation>;
export type SubmitQuestSolutionMutationOptions = Apollo.BaseMutationOptions<
  SubmitQuestSolutionMutation,
  SubmitQuestSolutionMutationVariables
>;
export const ClaimQuestRewardsDocument = gql`
  mutation ClaimQuestRewards($input: ClaimQuestRewardsInput!) {
    claimQuestRewards(input: $input) {
      id
      streamId
      name
      rewardCurrency
      completedBy
      expandedServerSignatures {
        r
        s
        v
      }
    }
  }
`;
export type ClaimQuestRewardsMutationFn = Apollo.MutationFunction<
  ClaimQuestRewardsMutation,
  ClaimQuestRewardsMutationVariables
>;

/**
 * __useClaimQuestRewardsMutation__
 *
 * To run a mutation, you first call `useClaimQuestRewardsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimQuestRewardsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimQuestRewardsMutation, { data, loading, error }] = useClaimQuestRewardsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useClaimQuestRewardsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ClaimQuestRewardsMutation,
    ClaimQuestRewardsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ClaimQuestRewardsMutation,
    ClaimQuestRewardsMutationVariables
  >(ClaimQuestRewardsDocument, options);
}
export type ClaimQuestRewardsMutationHookResult = ReturnType<
  typeof useClaimQuestRewardsMutation
>;
export type ClaimQuestRewardsMutationResult =
  Apollo.MutationResult<ClaimQuestRewardsMutation>;
export type ClaimQuestRewardsMutationOptions = Apollo.BaseMutationOptions<
  ClaimQuestRewardsMutation,
  ClaimQuestRewardsMutationVariables
>;
export const GetAllTagsDocument = gql`
  query GetAllTags {
    getAllTags {
      id
      label
      color
      value
    }
  }
`;

/**
 * __useGetAllTagsQuery__
 *
 * To run a query within a React component, call `useGetAllTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllTagsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllTagsQuery,
    GetAllTagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(
    GetAllTagsDocument,
    options
  );
}
export function useGetAllTagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllTagsQuery,
    GetAllTagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllTagsQuery, GetAllTagsQueryVariables>(
    GetAllTagsDocument,
    options
  );
}
export type GetAllTagsQueryHookResult = ReturnType<typeof useGetAllTagsQuery>;
export type GetAllTagsLazyQueryHookResult = ReturnType<
  typeof useGetAllTagsLazyQuery
>;
export type GetAllTagsQueryResult = Apollo.QueryResult<
  GetAllTagsQuery,
  GetAllTagsQueryVariables
>;
export const SignInDocument = gql`
  mutation SignIn($input: SiweRegisterInput!) {
    signIn(input: $input) {
      id
      did
      addresses
    }
  }
`;
export type SignInMutationFn = Apollo.MutationFunction<
  SignInMutation,
  SignInMutationVariables
>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignInMutation,
    SignInMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SignInMutation, SignInMutationVariables>(
    SignInDocument,
    options
  );
}
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<
  SignInMutation,
  SignInMutationVariables
>;
export const SignOutDocument = gql`
  mutation SignOut {
    signOut
  }
`;
export type SignOutMutationFn = Apollo.MutationFunction<
  SignOutMutation,
  SignOutMutationVariables
>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SignOutMutation,
    SignOutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(
    SignOutDocument,
    options
  );
}
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<
  SignOutMutation,
  SignOutMutationVariables
>;
export const MeDocument = gql`
  query Me {
    me {
      id
      did
      addresses
    }
  }
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetNonceDocument = gql`
  query GetNonce {
    getNonce
  }
`;

/**
 * __useGetNonceQuery__
 *
 * To run a query within a React component, call `useGetNonceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNonceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNonceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNonceQuery(
  baseOptions?: Apollo.QueryHookOptions<GetNonceQuery, GetNonceQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetNonceQuery, GetNonceQueryVariables>(
    GetNonceDocument,
    options
  );
}
export function useGetNonceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetNonceQuery,
    GetNonceQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetNonceQuery, GetNonceQueryVariables>(
    GetNonceDocument,
    options
  );
}
export type GetNonceQueryHookResult = ReturnType<typeof useGetNonceQuery>;
export type GetNonceLazyQueryHookResult = ReturnType<
  typeof useGetNonceLazyQuery
>;
export type GetNonceQueryResult = Apollo.QueryResult<
  GetNonceQuery,
  GetNonceQueryVariables
>;
