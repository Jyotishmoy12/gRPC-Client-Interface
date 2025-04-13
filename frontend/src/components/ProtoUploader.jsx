import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, X } from 'lucide-react';

const ProtoUploader = ({ setProtoContent }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    
    try {
      const text = await file.text();
      setProtoContent(text);
      setFileName(file.name);
      setUploadSuccess(true);
      
      // Reset success indicator after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to read file:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setFileName('');
    setProtoContent('');
    fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'bg-blue-500/10 border-blue-400' 
            : fileName 
              ? 'bg-green-500/10 border-green-400' 
              : 'border-gray-600 hover:border-gray-500 bg-slate-900/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".proto"
          className="hidden"
        />
        
        {!fileName ? (
          <div className="flex flex-col items-center justify-center py-3">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-300 mb-2">Drag & drop your .proto file here</p>
            <p className="text-xs text-gray-500 mb-4">- or -</p>
            <button
              onClick={handleButtonClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium flex items-center"
            >
              <File className="w-4 h-4 mr-2" />
              Browse Files
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-left">
              <div className="bg-slate-800 p-2 rounded-lg mr-3">
                <File className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200 truncate max-w-xs">{fileName}</p>
                <p className="text-xs text-gray-500">Proto Definition</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {uploadSuccess && (
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 animate-pulse" />
              )}
              <button 
                onClick={clearFile}
                className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!fileName && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Supported file: .proto
        </p>
      )}
    </div>
  );
};

export default ProtoUploader;