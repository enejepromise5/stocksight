import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export const InventoryTable = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    fetchInventory();

    // Set up realtime subscription
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInventory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get the shop_id using the get_user_shop_id function
    const { data: shopId } = await supabase.rpc('get_user_shop_id', {
      _user_id: user.id
    });

    if (!shopId) return;

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('shop_id', shopId)
      .order('item_name');

    if (!error && data) {
      setInventory(data);
    }
  };
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Inventory Management</h2>
      
      {inventory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No inventory items yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Add stock items to track your inventory here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-semibold text-card-foreground">Item</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-card-foreground">Quantity</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-card-foreground">Price</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-card-foreground">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => {
                const isLowStock = item.quantity < LOW_STOCK_THRESHOLD;
                const totalValue = item.quantity * item.price;
                
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-border/50 ${isLowStock ? 'bg-warning/10' : ''}`}
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        {isLowStock && <AlertCircle className="h-4 w-4 text-warning" />}
                        <span className="font-medium text-card-foreground">{item.item_name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-2">
                      <span className={`font-bold text-lg ${isLowStock ? 'text-primary' : 'text-card-foreground'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="text-right py-4 px-2 text-card-foreground">
                      #{item.price.toFixed(2)}
                    </td>
                    <td className="text-right py-4 px-2 font-bold text-primary">
                      #{totalValue.toFixed(2)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
