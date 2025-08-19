import React from 'react';
import { JobDetails } from '../types';

interface JobDetailsDisplayProps {
    jobDetails: JobDetails;
    setJobDetails: (details: JobDetails) => void;
    isLoading: boolean;
}

const InputField: React.FC<{
    label: string;
    name: keyof JobDetails;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    colSpan?: string;
}> = ({ label, name, value, onChange, disabled, colSpan = "sm:col-span-1" }) => (
    <div className={colSpan}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition bg-white disabled:bg-gray-100"
            aria-label={label}
        />
    </div>
);


const JobDetailsDisplay: React.FC<JobDetailsDisplayProps> = ({ jobDetails, setJobDetails, isLoading }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobDetails({
            ...jobDetails,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full mt-8">
            <h2 className="text-lg font-medium text-gray-800 mb-1">Extracted Job Details</h2>
            <p className="text-sm text-gray-500 mb-4">Please review the details extracted by the AI and make any necessary corrections.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <InputField
                    label="Job Title"
                    name="jobTitle"
                    value={jobDetails.jobTitle}
                    onChange={handleChange}
                    disabled={isLoading}
                    colSpan="sm:col-span-2 md:col-span-2"
                />
                <InputField
                    label="Specialty"
                    name="specialty"
                    value={jobDetails.specialty}
                    onChange={handleChange}
                    disabled={isLoading}
                    colSpan="sm:col-span-1 md:col-span-2"
                />
                <InputField
                    label="City"
                    name="city"
                    value={jobDetails.city}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <InputField
                    label="State (Abbr.)"
                    name="state"
                    value={jobDetails.state}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                 <InputField
                    label="Weekly Pay Rate"
                    name="payRate"
                    value={jobDetails.payRate}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <InputField
                    label="Start Date"
                    name="startDate"
                    value={jobDetails.startDate}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                  <InputField
                    label="Duration"
                    name="duration"
                    value={jobDetails.duration}
                    onChange={handleChange}
                    disabled={isLoading}
                />
                <InputField
                    label="Job Type"
                    name="jobType"
                    value={jobDetails.jobType}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};

export default JobDetailsDisplay;
