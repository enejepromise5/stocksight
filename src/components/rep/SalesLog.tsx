import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Sale {
  id: string;
  items: string;
  amount: number;
  time: string;
}

const mockSales: Sale[] = [];

export const SalesLog = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 text-card-foreground">Today's Sales</h3>
      <div className="space-y-3">
        {mockSales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sales recorded yet today.</p>
            <p className="text-sm text-muted-foreground mt-2">Your sales will appear here as you record them.</p>
          </div>
        ) : (
          mockSales.map((sale, index) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <div>
                <p className="font-medium text-card-foreground">{sale.items}</p>
                <p className="text-sm text-muted-foreground">{sale.time}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">${sale.amount.toFixed(2)}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};
