import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate signup
    setTimeout(() => {
      toast.success('Account created successfully!');
      navigate('/dashboard/owner');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-deep flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20
          }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center mb-2">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-card-foreground">
                {t('auth.signup')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('auth.ownerOnly')}
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">{t('auth.shopName')}</Label>
                <Input
                  id="shopName"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating...' : t('auth.signup')}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.haveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                {t('auth.login')}
              </button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Signup;
