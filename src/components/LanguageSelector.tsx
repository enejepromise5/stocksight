import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yoruba' }
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {languages.map((lang, index) => (
        <motion.div
          key={lang.code}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant={i18n.language === lang.code ? 'default' : 'secondary'}
            size="sm"
            onClick={() => i18n.changeLanguage(lang.code)}
            className="min-w-[90px]"
          >
            {lang.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
