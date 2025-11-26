import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Sale {
  id: string;
  items: string;
  amount: number;
  time: string;
}

const mockSales: Sale[] = [
  { id: '1', items: 'Rice Bag x 3', amount: 45.00, time: '2 min ago' },
  { id: '2', items: 'Cooking Oil x 2', amount: 28.00, time: '15 min ago' },
  { id: '3', items: 'Beans x 5', amount: 35.00, time: '1 hour ago' },
];

export const SalesLog = () => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 text-card-foreground">Today's Sales</h3>
      <div className="space-y-3">
        {mockSales.map((sale, index) => (
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
        ))}
      </div>
    </Card>
  );
};
