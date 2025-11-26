import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddStockPanelProps {
  onClose: () => void;
}

export const AddStockPanel = ({ onClose }: AddStockPanelProps) => {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName || !quantity) {
      toast.error('Please fill all fields');
      return;
    }

    // Simulate API call
    toast.success(`Added ${quantity} units of ${itemName}`);
    onClose();
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
