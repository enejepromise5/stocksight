import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Package } from 'lucide-react';

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1] as any
      }
    }
  };

  return (
    <div className="min-h-screen gradient-deep flex flex-col items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full space-y-12 text-center"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px hsl(63 100% 50% / 0.3)',
                  '0 0 40px hsl(63 100% 50% / 0.6)',
                  '0 0 20px hsl(63 100% 50% / 0.3)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="rounded-full p-6 bg-primary/10"
            >
              <Package className="w-20 h-20 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            {t('welcome.title')}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 max-w-xl mx-auto leading-relaxed">
            {t('welcome.tagline')}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <LanguageSelector />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        >
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="text-lg px-8 py-6"
          >
            {t('welcome.signIn')}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="text-lg px-8 py-6"
          >
            {t('welcome.signUp')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
