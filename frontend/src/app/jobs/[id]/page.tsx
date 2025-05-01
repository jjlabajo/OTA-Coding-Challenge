import React from 'react';
import Button from '@/ui/components/Button'; // Assuming these are correctly set up
import { ArrowLeft } from 'lucide-react';
import { JobPosting } from '@/lib/interfaces';

const mockJob: JobPosting = {
    id: 1,
    external_id: null,
    subcompany: "mrge",
    office: "Berlin",
    department: "Engineering",
    recruiting_category: "Technical",
    name: 'Senior Data Engineer (m/f/d)',
    description: `Join us on our mission to become a global champion in commerce advertising and performance marketing.

    mrge, a leading Commerce Advertising platform, connects over 5,500 publishers, 55,000 advertisers, and 100 networks in 160+ countries. It combines the expertise of five market leaders: digidip, specializing in premium publishers; MaxBounty, focused on direct partnerships; shopping24, offering product recommendations; SourceKnowledge, a CPC platform; and Yieldkit, delivering high reach and performance. Backed by Waterland private equity, mrge employs over 160 professionals with offices in Hamburg, Berlin, Montreal, and Ottawa.

    Our culture runs on trust, friendliness, and collegiality, fostering a positive work atmosphere. Working with us is easy and fun - just ask our clients, who we help to reach their goals in an uncomplicated, reliable way.

    In close cooperation with our partners, we provide advertising formats that offer genuine relevance for our users and, as a result, lead to higher sales.

    YOUR TASKS.
    
    As a Senior Data Engineer, you'll be instrumental in designing, building, and optimizing our data infrastructure. You'll work closely with cross-functional teams to ensure data reliability, scalability, and performance. Your contributions will directly impact our ability to deliver cutting-edge advertising solutions.`,
    employment_type: 'Permanent employee, Full-time',
    seniority: 'Senior',
    schedule: 'Full-time',
    years_of_experience: '5+',
    keywords: 'Data Engineering, Big Data, Cloud, ETL',
    occupation: 'Data Engineer',
    occupation_category: 'IT',
    posted_at: '2024-07-24T10:00:00Z',
    created_at: '2024-07-24T10:00:00Z',
    updated_at: '2024-07-24T12:30:00Z',
};

const JobPostPage: React.FC = () => {
    // In a real application, you'd fetch the job data, possibly from an API
    const job: JobPosting = mockJob; // Using mock data for this example

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-8 px-6">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900">{job.name}</h1>
                    <p className="text-gray-600  mb-4">{job.employment_type} - {job.office}</p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">LOOKING FOR AN EXCITING CHALLENGE?</h2>
                    <p className="text-gray-700  leading-relaxed whitespace-pre-line mb-6">
                        {job.description}
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">YOUR TASKS</h2>
                    <p className="text-gray-700  leading-relaxed whitespace-pre-line">
                        {job.description}
                    </p>
                    {/* Add more sections as needed, e.g., qualifications, benefits, how to apply */}
                </div>
            </main>
        </div>
    );
};

export default JobPostPage;
