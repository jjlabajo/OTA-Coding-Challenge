"use client"

import React, { useState, useEffect } from 'react';
import { JobPosting } from '@/lib/interfaces';
import { useParams } from 'next/navigation';
import Button from '@/ui/components/Button';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

const mockJob: JobPosting = {
    id: 1,
    company: "",
    office: "",
    position: '',
    description: ``,
    employment_type: '',
    status: 'pending',
    user_id: 1,
    user_name: '',
    created_at: '2024-07-24T10:00:00Z',
    updated_at: '2024-07-24T12:30:00Z',
};

const JobPostPage: React.FC = () => {
    const [job, setJob] = useState(mockJob)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { id } = useParams()

    useEffect(()=>{
        fetch(`${apiUrl}/job-posts/${id}`)
            .then(response => response.json())
            .then((data)=> setJob(data))
    }, [job, id])

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-8 px-6">
                <Link href="/job-posts">
                    <Button className="flex items-center">
                        <MoveLeft className="mr-2 w-4 h-4" /> Job Board
                    </Button>
                </Link>
                <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
                    <h1 className="text-3xl font-bold text-gray-900">{job.position}</h1>
                    <p className="text-gray-600  mb-4">{job.employment_type} - {job.office}</p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-6"
                    dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
            </main>
        </div>
    );
};

export default JobPostPage;
