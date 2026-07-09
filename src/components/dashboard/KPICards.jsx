import { useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
  Assignment as ProjectIcon,
  ShoppingCart as POIcon,
  Inventory as StockIcon,
  FactCheck as QCIcon,
  TrendingUp as RevenueIcon,
  People as AttendanceIcon,
  AccessTime as PendingIcon,
  PrecisionManufacturing as ProductionIcon
} from '@mui/icons-material';

export default function KPICards() {
  const { projects, purchaseOrders, materials, qcInspections } = useSelector(state => state.erp);

  const totalProjects = projects.length;
  const activePOs = purchaseOrders.filter(po => po.status === 'Released' || po.status === 'Pending Delivery').length;
  const totalStockMT = materials.filter(m => m.uom === 'MT').reduce((acc, curr) => acc + curr.stock, 0).toFixed(1);
  const pendingQC = qcInspections.filter(qc => qc.status === 'Pending').length;
  const activeProjs = projects.filter(p => p.status === 'In Progress');
  const avgProgress = activeProjs.length > 0
    ? Math.round(activeProjs.reduce((acc, p) => acc + p.progress, 0) / activeProjs.length)
    : 0;
  const pendingApprovals = purchaseOrders.filter(po => po.approvalStatus.startsWith('Pending')).length;

  const cardData = [
    {
      title: 'Total Projects',
      value: totalProjects,
      subtitle: `${projects.filter(p => p.status === 'In Progress').length} Active execution`,
      icon: <ProjectIcon sx={{ fontSize: 28, color: '#3b82f6' }} />,
      accentColor: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.12)',
      borderColor: 'rgba(59, 130, 246, 0.2)'
    },
    {
      title: 'Active Purchase Orders',
      value: activePOs,
      subtitle: `${purchaseOrders.filter(po => po.status === 'Pending Delivery').length} Awaiting shipment`,
      icon: <POIcon sx={{ fontSize: 28, color: '#10b981' }} />,
      accentColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.2)'
    },
    {
      title: 'Material In Stock (Steel)',
      value: `${totalStockMT} MT`,
      subtitle: `${materials.filter(m => m.stock < m.minStock).length} below safety limit`,
      icon: <StockIcon sx={{ fontSize: 28, color: '#a855f7' }} />,
      accentColor: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.12)',
      borderColor: 'rgba(168, 85, 247, 0.2)'
    },
    {
      title: 'Pending QC Items',
      value: pendingQC,
      subtitle: `${qcInspections.filter(qc => qc.status === 'Rejected').length} NCRs logged this month`,
      icon: <QCIcon sx={{ fontSize: 28, color: '#ef4444' }} />,
      accentColor: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.2)'
    },
    {
      title: 'Production Completion',
      value: `${avgProgress}%`,
      subtitle: 'Average shop floor progress',
      icon: <ProductionIcon sx={{ fontSize: 28, color: '#f97316' }} />,
      accentColor: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(249, 115, 22, 0.2)'
    },
    {
      title: 'Monthly Billable Revenue',
      value: '₹ 1.84 Cr',
      subtitle: '+8.4% vs previous month',
      icon: <RevenueIcon sx={{ fontSize: 28, color: '#06b6d4' }} />,
      accentColor: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.12)',
      borderColor: 'rgba(6, 182, 212, 0.2)'
    },
    {
      title: 'Employee Attendance',
      value: '95.6%',
      subtitle: 'Daily average presence',
      icon: <AttendanceIcon sx={{ fontSize: 28, color: '#84cc16' }} />,
      accentColor: '#84cc16',
      bgColor: 'rgba(132, 204, 22, 0.12)',
      borderColor: 'rgba(132, 204, 22, 0.2)'
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      subtitle: 'Requires management action',
      icon: <PendingIcon sx={{ fontSize: 28, color: '#facc15' }} />,
      accentColor: '#facc15',
      bgColor: 'rgba(250, 204, 21, 0.12)',
      borderColor: 'rgba(250, 204, 21, 0.2)'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card
            sx={{
              height: '100%',
              border: `1px solid ${card.borderColor}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: card.accentColor,
              }
            }}
          >
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing="0.5px">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: '-0.5px' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: card.bgColor, width: 48, height: 48, borderRadius: '12px' }}>
                  {card.icon}
                </Avatar>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
