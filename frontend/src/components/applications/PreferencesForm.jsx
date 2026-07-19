export default function PreferencesForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Role</label>
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Software Engineer Intern" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., Python, React, NLP" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="e.g., Lahore" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Work Setting</label>
        <select name="work_type" value={formData.work_type} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded">
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
    </div>
  );
}