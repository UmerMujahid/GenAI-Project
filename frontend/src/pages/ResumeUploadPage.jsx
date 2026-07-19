import { useState } from 'react';
import ResumeDropzone from '../components/resume/ResumeDropzone';
import { uploadResume } from '../services/applicationService';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/Card';

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadResume(formData);
      alert("Resume uploaded successfully!");
      // Redirect to preferences page
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#030303]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">
            Upload Your Resume
          </CardTitle>
          <CardDescription>
            Upload your latest resume to begin your internship search.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ResumeDropzone setFile={setFile} />
        </CardContent>

        <CardFooter>
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Next Step: Preferences
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}