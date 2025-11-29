import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AddStockPanelProps {
  onClose: () => void;
}

export const AddStockPanel = ({ onClose }: AddStockPanelProps) => {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !quantity || !price) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to add stock');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        toast.error('Profile not found');
        return;
      }

      // Check if item exists
      const { data: existingItem } = await supabase
        .from('inventory')
        .select('*')
        .eq('shop_id', profile.id)
        .eq('item_name', itemName)
        .single();

      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from('inventory')
          .update({ 
            quantity: existingItem.quantity + parseInt(quantity),
            price: parseFloat(price)
          })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('inventory')
          .insert({
            shop_id: profile.id,
            item_name: itemName,
            quantity: parseInt(quantity),
            price: parseFloat(price)
          });

        if (error) throw error;
      }

      toast.success(`Added ${quantity} units of ${itemName}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add stock');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="stockItemName">Item Name</Label>
        <Input
          id="stockItemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockPrice">Price per Unit</Label>
        <Input
          id="stockPrice"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          required
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Quantity to Add</Label>
        <Input
          id="stockQuantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0"
          required
          min="1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Add Stock
        </Button>
      </div>
    </form>
  );
};
