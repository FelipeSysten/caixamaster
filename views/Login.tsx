
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, availableUsers }) => {
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleEnter = () => {
    const user = availableUsers.find(u => u.id === selectedUserId);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-200">
            C
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Bem-vindo ao CaixaMaster</h1>
          <p className="text-slate-500 mt-2">Selecione seu usuário para começar o expediente</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Seu Usuário</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Selecione um usuário...</option>
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleEnter}
            disabled={!selectedUserId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-100 disabled:shadow-none"
          >
            Acessar Sistema
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Usa o login default de administrador para cadastrar colaboradores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
