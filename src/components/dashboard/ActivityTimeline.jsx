import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import {
  ShoppingCart as PurchaseIcon, Inventory as StockIcon, FactCheck as QCIcon,
  PrecisionManufacturing as ProductionIcon, Storage as MasterIcon, AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const moduleIcon = (module) => {
  switch (module) {
    case 'Purchase': return <PurchaseIcon sx={{ fontSize: 16, color: '#10b981' }} />;
    case 'Inventory': return <StockIcon sx={{ fontSize: 16, color: '#a855f7' }} />;
    case 'Quality Control': return <QCIcon sx={{ fontSize: 16, color: '#ef4444' }} />;
    case 'Production': return <ProductionIcon sx={{ fontSize: 16, color: '#f97316' }} />;
    case 'Master': return <MasterIcon sx={{ fontSize: 16, color: '#3b82f6' }} />;
    default: return <AdminIcon sx={{ fontSize: 16, color: '#94a3b8' }} />;
  }
};

const moduleBg = (module) => {
  const map = {
    Purchase: 'rgba(16,185,129,0.12)', Inventory: 'rgba(168,85,247,0.12)',
    'Quality Control': 'rgba(239,68,68,0.12)', Production: 'rgba(249,115,22,0.12)',
    Master: 'rgba(59,130,246,0.12)'
  };
  return map[module] || 'rgba(148,163,184,0.12)';
};

export default function ActivityTimeline() {
  const auditLogs = useSelector(s => s.erp.auditLogs);

  return (
    <Card sx={{ height: '100%', maxHeight: 420 }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2.5 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>Real-time Activity Log</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Live audit trail from shop floor & office operations
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 0.5 }}>
          {auditLogs.map((log, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 2.5, position: 'relative',
              '&:not(:last-child)::after': {
                content: '""', position: 'absolute', left: 17, top: 36, bottom: -20,
                width: '2px', backgroundColor: 'divider'
              }
            }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: moduleBg(log.module), border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                {moduleIcon(log.module)}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {log.user.split('@')[0]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                    {String(log.timestamp).split(' ')[1] || log.timestamp}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.82rem', mt: 0.3 }}>
                  {log.action}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                  <Typography variant="caption" sx={{
                    px: 1, py: 0.2, borderRadius: '4px', bgcolor: moduleBg(log.module),
                    color: 'text.secondary', fontSize: '0.65rem', fontWeight: 700
                  }}>
                    {log.module?.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                    IP: {log.ipAddress}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
