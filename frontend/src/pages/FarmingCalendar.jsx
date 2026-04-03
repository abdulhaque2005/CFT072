import { useState } from 'react';
import CalendarView from '../components/CalendarView';
import Loading from '../components/Loading';
import { getFarmingCalendar } from '../services/schemeApi';
import toast from 'react-hot-toast';

export default function FarmingCalendar() {
  const [form, setForm] = useState({ crop: '', season: '', location: '' });
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.crop) return;
    setLoading(true);
    try {
      const result = await getFarmingCalendar(form);
      setCalendarData(result.data);
      toast.success('Farming calendar ready! 📅');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">📅 Farming Calendar</h1>
        <p className="text-gray-500 mt-2">Poora farming schedule — buwai se katai tak, AI plan karega</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <CalendarView events={[]} />
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">🌾 Crop Calendar Generate Karein</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Crop Name</label>
                <input
                  type="text"
                  value={form.crop}
                  onChange={(e) => setForm({...form, crop: e.target.value})}
                  placeholder="e.g. Wheat, Rice, Cotton"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Season</label>
                  <select
                    value={form.season}
                    onChange={(e) => setForm({...form, season: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Auto-detect</option>
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                    placeholder="e.g. Gujarat"
                    className="input-field"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Generating...' : '📅 Calendar Generate Karein'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {loading && <Loading text="Farming calendar bana raha hoon..." />}

      {calendarData && !loading && (
        <div className="card animate-fade-in">
          <h3 className="font-bold text-gray-800 mb-3">
            📋 {calendarData.crop} — {calendarData.season} Calendar
          </h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {calendarData.calendar}
          </div>
        </div>
      )}
    </div>
  );
}
