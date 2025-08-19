
import React from 'react';
import { Spinner } from './ui/Spinner';

interface JobInputProps {
    jobText: string;
    setJobText: (text: string) => void;
    onAnalyze: () => void;
    isLoading: boolean;
    loadingMessage: string;
}

const JobInput: React.FC<JobInputProps> = ({ jobText, setJobText, onAnalyze, isLoading, loadingMessage }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full">
            <label htmlFor="job-description" className="block text-lg font-medium text-gray-800 mb-1">
                Paste Job Details from Webpage
            </label>
            <p className="text-sm text-gray-500 mb-3">
                For best results, copy everything under "Job Order Details" and "Additional Information(internal)".
            </p>
            <textarea
                id="job-description"
                rows={12}
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition duration-150 ease-in-out"
                placeholder="Paste the full job description here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                disabled={isLoading}
                aria-label="Job Description Input"
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
                <button
                    onClick={onAnalyze}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            Processing...
                        </>
                    ) : (
                        'Create Social Media Posts'
                    )}
                </button>
                {isLoading && <p className="mt-4 sm:mt-0 sm:ml-4 text-sm font-medium text-primary-700 animate-pulse">{loadingMessage}</p>}
            </div>
        </div>
    );
};

export default JobInput;
