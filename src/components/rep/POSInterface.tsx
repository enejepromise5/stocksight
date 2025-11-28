import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  itemName: string;
  quantity: number;
  price: number;
}

export const POSInterface = () => {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  const addToCart = () => {
    if (!itemName || !price) {
      toast.error('Please fill all fields');
      return;
    }

    setCart([...cart, { itemName, quantity, price: parseFloat(price) }]);
    setItemName('');
    setQuantity(1);
    setPrice('');
    toast.success('Item added to cart');
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const recordSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Simulate API call
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      toast.success('Sale recorded successfully!');
      setCart([]);
    }, 500);
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
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Unit</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="text-lg"
            />
          </div>

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
