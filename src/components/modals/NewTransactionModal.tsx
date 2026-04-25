import React, { useState } from 'react';
import { useNexusStore } from '../../store/useNexusStore';
import { DollarSign, Tag, Calendar, FileText, Plus } from 'lucide-react';
import Modal from '../ui/Modal';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useNexusStore();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Revenue',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Success', `Transaction "${formData.name}" added successfully.`, 'success');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="New Transaction"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Transaction Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">
              <Tag size={16} />
            </div>
            <input 
              required
              type="text" 
              placeholder="e.g. Server Infrastructure"
              className="w-full bg-surface/50 border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Amount</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">
                <DollarSign size={16} />
              </div>
              <input 
                required
                type="number" 
                placeholder="0.00"
                className="w-full bg-surface/50 border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Category</label>
            <select 
              className="w-full bg-surface/50 border border-border-subtle rounded-xl py-3 px-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all appearance-none"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Revenue</option>
              <option>Expense</option>
              <option>Transfer</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Transaction Date</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors">
              <Calendar size={16} />
            </div>
            <input 
              type="date" 
              className="w-full bg-surface/50 border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-1">Notes</label>
          <div className="relative group">
            <div className="absolute left-4 top-4 text-text-tertiary group-focus-within:text-primary transition-colors">
              <FileText size={16} />
            </div>
            <textarea 
              rows={3}
              placeholder="Additional details..."
              className="w-full bg-surface/50 border border-border-subtle rounded-xl py-3 pl-12 pr-4 text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all resize-none"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-border text-sm font-bold text-text-secondary hover:bg-surface transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-[1.5] px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTransactionModal;
