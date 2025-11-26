import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // Mock role-based routing
      const mockRole = email.includes('owner') ? 'OWNER' : 'SALES_REP';
      
      toast.success('Login successful!');
      
      if (mockRole === 'OWNER') {
        navigate('/dashboard/owner');
      } else {
        navigate('/dashboard/rep');
      }
      
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
              <h2 className="text-3xl font-bold text-card-foreground">
                {t('auth.login')}
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                  className="focus:ring-primary focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Loading...' : t('auth.login')}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
              >
                {t('welcome.signUp')}
              </button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
