import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Package } from 'lucide-react';
import { POSInterface } from '@/components/rep/POSInterface';
import { SalesLog } from '@/components/rep/SalesLog';
import { SlideOverPanel } from '@/components/SlideOverPanel';
import { AddStockPanel } from '@/components/rep/AddStockPanel';

const RepDashboard = () => {
  const { t } = useTranslation();
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  return (
    <div className="min-h-screen gradient-deep p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sales Dashboard</h1>
            <p className="text-foreground/70">Record your sales quickly and easily</p>
          </div>
          <Button
            onClick={() => setIsAddStockOpen(true)}
            size="lg"
            className="hidden sm:flex"
          >
            <Package className="mr-2 h-5 w-5" />
            Add Stock
          </Button>
        </motion.div>

        {/* Live Sales Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-6 sm:p-8 text-center bg-gradient-to-br from-card to-card/80">
            <div className="flex justify-center mb-4">
              <DollarSign className="w-12 h-12 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Today's Total Sales</p>
            <p className="text-5xl sm:text-6xl font-bold text-primary">#0.00</p>
          </Card>
        </motion.div>

        {/* Mobile Add Stock Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sm:hidden"
        >
          <Button
            onClick={() => setIsAddStockOpen(true)}
            size="lg"
            className="w-full"
          >
            <Package className="mr-2 h-5 w-5" />
            Add Stock
          </Button>
        </motion.div>

        {/* POS Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <POSInterface />
        </motion.div>

        {/* Sales Log - Read Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SalesLog />
        </motion.div>
      </div>

      {/* Add Stock Slide-Over Panel */}
      <SlideOverPanel
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        title="Add Stock"
      >
        <AddStockPanel onClose={() => setIsAddStockOpen(false)} />
      </SlideOverPanel>
    </div>
  );
};

export default RepDashboard;
