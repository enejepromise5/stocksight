import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, AlertCircle, Package, Users, FileCheck } from 'lucide-react';
import { InventoryTable } from '@/components/owner/InventoryTable';
import { ReconciliationView } from '@/components/owner/ReconciliationView';
import { StaffManagement } from '@/components/owner/StaffManagement';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();

    // Set up realtime subscription for sales
    const channel = supabase
      .channel('owner-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: salesData } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('shop_id', user.id)
      .gte('created_at', today.toISOString());

    if (salesData) {
      const total = salesData.reduce((sum, sale) => sum + parseFloat(sale.total_amount.toString()), 0);
      setTotalSales(total);
      // For simplicity, profit is 30% of sales (you can adjust this)
      setTotalProfit(total * 0.3);
    }

    // Fetch low stock items (quantity < 10)
    const { data: inventoryData } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('shop_id', user.id)
      .lt('quantity', 10);

    if (inventoryData) {
      setLowStockCount(inventoryData.length);
    }
  };

  const kpiData = [
    {
      title: t('owner.totalSales'),
      value: `#${totalSales.toFixed(2)}`,
      icon: DollarSign,
      trend: '+0%'
    },
    {
      title: t('owner.expectedCash'),
      value: `#${totalSales.toFixed(2)}`,
      icon: Package,
      trend: '+0%'
    },
    {
      title: t('owner.profit'),
      value: `#${totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      trend: '+0%'
    },
    {
      title: t('owner.lowStock'),
      value: `${lowStockCount} items`,
      icon: AlertCircle,
      trend: 'warning'
    }
  ];

  return (
    <div className="min-h-screen gradient-deep p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-foreground/70">Welcome back! Here's what's happening today.</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow animate-pulse-lemon">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${
                    kpi.trend === 'warning' 
                      ? 'bg-warning/20' 
                      : 'bg-primary/20'
                  }`}>
                    <kpi.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      kpi.trend === 'warning' 
                        ? 'text-warning' 
                        : 'text-primary'
                    }`} />
                  </div>
                  {kpi.trend !== 'warning' && (
                    <span className="text-xs sm:text-sm text-green-600 font-medium">
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-card-foreground">{kpi.value}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">Recent Activity</h2>
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No activity yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Recent sales and inventory updates will appear here.</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <InventoryTable />
            </TabsContent>

            <TabsContent value="reconciliation">
              <ReconciliationView />
            </TabsContent>

            <TabsContent value="staff">
              <StaffManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
