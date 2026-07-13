import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Heart, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoading, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Get the redirect path from router location state
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1069818817342-99o0u29k0b4352n8a38i728t38r6a17b.apps.googleusercontent.com'; // Default placeholder/fallback if not in env

    const initializeGoogleSignIn = () => {
      // @ts-ignore
      if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            setError('');
            try {
              await googleLogin(response.credential);
              navigate(from, { replace: true });
            } catch (err: any) {
              setError(err);
            }
          }
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };

    // Retry initialization briefly after mount in case the script is loading async
    const timer = setTimeout(() => {
      initializeGoogleSignIn();
    }, 500);

    return () => clearTimeout(timer);
  }, [googleLogin, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-left">
        
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-3">
            <Heart className="w-8 h-8 fill-current animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-sans">Welcome Back</h2>
          <p className="mt-1.5 text-xs text-slate-500">Sign in to book doctor serials or manage appointments in BD.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-100 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahim@example.com"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
              <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10 disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Google Sign-In Button */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <span className="block text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Or Sign In with Google
          </span>
          <div className="flex justify-center">
            <div id="google-signin-btn" className="w-full min-h-[40px]"></div>
          </div>
        </div>

        {/* Signup redirection link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
          .
        </p>

      </div>
    </div>
  );
};

export default Login;
