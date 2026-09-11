import React, { useState, useEffect } from 'react';
import { X, Flame, Recycle, Scissors, Wine, QrCode, AlertCircle, Save } from 'lucide-react';

export default function WasteLogModal({ isOpen, onClose, onSave, editingRecord }) {
  const [formData, setFormData] = useState({
    tagId: '',
    category: 'Yellow',
    department: 'Operating Theater',
    weightKg: '',
    handlerName: '',
    location: '',
    hazardLevel: 'Bio-Infectious',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        tagId: editingRecord.tagId || '',
        category: editingRecord.category || 'Yellow',
        department: editingRecord.department || 'Operating Theater',
        weightKg: editingRecord.weightKg?.toString() || '',
        handlerName: editingRecord.handlerName || '',
        location: editingRecord.location || '',
        hazardLevel: editingRecord.hazardLevel || 'Bio-Infectious',
        notes: editingRecord.notes || '',
      });
    } else {
      generateTagId();
      setFormData((prev) => ({
        ...prev,
        category: 'Yellow',
        department: 'Operating Theater',
        weightKg: '',
        handlerName: 'Nurse Sarah Jenkins',
        location: 'OT-2 Scrub & Prep',
        hazardLevel: 'Bio-Infectious',
        notes: '',
      }));
    }
    setErrors({});
  }, [editingRecord, isOpen]);

  const generateTagId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const tag = `MW-${new Date().getFullYear()}-${randomNum}`;
    setFormData((prev) => ({ ...prev, tagId: tag }));
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'Yellow', name: 'Yellow', label: 'Infectious / Anatomical', icon: Flame, color: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10' },
    { id: 'Red', name: 'Red', label: 'Contaminated Plastic', icon: Recycle, color: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-500/10' },
    { id: 'White', name: 'White', label: 'Sharps / Needles', icon: Scissors, color: 'text-slate-100', border: 'border-slate-300', bg: 'bg-slate-700/40' },
    { id: 'Blue', name: 'Blue', label: 'Glassware / Ampoules', icon: Wine, color: 'text-sky-400', border: 'border-sky-500', bg: 'bg-sky-500/10' },
  ];

  const departments = ['Operating Theater', 'ICU', 'Emergency', 'Pathology Lab', 'General Ward', 'Oncology', 'Pediatrics'];

  const validate = () => {
    const errs = {};
    if (!formData.tagId.trim()) errs.tagId = 'Tag ID is required';
    if (!formData.weightKg || isNaN(Number(formData.weightKg)) || Number(formData.weightKg) <= 0) {
      errs.weightKg = 'Valid weight in kg is required (e.g. 3.5)';
    }
    if (!formData.handlerName.trim()) errs.handlerName = 'Handler / Staff name is required';
    if (!formData.location.trim()) errs.location = 'Room / Ward location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        weightKg: parseFloat(formData.weightKg),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-850">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {editingRecord ? 'Edit Waste Record' : 'Log New Biomedical Waste Bag'}
            </h2>
            <p className="text-xs text-slate-400">
              Record bag tag, hazard category, weight, and department custody.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Color Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      isSelected
                        ? `${cat.border} ${cat.bg} ring-2 ring-rose-500/40 shadow-md`
                        : 'border-slate-800 bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-slate-700'}`}></span>
                    </div>
                    <div className="mt-3">
                      <div className={`font-bold text-xs ${cat.color}`}>{cat.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cat.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barcode Tag ID & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tag ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Tag / Barcode ID <span className="text-rose-500">*</span>
                </label>
                {!editingRecord && (
                  <button
                    type="button"
                    onClick={generateTagId}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <QrCode className="w-3 h-3" /> Auto-Generate
                  </button>
                )}
              </div>
              <input
                type="text"
                value={formData.tagId}
                onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                placeholder="e.g. MW-2026-1045"
              />
              {errors.tagId && <p className="text-[11px] text-rose-400 mt-1">{errors.tagId}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department / Ward <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight & Hazard Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight (kg) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Weight in Kilograms (kg) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/hardware/status');
                      const json = await res.json();
                      if (json.success && json.data?.scale?.currentWeightKg) {
                        setFormData((prev) => ({ ...prev, weightKg: json.data.scale.currentWeightKg.toString() }));
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  title="Pull live load from connected digital platform scale"
                >
                  ⚡ Read Hardware Scale
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                  placeholder="e.g. 4.2"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">kg</span>
              </div>
              {errors.weightKg && <p className="text-[11px] text-rose-400 mt-1">{errors.weightKg}</p>}
            </div>

            {/* Hazard Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hazard Classification
              </label>
              <select
                value={formData.hazardLevel}
                onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Bio-Infectious">Bio-Infectious</option>
                <option value="High-Risk Anatomical">High-Risk Anatomical</option>
                <option value="Toxic Chemical">Toxic Chemical / Cytotoxic</option>
                <option value="Sharp Hazard">Sharp Puncture Hazard</option>
              </select>
            </div>
          </div>

          {/* Location & Handler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Location / Room <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                placeholder="e.g. OT-3 Preparation Bay"
              />
              {errors.location && <p className="text-[11px] text-rose-400 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Logging Staff / Handler <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.handlerName}
                onChange={(e) => setFormData({ ...formData, handlerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                placeholder="e.g. Nurse Sarah Jenkins"
              />
              {errors.handlerName && <p className="text-[11px] text-rose-400 mt-1">{errors.handlerName}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Contents & Handling Precautions (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              placeholder="e.g. Contaminated laparoscopic disposables; handle with heavy-duty gloves."
            ></textarea>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-950 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editingRecord ? 'Update Record' : 'Save & Tag Bag'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
