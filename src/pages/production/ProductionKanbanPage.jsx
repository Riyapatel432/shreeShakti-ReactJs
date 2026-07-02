import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Paper, Grid } from '@mui/material';
import { NavigateNext as NavIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { updateTaskStage } from '../../redux/slices/erpSlice';

const STAGES = ['Drawing Review', 'Cutting', 'Fitting', 'Welding', 'Assembly', 'Packing'];

const priorityColors = { High: 'error', Medium: 'warning', Low: 'success' };

export default function ProductionKanbanPage() {
  const dispatch = useDispatch();
  const tasks = useSelector(s => s.erp.productionTasks);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (task) => setDragging(task);

  const handleDrop = (newStage) => {
    if (dragging && dragging.stage !== newStage) {
      dispatch(updateTaskStage({ taskId: dragging.id, newStage }));
    }
    setDragging(null);
  };

  const tasksByStage = (stage) => tasks.filter(t => t.stage === stage);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Production Workflow (Kanban)</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Production Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Drawing Wise Planning</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Grid container spacing={2} sx={{ minWidth: 900, flexWrap: 'nowrap' }}>
          {STAGES.map((stage) => (
            <Grid item key={stage} sx={{ minWidth: 220, flex: 1 }}>
              <Box
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage)}
                sx={{
                  height: '100%',
                  minHeight: 400,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: '2px dashed',
                  borderColor: dragging ? 'primary.main' : 'divider',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Column header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                    {stage}
                  </Typography>
                  <Chip label={tasksByStage(stage).length} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                </Box>

                {/* Task cards */}
                {tasksByStage(stage).map((task) => (
                  <Paper
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    elevation={2}
                    sx={{
                      p: 1.5, mb: 1.5, cursor: 'grab', borderRadius: 2,
                      userSelect: 'none',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:active': { cursor: 'grabbing' },
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 4, transition: 'all 0.2s ease' },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{task.id}</Typography>
                      <Chip label={task.priority} size="small" color={priorityColors[task.priority]} sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.8rem', lineHeight: 1.3, mb: 1 }}>
                      {task.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem', mb: 0.5 }}>
                      📐 {task.drawingNo}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ fontSize: '0.7rem' }}>
                        👷 {task.assignedTo}
                      </Typography>
                      <DragIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    </Box>
                  </Paper>
                ))}

                {tasksByStage(stage).length === 0 && (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.disabled">Drop tasks here</Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
