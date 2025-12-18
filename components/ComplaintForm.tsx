import React, { useState, useRef, useEffect } from 'react';
import { ComplaintFormData, IssueCategory } from '../types';
import { Button } from './Button';
import { MapPin, User, AlertCircle, FileText, Camera, X, RefreshCw } from 'lucide-react';

interface ComplaintFormProps {
  initialData: ComplaintFormData;
  onSubmit: (data: ComplaintFormData) => void;
  isLoading: boolean;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ComplaintFormData>(initialData);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleChange = (field: keyof ComplaintFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.location && formData.description && formData.userName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(formData);
    }
  };

  // Check if current category supports photo evidence
  const supportsCamera = [
    IssueCategory.ROAD, 
    IssueCategory.SANITATION, 
    IssueCategory.ANIMALS
  ].includes(formData.category as IssueCategory);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions or ensure your device has a camera.");
    }
  };

  // Attach stream to video element once it renders
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert to base64
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, image: dataUrl }));
        stopCamera();
      }
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 border-b border-gray-100 pb-4">
          <FileText className="text-civic-yellow" />
          Provide Details
        </h3>

        {/* User Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <User size={16} /> Your Name
          </label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => handleChange('userName', e.target.value)}
            placeholder="e.g., Rajesh Kumar"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-civic-yellow focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin size={16} /> Exact Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g., Near Main Market, Sector 15, City Name"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-civic-yellow focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        {/* Camera Section - Only for specific categories */}
        {supportsCamera && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Camera size={16} /> Photo Evidence (Optional)
            </label>
            
            {!isCameraOpen && !formData.image && (
              <button
                type="button"
                onClick={startCamera}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-civic-yellow hover:text-civic-yellow transition-colors flex flex-col items-center justify-center gap-2"
              >
                <Camera size={24} />
                <span>Tap to Take Photo</span>
              </button>
            )}

            {isCameraOpen && (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="h-14 w-14 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                  >
                    <div className="h-10 w-10 rounded-full bg-civic-red"></div>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {formData.image && (
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={formData.image} 
                  alt="Evidence" 
                  className="w-full h-48 object-cover" 
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-civic-red hover:bg-red-50"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Photo Attached
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <AlertCircle size={16} /> Issue Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the issue in detail. How long has it been there? What is the impact?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-civic-yellow focus:border-transparent outline-none transition-all min-h-[120px]"
            required
          />
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Urgency Level</label>
          <div className="flex gap-4">
            {['Normal', 'Urgent', 'Critical'].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={formData.urgency === level}
                    onChange={(e) => handleChange('urgency', e.target.value as any)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-300 transition-all checked:border-civic-yellow checked:bg-civic-yellow hover:shadow-sm"
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 pointer-events-none"></span>
                </div>
                <span className={`text-sm ${formData.urgency === level ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        className="w-full shadow-md text-lg"
        isLoading={isLoading}
        disabled={!isFormValid}
      >
        Generate Complaint Letter
      </Button>
    </form>
  );
};