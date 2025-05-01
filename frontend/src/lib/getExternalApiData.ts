// getExternalAPIData.ts
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { JobPosting, PositionRaw, JobDescriptionRaw } from './interfaces';

interface WorkzagJobsRaw {
  'workzag-jobs': {
    position: PositionRaw[] | PositionRaw;
  };
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  allowBooleanAttributes: true,
  parseTagValue: true,
  trimValues: true,
  cdataPropName: '__cdata'
});

const extractFullDescription = (jobDescriptions: PositionRaw['jobDescriptions']): string => {
  if (!jobDescriptions || !jobDescriptions.jobDescription) {
    return '';
  }

  const descriptions = Array.isArray(jobDescriptions.jobDescription)
    ? jobDescriptions.jobDescription
    : [jobDescriptions.jobDescription];

  return descriptions.map((desc: JobDescriptionRaw) => desc.value || '').join('\n\n');
};

const fetchJobPostings = async (): Promise<JobPosting[]> => {
  try {
    const response = await axios.get(
      'https://mrge-group-gmbh.jobs.personio.de/xml'
    );
    const parsedData: WorkzagJobsRaw = parser.parse(response.data);

    if (parsedData && parsedData['workzag-jobs'] && parsedData['workzag-jobs'].position) {
      const positionsRaw: PositionRaw[] = Array.isArray(parsedData['workzag-jobs'].position)
        ? parsedData['workzag-jobs'].position
        : [parsedData['workzag-jobs'].position];

      return positionsRaw.map((pos: PositionRaw) => ({
        id: parseInt(pos.id, 10),
        external_id: pos.id,
        subcompany: pos.subcompany,
        office: pos.office,
        department: pos.department,
        recruiting_category: pos.recruitingCategory,
        name: pos.name,
        description: extractFullDescription(pos.jobDescriptions),
        employment_type: pos.employmentType,
        seniority: pos.seniority,
        schedule: pos.schedule,
        years_of_experience: pos.yearsOfExperience,
        keywords: pos.keywords,
        occupation: pos.occupation,
        occupation_category: pos.occupationCategory,
        posted_at: pos.createdAt, // Assuming createdAt from the XML maps to posted_at
        created_at: pos.createdAt, // You might want to adjust this based on actual creation time if available
        updated_at: "", // You might want to adjust this if there's an update timestamp in the XML
      }));
    } else {
      console.error('Could not find job positions in the XML data.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching or parsing XML data:', error);
    return [];
  }
};

export { fetchJobPostings };