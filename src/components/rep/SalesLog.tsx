import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SaleItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  items: SaleItem[];
  total_amount: number;
  created_at: string;
}

export const SalesLog = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetchTodaySales();

    // Set up realtime subscription
    const channel = supabase
      .channel('sales-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sales'
        },
        () => {
          fetchTodaySales();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTodaySales = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('rep_id', user.id)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSales(data as unknown as Sale[]);
    }
  };
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 text-card-foreground">Today's Sales</h3>
      <div className="space-y-3">
        {sales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sales recorded yet today.</p>
            <p className="text-sm text-muted-foreground mt-2">Your sales will appear here as you record them.</p>
          </div>
        ) : (
          sales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <div>
                <p className="font-medium text-card-foreground">
                  {sale.items.map((item: any) => `${item.itemName} x${item.quantity}`).join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(sale.created_at), 'h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">#{sale.total_amount.toFixed(2)}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};
