// Memory type definition
export interface Memory {
  id: string;
  headline: string;
  name: string;
  email: string;
  photo?: string;
  video?: string;
  shortMemory: string;
  fullStory: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

export const TAG_OPTIONS = ['Family', 'Church', 'Cooking', 'Travel'] as const;
export type TagOption = (typeof TAG_OPTIONS)[number];
