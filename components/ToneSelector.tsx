import React from 'react';
import { US_STATES } from '../constants';

interface ToneSelectorProps {
    selectedState: string;
    setSelectedState: (state: string) => void;
    isLoading: boolean;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedState, setSelectedState, isLoading }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full h-full flex flex-col">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Communication Style</h2>
            <div>
                 <label htmlFor="tone-state" className="block text-sm font-medium text-gray-700">
                    Set Regional Tone for SMS & Email
                 </label>
                <select
                    id="tone-state"
                    name="tone-state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={isLoading}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md transition"
                    aria-label="Select state for communication tone"
                >
                    <option value="Default">Default / General</option>
                    {US_STATES.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex-grow flex items-end">
                The AI will adapt its writing style for SMS and Email to reflect the local vibe of the selected state.
            </p>
        </div>
    );
};
