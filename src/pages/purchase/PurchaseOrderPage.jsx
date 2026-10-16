import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseOrders, deletePurchaseOrder, updatePurchaseOrderStatus } from "../../redux/slices/purchaseSlice";
import { fetchVendors } from "../../redux/slices/purchaseSlice";
import { getMaterials } from "../../redux/slices/materialSlice";
import DataTable from "../../components/common/DataTable";
import PurchaseOrderFormModal from "./PurchaseOrderFormModal";
import GoodsReceiptModal from "./GoodsReceiptModal";
import { Box, Typography, Breadcrumbs, Link, Tooltip, IconButton, Chip } from "@mui/material";
import { NavigateNext as NavIcon, Edit, Delete, CheckCircle, Inventory } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function PurchaseOrderPage() {
  const dispatch = useDispatch();
  const { purchaseOrders = [], loading = false } = useSelector((state) => state.purchase || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  
  const [grnModalOpen, setGrnModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
    dispatch(fetchVendors({ limit: 100 }));
    dispatch(getMaterials({ limit: 100 }));
  }, [dispatch]);

  const handleEdit = (po) => {
    if (["Partially Received", "Received"].includes(po.status)) {
      Swal.fire("Not Allowed", "Cannot edit a PO that has already been partially or fully received.", "error");
      return;
    }
    setSelectedPO(po);
    setModalOpen(true);
  };

  const handleReceiveGoods = (po) => {
    if (po.status === "Received" || po.status === "Cancelled") {
       Swal.fire("Not Allowed", `Cannot receive goods for a ${po.status} PO.`, "error");
       return;
    }
    if (po.status === "Draft") {
       Swal.fire("Not Allowed", "Cannot receive goods for a Draft PO. Please mark it as Sent first.", "error");
       return;
    }
    setSelectedPO(po);
    setGrnModalOpen(true);
  };

  const handleMarkSent = (id) => {
    Swal.fire({
      title: "Mark as Sent?",
      text: "This will approve and mark the PO as sent to the vendor.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Mark Sent"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updatePurchaseOrderStatus({ id, status: "Sent" })).then(() => {
           dispatch(fetchPurchaseOrders());
        });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePurchaseOrder(id));
      }
    });
  };

  const columns = [
    { id: "poNumber", label: "PO Number" },
    { id: "vendor", label: "Vendor", render: (row) => row.vendor?.company_name || "-" },
    { id: "orderDate", label: "Order Date", render: (row) => new Date(row.orderDate).toLocaleDateString() },
    { id: "grandTotal", label: "Total (₹)", render: (row) => `₹${row.grandTotal?.toFixed(2) || 0}` },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const color = row.status === "Received" ? "success" 
                    : row.status === "Partially Received" ? "warning"
                    : row.status === "Sent" ? "info"
                    : row.status === "Cancelled" ? "error" : "default";
        return <Chip label={row.status} size="small" color={color} variant="outlined" />;
      }
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <>
          {row.status === "Draft" && (
            <Tooltip title="Mark as Sent / Approve">
              <IconButton onClick={() => handleMarkSent(row._id)} color="success" size="small"><CheckCircle fontSize="small" /></IconButton>
            </Tooltip>
          )}
          {["Sent", "Partially Received"].includes(row.status) && (
             <Tooltip title="Receive Goods (GRN)">
               <IconButton onClick={() => handleReceiveGoods(row)} color="secondary" size="small"><Inventory fontSize="small" /></IconButton>
             </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small"><Edit fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(row._id)} color="error" size="small"><Delete fontSize="small" /></IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Purchase Orders</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Purchase</Link>
          <Typography color="warning.main">Orders</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="Purchase Orders"
        columns={columns}
        data={purchaseOrders || []}
        loading={loading}
        onAddClick={() => { setSelectedPO(null); setModalOpen(true); }}
        addLabel="New Purchase Order"
        hidePagination={true}
      />

      {modalOpen && (
        <PurchaseOrderFormModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); dispatch(fetchPurchaseOrders()); }}
          po={selectedPO}
        />
      )}

      {grnModalOpen && (
        <GoodsReceiptModal
          open={grnModalOpen}
          onClose={() => { setGrnModalOpen(false); dispatch(fetchPurchaseOrders()); }}
          po={selectedPO}
        />
      )}
    </Box>
  );
}
