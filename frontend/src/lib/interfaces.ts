export interface JobPostCard {
    url: string;
    title: string;
    authorName: string;
    authorCompany: string;
    externalUrl?: string;
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
  user_name: string;
}

export interface JobDescriptionRaw {
  name: string;
  value: string;
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