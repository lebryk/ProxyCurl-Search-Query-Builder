export interface WorkHistory {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface ContactInfo {
  email: string;
  linkedin?: string;
  phone?: string;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  experience_years: number;
  skills: string[];
  education: Education[];
  workHistory: WorkHistory[];
  languages: string[];
  certifications: string[];
  contactInfo?: ContactInfo;
  score: number;
  aiSummary?: string;
  imageUrl?: string;
  isShortlisted?: boolean;
  summary?: string;
}