import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  currentQuantity: number;
  lowStockThreshold: number;
  costPrice: number;
  sellingPrice: number;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Rice Bag (50kg)', currentQuantity: 3, lowStockThreshold: 5, costPrice: 35.00, sellingPrice: 45.00 },
  { id: '2', name: 'Cooking Oil (5L)', currentQuantity: 15, lowStockThreshold: 10, costPrice: 12.00, sellingPrice: 15.00 },
  { id: '3', name: 'Beans (25kg)', currentQuantity: 2, lowStockThreshold: 8, costPrice: 20.00, sellingPrice: 28.00 },
  { id: '4', name: 'Sugar (2kg)', currentQuantity: 25, lowStockThreshold: 15, costPrice: 3.50, sellingPrice: 5.00 },
];

export const InventoryTable = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Inventory Management</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-semibold text-card-foreground">Item</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-card-foreground">Quantity</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-card-foreground">Cost Price</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-card-foreground">Selling Price</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-card-foreground">Profit/Unit</th>
            </tr>
          </thead>
          <tbody>
            {mockInventory.map((item, index) => {
              const isLowStock = item.currentQuantity < item.lowStockThreshold;
              const profitPerUnit = item.sellingPrice - item.costPrice;
              
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
                      <span className="font-medium text-card-foreground">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <span className={`font-bold text-lg ${isLowStock ? 'text-primary' : 'text-card-foreground'}`}>
                      {item.currentQuantity}
                    </span>
                  </td>
                  <td className="text-right py-4 px-2 text-card-foreground">
                    ${item.costPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-2 text-card-foreground">
                    ${item.sellingPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-2 font-bold text-primary">
                    ${profitPerUnit.toFixed(2)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
