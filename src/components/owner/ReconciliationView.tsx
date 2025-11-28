import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ReconciliationData {
  repName: string;
  totalSales: number;
  reportedCash: number;
  transactionCount: number;
}

const mockData: ReconciliationData = {
  repName: 'John Doe',
  totalSales: 450.00,
  reportedCash: 450.00,
  transactionCount: 12,
};

export const ReconciliationView = () => {
  const handleApprove = () => {
    toast.success('Reconciliation approved!');
  };

  const handleDispute = () => {
    toast.error('Reconciliation disputed - please review');
  };

  const isMatching = mockData.totalSales === mockData.reportedCash;

  return (
    <Card className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-card-foreground">Daily Reconciliation</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* System Data */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-card-foreground mb-4">System Records</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sales:</span>
              <span className="font-bold text-card-foreground">₦{mockData.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transactions:</span>
              <span className="font-bold text-card-foreground">{mockData.transactionCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Rep Data */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-card-foreground mb-4">Rep Report ({mockData.repName})</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reported Cash:</span>
              <span className="font-bold text-card-foreground">₦{mockData.reportedCash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Difference:</span>
              <span className={`font-bold ${isMatching ? 'text-primary' : 'text-destructive'}`}>
                ₦{Math.abs(mockData.totalSales - mockData.reportedCash).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <Button
          onClick={handleApprove}
          size="lg"
          className="flex-1 text-lg py-6"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Approve
        </Button>
        <Button
          onClick={handleDispute}
          size="lg"
          variant="destructive"
          className="flex-1 text-lg py-6"
        >
          <XCircle className="mr-2 h-5 w-5" />
          Dispute
        </Button>
      </motion.div>
    </Card>
  );
};
