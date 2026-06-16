import React, { useState, useEffect } from 'react';
import { Phone, Lock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, trigger success redirection
    if (authService.isAuthenticated()) {
      onLoginSuccess();
    }
  }, [onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      await authService.login(phone.trim(), password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* Visual background glow blobs */}
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2"></div>

      <div className="login-card glass-panel">
        <div className="logo-wrapper">
          <ShieldCheck size={32} />
        </div>
        <h2 className="login-title">OneQR Admin</h2>
        <p className="login-subtitle">Sign in to manage system users & analytics</p>

        {error && (
          <div className="alert-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Mobile Number</label>
            <div className="input-wrapper">
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="e.g. 8200875023"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                required
              />
              <Phone size={18} className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner" style={{ width: '20px', height: '20px', margin: 0 }}></span>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
