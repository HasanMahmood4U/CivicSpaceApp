import React, { useState } from 'react';
import { Header } from './components/Header';
import { IssueSelector } from './components/IssueSelector';
import { ComplaintForm } from './components/ComplaintForm';
import { LetterDisplay } from './components/LetterDisplay';
import { ComplaintFormData, IssueCategory, GeneratedLetter } from './types';
import { generateComplaintLetter } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: null,
    location: '',
    description: '',
    userName: '',
    urgency: 'Normal',
    image: null
  });

  const [letterState, setLetterState] = useState<GeneratedLetter>({
    content: '',
    isGenerating: false,
    error: null
  });

  const [step, setStep] = useState<'select' | 'details' | 'result'>('select');

  const handleCategorySelect = (category: IssueCategory) => {
    setFormData(prev => ({ ...prev, category }));
    setStep('details');
  };

  const handleFormSubmit = async (data: ComplaintFormData) => {
    setFormData(data);
    setLetterState({ content: '', isGenerating: true, error: null });
    
    try {
      const generatedText = await generateComplaintLetter(data);
      setLetterState({ content: generatedText, isGenerating: false, error: null });
      setStep('result');
    } catch (error) {
      setLetterState({ 
        content: '', 
        isGenerating: false, 
        error: 'Failed to generate the letter. Please try again.' 
      });
    }
  };

  const handleReset = () => {
    setStep('select');
    setFormData({
      category: null,
      location: '',
      description: '',
      userName: '',
      urgency: 'Normal',
      image: null
    });
    setLetterState({ content: '', isGenerating: false, error: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 pt-8">
        
        {/* Progress Stepper */}
        {step !== 'result' && (
          <div className="mb-8 flex items-center justify-center gap-4 text-sm font-semibold text-gray-400">
            <span className={`${step === 'select' ? 'text-civic-green' : 'text-gray-800'}`}>1. Select Issue</span>
            <span className="h-0.5 w-8 bg-gray-300"></span>
            <span className={`${step === 'details' ? 'text-civic-yellow' : ''}`}>2. Provide Details</span>
            <span className="h-0.5 w-8 bg-gray-300"></span>
            <span>3. Get Letter</span>
          </div>
        )}

        <div className="transition-all duration-300">
          {step === 'select' && (
            <IssueSelector 
              onSelect={handleCategorySelect} 
              selectedCategory={formData.category} 
            />
          )}

          {step === 'details' && (
            <div>
              <div className="mb-6">
                 <button 
                  onClick={() => setStep('select')}
                  className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2"
                 >
                   ← Back to Categories
                 </button>
                 <h2 className="text-2xl font-bold text-gray-800">
                   Reporting <span className="text-civic-yellow">{formData.category}</span>
                 </h2>
              </div>
              
              <ComplaintForm 
                initialData={formData} 
                onSubmit={handleFormSubmit}
                isLoading={letterState.isGenerating}
              />
              
              {letterState.error && (
                <div className="mt-4 p-4 bg-red-50 text-civic-red border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {letterState.error}
                </div>
              )}
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Your Formal Complaint is Ready
              </h2>
              <LetterDisplay 
                content={letterState.content} 
                onReset={handleReset} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;