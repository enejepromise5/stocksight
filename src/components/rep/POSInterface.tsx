import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';


interface CartItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface InventoryItem {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
}

export const POSInterface = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('item_name');

    if (!error && data) {
      setInventory(data);
    }
  };

  const addToCart = () => {
    if (!itemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const selectedItem = inventory.find(
      item => item.item_name.toLowerCase() === itemName.trim().toLowerCase()
    );
    
    if (!selectedItem) {
      toast.error('Item not found in inventory');
      return;
    }

    if (selectedItem.quantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    setCart([...cart, { 
      itemName: selectedItem.item_name, 
      quantity, 
      price: selectedItem.price 
    }]);
    setItemName('');
    setQuantity(1);
    toast.success('Item added to cart');
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const recordSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to record sales');
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

      // Insert sale
      const { error: saleError } = await supabase
        .from('sales')
        .insert({
          shop_id: profile.id,
          rep_id: user.id,
          items: cart as any,
          total_amount: totalAmount
        });

      if (saleError) throw saleError;

      // Update inventory quantities
      for (const cartItem of cart) {
        const inventoryItem = inventory.find(item => item.item_name === cartItem.itemName);
        if (inventoryItem) {
          const { error: updateError } = await supabase
            .from('inventory')
            .update({ quantity: inventoryItem.quantity - cartItem.quantity })
            .eq('id', inventoryItem.id);

          if (updateError) throw updateError;
        }
      }

      setShowFlash(true);
      setTimeout(() => {
        setShowFlash(false);
        toast.success('Sale recorded successfully!');
        setCart([]);
        fetchInventory(); // Refresh inventory
      }, 500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to record sale');
    }
  };

  return (
    <>
      {/* Electric Lemon Flash Animation */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-primary z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Item Entry Form */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-card-foreground">Add Item</h3>
          
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              placeholder="Type item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="text-lg"
            />
          </div>

          {itemName && inventory.find(i => i.item_name.toLowerCase() === itemName.trim().toLowerCase()) && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Price per unit</p>
              <p className="text-2xl font-bold text-primary">
                #{inventory.find(i => i.item_name.toLowerCase() === itemName.trim().toLowerCase())?.price.toFixed(2)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-3xl font-bold text-card-foreground min-w-[60px] text-center">
                {quantity}
              </span>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={addToCart} className="w-full" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </Card>

        {/* Cart Preview */}
        {cart.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-card-foreground">Current Cart</h3>
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            
            <div className="space-y-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-card-foreground">
                  <span>{item.itemName} x {item.quantity}</span>
                  <span className="font-bold">#{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-card-foreground">Total</span>
                <span className="text-3xl font-bold text-primary">#{totalAmount.toFixed(2)}</span>
              </div>
              
              <Button onClick={recordSale} className="w-full" size="lg">
                Record Sale
              </Button>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};
