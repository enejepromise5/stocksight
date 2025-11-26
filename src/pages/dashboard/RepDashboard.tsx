import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const RepDashboard = () => {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [todaySales, setTodaySales] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  const handleRecordSale = () => {
    if (!itemName || !quantity || !price) {
      toast.error('Please fill all fields');
      return;
    }

    const saleAmount = parseFloat(price) * parseInt(quantity);
    
    // Trigger lemon flash animation
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 500);

    // Update counter
    setTodaySales(prev => prev + saleAmount);
    
    toast.success('Sale recorded successfully!');
    
    // Clear form
    setItemName('');
    setQuantity('');
    setPrice('');
  };

  return (
    <div className="min-h-screen gradient-deep p-6">
      {/* Lemon Flash Overlay */}
      {showFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-primary z-50 pointer-events-none"
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">{t('pos.title')}</h1>
        </motion.div>

        {/* Sales Counter */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Card className="p-8 bg-secondary border-primary/20">
            <p className="text-sm text-foreground/70 mb-2">{t('pos.todaySales')}</p>
            <motion.div
              key={todaySales}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-primary flex items-center justify-center gap-2"
            >
              <DollarSign className="w-10 h-10" />
              {todaySales.toFixed(2)}
            </motion.div>
          </Card>
        </motion.div>

        {/* POS Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">{t('pos.itemName')}</Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">{t('pos.quantity')}</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t('pos.price')}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>

            {quantity && price && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-right text-2xl font-bold text-card-foreground"
              >
                {t('pos.total')}: ${(parseFloat(price) * parseInt(quantity || '0')).toFixed(2)}
              </motion.div>
            )}

            <Button
              onClick={handleRecordSale}
              className="w-full text-lg py-6"
              size="lg"
            >
              {t('pos.recordSale')}
            </Button>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="secondary"
            className="w-full"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t('pos.addStock')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RepDashboard;
