import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  Box,
  InputAdornment,
  Button,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
} from "@mui/icons-material";

export default function DataTable({
  title,
  columns,
  data = [],
  loading = false,

  // Backend pagination props
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  rowsPerPage = 10,

  onPageChange,
  onRowsPerPageChange,
  onSearch,

  searchPlaceholder = "Search...",
  onAddClick,
  addLabel = "Add New",
  actions,
}) {
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Sorting only on current page data
  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) return 0;

    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    const as = String(aVal ?? "").toLowerCase();
    const bs = String(bVal ?? "").toLowerCase();

    if (as < bs) return order === "asc" ? -1 : 1;
    if (as > bs) return order === "asc" ? 1 : -1;

    return 0;
  });

  const exportToCSV = () => {
    if (!data.length) return;

    const headers = columns.map((c) => `"${c.label}"`).join(",");

    const rows = data.map((row) =>
      columns
        .map((col) => {
          const val = col.render ? "" : row[col.id];
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const uri =
      "data:text/csv;charset=utf-8," +
      encodeURI([headers, ...rows].join("\n"));

    const link = document.createElement("a");

    link.setAttribute("href", uri);
    link.setAttribute(
      "download",
      `${(title || "export").replace(/\s+/g, "_")}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {totalRecords} records found
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
       

         <TextField
  size="small"
  placeholder={searchPlaceholder}
  onChange={(e) => onSearch?.(e.target.value)}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" />
        </InputAdornment>
      ),
    },
  }}
  sx={{
    width: { xs: "100%", sm: 220 },
  }}
/>

          {onAddClick && (
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={onAddClick}
              startIcon={<AddIcon />}
              sx={{ height: 38 }}
            >
              {addLabel}
            </Button>
          )}

          {actions}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{ width: col.width }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, idx) => (
                <TableRow
                  hover
                  key={row._id ?? idx}
                  sx={{
                    "&:nth-of-type(even)": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || "left"}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Backend Pagination */}
      <TablePagination
        component="div"
        count={totalRecords}
        page={currentPage - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onPageChange={(_, page) => {
          onPageChange?.(page + 1);
        }}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange?.(
            parseInt(e.target.value, 10)
          );
        }}
      />
    </Paper>
  );
}