export interface JobPostCard {
    url: string;
    title: string;
    authorName: string;
    authorCompany: string;
    externalUrl?: string;
}

export interface JobPosting {
    id: number;
    external_id: string | null;
    subcompany: string;
    office: string;
    department: string;
    recruiting_category: string;
    name: string;
    description: string;
    employment_type: string;
    seniority: string;
    schedule: string;
    years_of_experience: string;
    keywords: string;
    occupation: string;
    occupation_category: string;
    posted_at: string;
    created_at: string;
    updated_at: string;
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