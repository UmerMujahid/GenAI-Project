import { useState } from 'react';
import PreferencesForm from '../components/applications/PreferencesForm';
import { submitPreferences } from '../services/applicationService';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/Card';

export default function PreferencesPage() {
  const [formData, setFormData] = useState({
    role: '',
    skills: '',
    city: '',
    work_type: 'On-site',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()),
    };

    try {
      await submitPreferences(payload);
      alert("Preferences saved! Discovery agent starting...");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#030303]">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl">
              Internship Preferences
            </CardTitle>
            <CardDescription>
              Tell us your preferred role, skills, location, and work setting.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PreferencesForm
              formData={formData}
              setFormData={setFormData}
            />
          </CardContent>

          <CardFooter>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Find Internships
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}