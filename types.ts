export enum IssueCategory {
  ROAD = 'Road Damage',
  ELECTRICITY = 'Electricity Issues',
  SANITATION = 'Garbage/Sanitation',
  ANIMALS = 'Dead/Stray Animals'
}

export interface ComplaintFormData {
  category: IssueCategory | null;
  location: string;
  description: string;
  userName: string;
  urgency: 'Normal' | 'Urgent' | 'Critical';
  image: string | null;
}

export interface GeneratedLetter {
  content: string;
  isGenerating: boolean;
  error: string | null;
}