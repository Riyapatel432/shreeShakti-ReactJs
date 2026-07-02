import { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TableSortLabel, TextField, Box,
  InputAdornment, Button, Typography, Tooltip
} from '@mui/material';
import { Search as SearchIcon, FileDownload as ExportIcon, PictureAsPdf as PdfIcon, Add as AddIcon } from '@mui/icons-material';

export default function DataTable({
  title, columns, data, searchPlaceholder = 'Search...', onAddClick, addLabel = 'Add New', actions
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter(row =>
      Object.values(row).some(val => val !== null && val !== undefined && String(val).toLowerCase().includes(filterText.toLowerCase()))
    );
  }, [data, filterText]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[orderBy], bVal = b[orderBy];
      if (typeof aVal === 'number' && typeof bVal === 'number') return order === 'asc' ? aVal - bVal : bVal - aVal;
      const as = String(aVal ?? '').toLowerCase(), bs = String(bVal ?? '').toLowerCase();
      if (as < bs) return order === 'asc' ? -1 : 1;
      if (as > bs) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() =>
    sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  const exportToCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => `"${c.label}"`).join(',');
    const rows = data.map(row =>
      columns.map(col => {
        const val = col.render ? '' : row[col.id];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const uri = 'data:text/csv;charset=utf-8,' + encodeURI([headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', `${(title || 'export').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
      <Box sx={{
        p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' },
        gap: 2, borderBottom: '1px solid', borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{filteredData.length} records found</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" value={filterText} onChange={e => { setFilterText(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ width: { xs: '100%', sm: 220 } }}
          />
          <Tooltip title="Export to CSV">
            <Button size="small" variant="outlined" color="primary" onClick={exportToCSV} startIcon={<ExportIcon />} sx={{ height: 38 }}>
              Export CSV
            </Button>
          </Tooltip>
          <Tooltip title="Print / PDF">
            <Button size="small" variant="outlined" color="secondary" onClick={() => window.print()} startIcon={<PdfIcon />} sx={{ height: 38 }}>
              Print
            </Button>
          </Tooltip>
          {onAddClick && (
            <Button size="small" variant="contained" color="warning" onClick={onAddClick} startIcon={<AddIcon />} sx={{ height: 38 }}>
              {addLabel}
            </Button>
          )}
          {actions}
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id} align={col.align || 'left'} sx={{ width: col.width }}>
                  {col.sortable !== false ? (
                    <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : 'asc'} onClick={() => handleSort(col.id)}>
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No records found</Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.map((row, idx) => (
              <TableRow hover key={row.id ?? idx} sx={{ '&:nth-of-type(even)': { bgcolor: 'action.hover' } }}>
                {columns.map(col => (
                  <TableCell key={col.id} align={col.align || 'left'}>
                    {col.render ? col.render(row,idx) : row[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />
    </Paper>
  );
}
