import React from 'react';
import { Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-civic-red p-2 rounded-lg text-white">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">CivicSpace</h1>
            <p className="text-xs text-gray-500 font-medium">CITIZEN ACTION PORTAL</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-civic-green"></div>
          <div className="h-3 w-3 rounded-full bg-civic-yellow"></div>
          <div className="h-3 w-3 rounded-full bg-civic-red"></div>
        </div>
      </div>
    </header>
  );
};