
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, availableUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const selectedUser = availableUsers.find(u => u.id === selectedUserId);

  useEffect(() => {
    // Reset password and error when changing user
    setPassword('');
    setError('');
  }, [selectedUserId]);

  const handleEnter = () => {
    if (!selectedUser) return;

    if (password === selectedUser.password) {
      onLogin(selectedUser);
    } else {
      setError('Senha incorreta. Verifique seus dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-slate-200/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl text-white text-4xl font-black mb-6 shadow-xl shadow-indigo-200 transform hover:scale-105 transition-transform duration-300">
            C
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CaixaMaster</h1>
          <p className="text-slate-500 mt-2 font-medium">Gestão Inteligente de Caixa</p>
        </div>

        <div className="space-y-5">
          {/* Seleção de Usuário */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuário</label>
            <div className="relative group">
              <select 
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none font-medium text-slate-700 cursor-pointer ${selectedUserId ? 'border-indigo-200' : 'border-slate-200'}`}
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="" disabled>Escolha sua conta...</option>
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role === 'ADMIN' ? 'Administrador' : 'Colaborador'})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Campo de Senha (Aparece apenas quando um usuário é selecionado) */}
          <div className={`space-y-2 transition-all duration-500 overflow-hidden ${selectedUserId ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha de Acesso</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all font-medium ${error ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </p>
            )}
          </div>

          <button
            onClick={handleEnter}
            disabled={!selectedUserId || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-indigo-200 disabled:shadow-none mt-4 group"
          >
            <span className="flex items-center justify-center gap-2">
              Acessar Painel
              <svg className="group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Segurança de Dados • CaixaMaster Cloud
          </p>
          {availableUsers.length === 0 && (
            <div className="bg-amber-50 text-amber-700 p-3 rounded-xl text-xs font-medium border border-amber-100 leading-relaxed">
              Carregando lista de usuários do servidor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
