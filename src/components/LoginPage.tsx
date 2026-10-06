import React, { useState } from 'react';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext'; 

export default function LoginPage() {
  const { login } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin'); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    login(username, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 font-sans text-slate-100">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Red accent glow at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-orange-500" />

        <div className="text-center mb-8 pt-2">
          {/* Red icon badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">TrudaIMS</h1>
          <p className="text-sm text-slate-400 mt-1">Internal Management System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // Red focus ring
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="e.g. j.afrikaner"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Red focus ring
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Access Role
            </label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as UserRole)}
              // Red focus ring
              className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            >
              <option value="admin" className="bg-slate-900">Client Admin</option>
              <option value="staff" className="bg-slate-900">General Staff / Operator</option>
              <option value="super-dev" className="bg-slate-900">Super Dev</option>
            </select>
          </div>

          <button 
            type="submit" 
            // Red button with shadow
            className="w-full mt-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-rose-500 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}