import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, AlertCircle, Package } from 'lucide-react';

const OwnerDashboard = () => {
  const { t } = useTranslation();

  const kpiData = [
    {
      title: t('owner.totalSales'),
      value: '$12,450',
      icon: DollarSign,
      trend: '+12%'
    },
    {
      title: t('owner.expectedCash'),
      value: '$11,200',
      icon: Package,
      trend: '+8%'
    },
    {
      title: t('owner.profit'),
      value: '$3,890',
      icon: TrendingUp,
      trend: '+15%'
    },
    {
      title: t('owner.lowStock'),
      value: '5 items',
      icon: AlertCircle,
      trend: 'warning'
    }
  ];

  return (
    <div className="min-h-screen gradient-deep p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-foreground/70">Welcome back! Here's what's happening today.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    kpi.trend === 'warning' 
                      ? 'bg-warning/20' 
                      : 'bg-primary/20'
                  }`}>
                    <kpi.icon className={`w-6 h-6 ${
                      kpi.trend === 'warning' 
                        ? 'text-warning' 
                        : 'text-primary'
                    }`} />
                  </div>
                  {kpi.trend !== 'warning' && (
                    <span className="text-sm text-green-600 font-medium">
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-card-foreground">{kpi.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="font-medium text-card-foreground">Sale Recorded</p>
                  <p className="text-sm text-muted-foreground">Rice Bag x 3</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$45.00</p>
                  <p className="text-xs text-muted-foreground">2 min ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="font-medium text-card-foreground">Sale Recorded</p>
                  <p className="text-sm text-muted-foreground">Cooking Oil x 2</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">$28.00</p>
                  <p className="text-xs text-muted-foreground">15 min ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-card-foreground">Stock Added</p>
                  <p className="text-sm text-muted-foreground">Beans x 50</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-muted-foreground">+50 units</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
