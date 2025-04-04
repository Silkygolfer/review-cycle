'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client-supabase-instance';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <Card>
      <CardHeader>
        <CardTitle>Complete Signup</CardTitle>
        <CardDescription>Enter your password below to complete your signup</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="flex flex-col gap-6">
            <div className='grid gap-3'>
              <Label htmlFor="password">Password</Label>
              <Input 
                id='password' 
                name='password' 
                type='password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id='confirmPassword' 
                name='confirmPassword' 
                type='password' 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <div className='flex flex-col gap-3'>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Setting up..." : "Complete Registration"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}