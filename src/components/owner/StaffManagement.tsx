import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get all sales reps linked to this owner
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('owner_id', user.id);

    if (!profiles || profiles.length === 0) {
      setStaff([]);
      return;
    }

    // Get roles for these profiles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', profiles.map(p => p.id))
      .eq('role', 'SALES_REP');

    if (!roles || roles.length === 0) {
      setStaff([]);
      return;
    }

    // For display purposes, create basic staff list
    // Note: Full user details require admin API access
    const staffData = roles.map((role: { user_id: string; role: string }) => ({
      id: role.user_id,
      email: 'sales-rep@shop.com',
      name: 'Sales Representative',
      role: 'SALES_REP',
    }));
    
    setStaff(staffData);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail || !newPassword || !newName) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to add staff');
        return;
      }

      // Create the sales rep user
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            name: newName,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!newUser.user) throw new Error('Failed to create user');

      // Link the sales rep to the owner's shop
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ owner_id: user.id })
        .eq('id', newUser.user.id);

      if (profileError) throw profileError;

      // Assign SALES_REP role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: 'SALES_REP',
        });

      if (roleError) throw roleError;

      toast.success(`Sales Rep ${newName} added successfully!`);
      
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      setShowAddForm(false);
      fetchStaff();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add sales rep');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
    toast.success('Staff member removed');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-card-foreground">Staff Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Sales Rep
        </Button>
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 border border-border rounded-lg"
        >
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Full Name</Label>
              <Input
                id="staffName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staffEmail">Email</Label>
              <Input
                id="staffEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="rep@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="staffPassword">Password</Label>
              <Input
                id="staffPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Staff List */}
      <div className="space-y-3">
        {staff.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No sales representatives yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Add Sales Rep" to create accounts for your team.</p>
          </div>
        ) : (
          staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div>
                <p className="font-medium text-card-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveStaff(member.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};
