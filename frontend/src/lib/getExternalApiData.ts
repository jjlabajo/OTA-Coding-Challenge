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

const fetchJobPostings = async (): Promise<PositionRaw[]> => {
  const externalApiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  
  try {
    const response = await axios.get(
      externalApiUrl + '/xml'
    );
    const parsedData: WorkzagJobsRaw = parser.parse(response.data);

    if (parsedData && parsedData['workzag-jobs'] && parsedData['workzag-jobs'].position) {
      const positionsRaw: PositionRaw[] = Array.isArray(parsedData['workzag-jobs'].position)
        ? parsedData['workzag-jobs'].position
        : [parsedData['workzag-jobs'].position];

      return positionsRaw;
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