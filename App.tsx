
import React, { useState, useEffect } from 'react';
import { User, Submission } from './types';
import { supabase } from './supabaseClient';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import CollaboratorChecklist from './views/CollaboratorChecklist';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Initial Data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Users
      const { data: userData, error: userError } = await supabase
        .from('staff_users')
        .select('*')
        .order('name');
      
      if (userError) throw userError;
      if (userData) setUsers(userData as User[]);

      // Fetch Submissions
      const { data: subData, error: subError } = await supabase
        .from('submissions')
        .select('*')
        .order('date', { ascending: false });

      if (subError) throw subError;
      if (subData) setSubmissions(subData as Submission[]);

    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to new submissions in real-time
    const subSubscription = supabase
      .channel('public:submissions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'submissions' }, (payload) => {
        setSubmissions(prev => [payload.new as Submission, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subSubscription);
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addUser = async (newUser: User) => {
    const { data, error } = await supabase
      .from('staff_users')
      .insert([newUser])
      .select();

    if (error) {
      alert('Erro ao adicionar usuário: ' + error.message);
      return;
    }
    if (data) setUsers(prev => [...prev, data[0] as User]);
  };

  const removeUser = async (id: string) => {
    const { error } = await supabase
      .from('staff_users')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao remover usuário: ' + error.message);
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addSubmission = async (sub: Submission) => {
    // Insert into Supabase
    const { error } = await supabase
      .from('submissions')
      .insert([{
        user_id: sub.userId,
        user_name: sub.userName,
        completed_items: sub.completedItems,
        is_full_complete: sub.isFullComplete,
        notes: sub.notes
      }]);

    if (error) {
      alert('Erro ao salvar checklist: ' + error.message);
    }
    // No need to manually update submissions state due to real-time subscription
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Carregando CaixaMaster...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} availableUsers={users} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">CaixaMaster</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">{currentUser.name}</p>
            <p className="text-xs text-slate-500 uppercase font-medium">{currentUser.role === 'ADMIN' ? 'Administrador' : 'Colaborador'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {currentUser.role === 'ADMIN' ? (
          <AdminDashboard 
            users={users} 
            submissions={submissions} 
            onAddUser={addUser} 
            onRemoveUser={removeUser}
          />
        ) : (
          <CollaboratorChecklist 
            user={currentUser} 
            onComplete={addSubmission} 
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 p-4 text-center text-slate-400 text-xs">
        &copy; 2026 CaixaMaster - Sistema de Gestão Operacional em Nuvem
      </footer>
    </div>
  );
};

export default App;
