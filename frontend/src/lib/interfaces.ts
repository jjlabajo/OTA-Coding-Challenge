export interface JobPostCard {
    url: string;
    title: string;
    authorName: string;
    authorCompany: string;
    externalUrl?: string;
    description?: string;
    status?: string;
}

export interface User{
  id?: number;
  name: string;
  email?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobPosting {
  id: number;
  position: string;
  employment_type: string;
  office: string;
  description: string;
  status: string; // Optional as indicated
  created_at: string;
  updated_at: string;
  company: string; // Optional as indicated
  user_id: number; // Optional and commented out
  user: User;
}

export interface JobDescriptionRaw {
  name: string;
  value: {
    __cdata: string
  };
}

export interface PositionRaw {
  id: string;
  subcompany: string;
  office: string;
  department: string;
  recruitingCategory: string;
  name: string;
  jobDescriptions: {
    jobDescription: JobDescriptionRaw[] | JobDescriptionRaw;
  };
  employmentType: string;
  seniority: string;
  schedule: string;
  yearsOfExperience: string;
  keywords: string;
  occupation: string;
  occupationCategory: string;
  createdAt: string;
}