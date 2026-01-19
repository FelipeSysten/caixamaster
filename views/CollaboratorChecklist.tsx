
import React, { useState } from 'react';
import { User, CHECKLIST_ITEMS, Submission } from '../types';

interface CollaboratorChecklistProps {
  user: User;
  onComplete: (submission: Submission) => void;
}

const CollaboratorChecklist: React.FC<CollaboratorChecklistProps> = ({ user, onComplete }) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const toggleItem = (id: number) => {
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openingItems = CHECKLIST_ITEMS.filter(i => i.category === 'Abertura');
  const closingItems = CHECKLIST_ITEMS.filter(i => i.category === 'Fechamento');

  const allOpeningSelected = openingItems.every(item => checkedIds.includes(item.id));
  const allClosingSelected = closingItems.every(item => checkedIds.includes(item.id));

  const toggleAllSection = (category: 'Abertura' | 'Fechamento') => {
    const sectionItems = category === 'Abertura' ? openingItems : closingItems;
    const sectionIds = sectionItems.map(i => i.id);
    const areAllSelected = category === 'Abertura' ? allOpeningSelected : allClosingSelected;

    if (areAllSelected) {
      setCheckedIds(prev => prev.filter(id => !sectionIds.includes(id)));
    } else {
      setCheckedIds(prev => {
        const otherIds = prev.filter(id => !sectionIds.includes(id));
        return [...otherIds, ...sectionIds];
      });
    }
  };

  const progress = Math.round((checkedIds.length / CHECKLIST_ITEMS.length) * 100);

  const handleOpenAuth = () => {
    setShowAuthModal(true);
    setError('');
    setPassword('');
  };

  const handleFinalSubmit = () => {
    // Authenticate
    if (password === user.password || user.password === undefined) {
      const sub: Submission = {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        date: new Date().toISOString(),
        completedItems: checkedIds,
        isFullComplete: checkedIds.length === CHECKLIST_ITEMS.length,
        notes: notes
      };
      onComplete(sub);
      setSubmitted(true);
      setShowAuthModal(false);
    } else {
      setError('Senha incorreta. Por favor, tente novamente.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Checklist Enviado!</h2>
        <p className="text-slate-500 mt-2 mb-8 text-center max-w-sm">
          Bom trabalho hoje, {user.name}! Seus dados foram enviados com sucesso para a administração.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setCheckedIds([]); setNotes(''); }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Novo Checklist
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`space-y-8 animate-in slide-in-from-bottom-4 duration-500 ${showAuthModal ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Header Info */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
          <h2 className="text-2xl font-bold">Rotina Diária</h2>
          <p className="opacity-90 mt-1">Olá {user.name}, complete as etapas de hoje com atenção.</p>
          
          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium">Progresso Total</span>
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">A</span>
                <h3 className="text-xl font-bold text-slate-800">Abertura (1-15)</h3>
              </div>
              <button 
                onClick={() => toggleAllSection('Abertura')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${allOpeningSelected ? 'bg-slate-200 text-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
              >
                {allOpeningSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {openingItems.map(item => (
                <label key={item.id} className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input 
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={checkedIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className={`text-sm leading-relaxed ${checkedIds.includes(item.id) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">F</span>
                <h3 className="text-xl font-bold text-slate-800">Fechamento (16-20)</h3>
              </div>
              <button 
                onClick={() => toggleAllSection('Fechamento')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${allClosingSelected ? 'bg-slate-200 text-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
              >
                {allClosingSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {closingItems.map(item => (
                <label key={item.id} className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input 
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={checkedIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className={`text-sm leading-relaxed ${checkedIds.includes(item.id) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Observações Adicionais</label>
                <textarea 
                  className="w-full bg-slate-50 rounded-xl p-3 text-sm border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  rows={4}
                  placeholder="Alguma intercorrência ou detalhe importante?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button 
                onClick={handleOpenAuth}
                disabled={checkedIds.length === 0}
                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed sticky bottom-4 z-40"
              >
                Confirmar e Enviar Checklist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Verificar Identidade</h3>
              <p className="text-sm text-slate-500 mt-1">Digite sua senha para confirmar o envio de {user.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <input 
                  type="password"
                  autoFocus
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${error ? 'border-red-500 animate-shake' : 'border-slate-200'}`}
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinalSubmit()}
                />
                {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorChecklist;
