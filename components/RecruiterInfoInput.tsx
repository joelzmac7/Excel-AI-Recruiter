import React from 'react';
import { RecruiterInfo } from '../types';

interface RecruiterInfoInputProps {
  recruiterInfo: RecruiterInfo;
  setRecruiterInfo: (info: RecruiterInfo) => void;
  isLoading: boolean;
}

const RecruiterInfoInput: React.FC<RecruiterInfoInputProps> = ({ recruiterInfo, setRecruiterInfo, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecruiterInfo({
      ...recruiterInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full h-full flex flex-col">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Your Recruiter Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={recruiterInfo.name}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
            placeholder="Jane Doe"
            required
            aria-label="Full Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={recruiterInfo.email}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
            placeholder="jane.doe@example.com"
            required
            aria-label="Email Address"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={recruiterInfo.phone}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition"
            placeholder="(555) 123-4567"
            required
            aria-label="Phone Number"
          />
        </div>
      </div>
       <p className="text-xs text-gray-500 mt-3 flex-grow flex items-end">
          This information will be added to the social media posts as a call to action.
       </p>
    </div>
  );
};

export default RecruiterInfoInput;
