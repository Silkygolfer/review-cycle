'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client-supabase-instance';
import { useRouter } from 'next/navigation';

export function PasswordSetupForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const supabase = createClient();
      
      // Update user with new password (accepts the invitation)
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      // Redirect to dashboard or onboarding
      router.push('/dashboard');
    } catch (err) {
      console.error('Error setting password:', err);
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="password">Create Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="8"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength="8"
          className="form-control"
        />
      </div>
      
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Processing...' : 'Complete Registration'}
      </button>
    </form>
  );
}