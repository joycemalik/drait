// Shapes the UI works with. Supabase rows are mapped into these in src/lib/data.

export type ClubCategory = "technical" | "sports" | "cultural" | "social";

export interface ClubMember {
  name: string;
  role: string;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: ClubCategory;
  color: string;
  memberCount: number;
  foundedYear: number;
  externalLink?: string;
  instagramLink?: string;
  leads: ClubMember[];
  tags: string[];
  featured: boolean;
}

export type EventType =
  | "workshop"
  | "hackathon"
  | "competition"
  | "seminar"
  | "practice"
  | "meeting"
  | "social";

export interface Event {
  id: string;
  title: string;
  clubSlug: string;
  clubName: string;
  clubColor: string;
  type: EventType;
  date: string;
  time: string;
  endTime?: string;
  venue: string;
  description: string;
  registrationLink?: string;
  maxSeats?: number;
  registeredCount: number;
  tags: string[];
  featured: boolean;
  image?: string;
}

export type Priority = "urgent" | "important" | "info";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  clubSlug: string;
  clubName: string;
  clubColor: string;
  priority: Priority;
  postedAt: string;
  author: string;
  pinned: boolean;
}

export type DiscussionCategory =
  | "academic"
  | "career"
  | "campus"
  | "projects"
  | "general";

export interface Discussion {
  id: string;
  title: string;
  body: string;
  author: string;
  authorYear: string;
  authorId?: string;
  category: DiscussionCategory;
  subcategory: string;
  postedAt: string;
  upvotes: number;
  replyCount: number;
  tags: string[];
  pinned: boolean;
  solved?: boolean;
}

export type OpportunityType =
  | "hackathon"
  | "internship"
  | "competition"
  | "scholarship"
  | "research"
  | "certification";

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organizer: string;
  deadline: string;
  eligibility: string;
  prize?: string;
  stipend?: string;
  description: string;
  link: string;
  tags: string[];
  featured: boolean;
}

export type AchievementCategory = "hackathon" | "competition" | "certification" | "research" | "sports" | "design" | "other";

export interface Achievement {
  id: string;
  title: string;
  people: string;
  team?: string;
  clubSlug?: string;
  clubName?: string;
  clubColor?: string;
  category: AchievementCategory;
  achievedOn: string;
  description: string;
  link?: string;
  verified: boolean;
}

export type { DepartmentId as Department } from "@/lib/college";
export type ResourceKind = "notes" | "pyq" | "lab" | "reference" | "other";

export interface AcademicResource {
  id: string;
  title: string;
  department: import("@/lib/college").DepartmentId;
  semester: number;
  subject: string;
  kind: ResourceKind;
  url: string;
  sharedBy?: string;
  sharedById?: string;
  createdAt: string;
}
