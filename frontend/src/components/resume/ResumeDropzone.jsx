import { useState } from 'react';

export default function ResumeDropzone({ setFile }) {
  const [dragActive, setDragActive] = useState(false);
  const [localFile, setLocalFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx')) {
        setLocalFile(droppedFile);
        setFile(droppedFile);
      } else {
        alert("Please upload a .pdf or .docx file");
      }
    }
  };

  return (
    <div 
      className={`p-8 border-2 border-dashed rounded-lg text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <p className="text-gray-600">Drag & Drop your Resume (.pdf, .docx) here</p>
      <input 
        type="file" 
        accept=".pdf,.docx" 
        className="hidden" 
        id="file-upload"
        onChange={(e) => {
          setLocalFile(e.target.files[0]);
          setFile(e.target.files[0]);
        }} 
      />
      <label htmlFor="file-upload" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
        Browse Files
      </label>
      {localFile && <p className="mt-4 text-sm text-green-600 font-semibold">Selected: {localFile.name}</p>}
    </div>
  );
}