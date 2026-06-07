export interface SharedPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: string;
  comments: string;
  date: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  followersCount: string;
  followingCount: string;
  postsCount: string;
  bio: string;
  category: string;
  avatarUrl: string;
  contactEmail?: string;
  location?: string;
  engagementRate?: string;
  tags: string[];
  notesCount: number;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
  contacted?: boolean;
  replied?: boolean;
  agreed?: boolean;
  contactedAt?: string;
}

export interface AccountNote {
  id: string;
  accountId: string;
  title: string;
  content: string;
  category: "General" | "Strategy" | "Content Idea" | "Sponsorship" | "Contract" | "Personal";
  priority: "low" | "medium" | "high";
  updatedAt: string;
}

export interface AccountTask {
  id: string;
  accountId: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}
