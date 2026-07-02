import { Card, CardContent, Typography, Grid, Box, useTheme } from '@mui/material';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {
  monthlyProductionData,
  materialConsumptionData,
  departmentEfficiencyData,
  purchaseCostData
} from '../../data/mockData';

export default function Charts() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipStyle = {
    backgroundColor: isDark ? '#111827' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '8px',
    fontSize: '0.8rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <Grid container spacing={3}>
      {/* Monthly Production Trend */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 380 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>Monthly Production Trend</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Completed works — Fabrication (MT), Piping (Spools), Machining (Parts)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProductionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Fabrication" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="Fabrication" />
                  <Line type="monotone" dataKey="Piping" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Piping Spools" />
                  <Line type="monotone" dataKey="Machining" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} name="Machining" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Purchase Cost Analysis */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 380 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>Purchase Cost Analysis</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Monthly procurement spend breakdown (₹ in Millions)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={purchaseCostData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRaw" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="RawMaterials" stackId="1" stroke="#3b82f6" fill="url(#gradRaw)" name="Raw Steel" />
                  <Area type="monotone" dataKey="Consumables" stackId="1" stroke="#f97316" fill="url(#gradCon)" name="Consumables" />
                  <Area type="monotone" dataKey="Services" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} name="Services" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Material Consumption Bar Chart */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: 360 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>Material Consumption</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Planned vs. Actual raw material consumption (MT)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialConsumptionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="planned" fill="#1e3a8a" radius={[4, 4, 0, 0]} name="Planned" />
                  <Bar dataKey="actual" fill="#f97316" radius={[4, 4, 0, 0]} name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Efficiency Pie */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: 360 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>Shop Floor Efficiency</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              OEE by manufacturing center (%)
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentEfficiencyData} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {departmentEfficiencyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
