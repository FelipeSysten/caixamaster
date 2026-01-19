
import React, { useState, useEffect, useMemo } from 'react';
import { User, Submission, UserRole } from '../types';
import { getDashboardInsights } from '../geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  users: User[];
  submissions: Submission[];
  onAddUser: (user: User) => void;
  onRemoveUser: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, submissions, onAddUser, onRemoveUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'history'>('overview');
  const [insights, setInsights] = useState<string>('Gerando insights com IA...');
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Normalize data coming from Supabase (handling snake_case)
  const normalizedSubmissions = useMemo(() => {
    return submissions.map(s => ({
      ...s,
      userName: s.user_name || s.userName,
      isFullComplete: s.is_full_complete ?? s.isFullComplete,
      completedItems: s.completed_items || s.completedItems || []
    }));
  }, [submissions]);

  useEffect(() => {
    const fetchInsights = async () => {
      if (normalizedSubmissions.length > 0) {
        const result = await getDashboardInsights(normalizedSubmissions);
        setInsights(result);
      }
    };
    fetchInsights();
  }, [normalizedSubmissions]);

  const stats = useMemo(() => {
    const total = normalizedSubmissions.length;
    const fullyComplete = normalizedSubmissions.filter(s => s.isFullComplete).length;
    const avgItems = total > 0 ? (normalizedSubmissions.reduce((acc, s) => acc + (s.completedItems?.length || 0), 0) / total).toFixed(1) : 0;
    
    return { total, fullyComplete, avgItems };
  }, [normalizedSubmissions]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = normalizedSubmissions.filter(s => s.date.startsWith(dateStr)).length;
      return { name: dateStr.split('-').reverse().slice(0,2).reverse().join('/'), value: count };
    }).reverse();
    return last7Days;
  }, [normalizedSubmissions]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;
    const newUser: User = {
      id: crypto.randomUUID(), // Will be overridden by DB or used as reference
      name: newName,
      email: newEmail,
      role: UserRole.COLLABORATOR,
      active: true,
      password: newPassword
    };
    onAddUser(newUser);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <nav className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Visão Geral</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Colaboradores</button>
        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>Histórico</button>
      </nav>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Envios Totais</p>
              <h4 className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</h4>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Conformidade (100%)</p>
              <h4 className="text-3xl font-bold text-emerald-600 mt-1">{stats.fullyComplete}</h4>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Média de Itens/Caixa</p>
              <h4 className="text-3xl font-bold text-indigo-600 mt-1">{stats.avgItems}</h4>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80">
              <h5 className="font-bold text-slate-800 mb-6">Atividade de Envio (Últimos 7 dias)</h5>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h5 className="font-bold">Análise Inteligente (IA)</h5>
              </div>
              <div className="space-y-4">
                {insights.split('\n').map((line, i) => (
                  <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-bold text-slate-800 px-2">Colaboradores Cadastrados</h5>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.filter(u => u.role !== UserRole.ADMIN).map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                      <td className="px-6 py-4 text-slate-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Ativo</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => onRemoveUser(user.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800 px-2">Cadastrar Novo</h5>
            <form onSubmit={handleAddUser} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome Completo" />
              <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email Profissional" />
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Senha" />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg">Salvar Colaborador</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h5 className="font-bold text-slate-800 px-2">Histórico de Envios</h5>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data/Hora</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Colaborador</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Itens</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {normalizedSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600 text-sm">{new Date(sub.date).toLocaleDateString('pt-BR')} <span className="text-slate-400">às {new Date(sub.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'})}</span></td>
                      <td className="px-6 py-4 font-medium text-slate-800">{sub.userName}</td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-indigo-600">{sub.completedItems.length}</span><span className="text-slate-400 text-sm"> / 20</span></td>
                      <td className="px-6 py-4">{sub.isFullComplete ? <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold">COMPLETO</span> : <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-700 text-[10px] font-bold">INCOMPLETO</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
