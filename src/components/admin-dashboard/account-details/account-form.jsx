'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function AccountForm({ account, updateAccount }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default values for the form
  const defaultValues = {
    account_name: account.account_name,
    address: account.address || '',
    city: account.city || '',
    state: account.state || '',
    country: account.country || '',
  };

  const form = useForm({
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      account_name: account.account_name,
      address: account.address || '',
      city: account.city || '',
      state: account.state || '',
      country: account.country || '',
    });
  }, [account, form.reset]);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const result = await updateAccount(account.id, data);
      
      if (result.success) {
        toast.success('Your account information has been updated successfully.')
      } else {
        const errorMessage = result.error || result.accountError?.message || "Failed to update account. Please try again.";
        toast.error(errorMessage);
        console.error("Failed to update account:", result.error || result.accountError);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex flex-col w-full items-center mt-2'>
      <h1>Account Details</h1>
        <p className='text-sm italic'>Update your account information below. Created on {new Date(account.created_at).toLocaleDateString()}.</p>
        <div className='w-full mt-4 flex flex-col items-center'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-3/4">
              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem className={'space-y-2'}>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className={'space-y-2'}>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className={'space-y-2'}>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className={'space-y-2'}>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state or province" {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className={'space-y-2'}>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} value={field.value || ''} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
    </div>
  );
}