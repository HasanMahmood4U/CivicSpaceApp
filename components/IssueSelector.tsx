import React from 'react';
import { Construction, Zap, Trash2, Dog, AlertTriangle } from 'lucide-react';
import { IssueCategory } from '../types';
import { ISSUE_DETAILS } from '../constants';

interface IssueSelectorProps {
  onSelect: (category: IssueCategory) => void;
  selectedCategory: IssueCategory | null;
}

export const IssueSelector: React.FC<IssueSelectorProps> = ({ onSelect, selectedCategory }) => {
  const getIcon = (iconName: string, size: number) => {
    switch (iconName) {
      case 'Construction': return <Construction size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Trash2': return <Trash2 size={size} />;
      case 'Dog': return <Dog size={size} />;
      default: return <AlertTriangle size={size} />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">What would you like to report?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(IssueCategory).map((category) => {
          const details = ISSUE_DETAILS[category];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-200 group
                ${isSelected 
                  ? 'border-civic-green bg-green-50 shadow-md ring-2 ring-civic-green ring-opacity-50' 
                  : 'border-gray-200 bg-white hover:border-civic-yellow hover:shadow-md'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${details.bg} ${details.color}`}>
                  {getIcon(details.icon, 28)}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-civic-green' : 'text-gray-800'}`}>
                    {category}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{details.description}</p>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-civic-green animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
