import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTechSpecs, deleteTechSpec } from "../../redux/slices/techSpecSlice";
import DataTable from "../../components/common/DataTable";
import TechSpecFormModal from "./TechSpecFormModal";
import TechSpecPreviewModal from "./TechSpecPreviewModal";
import SelectCostingSheetModal from "./SelectCostingSheetModal";
import { Box, Typography, Breadcrumbs, Link, Tooltip, IconButton, Chip } from "@mui/material";
import { NavigateNext as NavIcon, Edit, Delete, Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function TechSpecPage() {
  const dispatch = useDispatch();
  const { techSpecs = [], loading = false } = useSelector((state) => state.techSpecs || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectSheetModalOpen, setSelectSheetModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);

  useEffect(() => {
    dispatch(fetchTechSpecs());
  }, [dispatch]);

  const handleEdit = (spec) => {
    setSelectedSpec(spec);
    setModalOpen(true);
  };

  const handlePreview = (spec) => {
    setSelectedSpec(spec);
    setPreviewOpen(true);
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
        dispatch(deleteTechSpec(id));
      }
    });
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => index + 1 },
    { id: "client", label: "Client", render: (row) => row.client?.company_name || "-" },
    { id: "project", label: "Project", render: (row) => row.project?.projectName || "-" },
    { id: "product_category", label: "Category" },
    { id: "revisionNumber", label: "Rev.", render: (row) => `R${row.revisionNumber}` },
    {
      id: "status",
      label: "Status",
      render: (row) => {
        const color = row.status === "Issued" ? "success" : row.status === "Superseded" ? "error" : "default";
        return <Chip label={row.status} size="small" color={color} variant="outlined" />;
      }
    },
    { id: "createdAt", label: "Date", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <Tooltip title="Preview Spec">
            <IconButton onClick={() => handlePreview(row)} color="info" size="small"><Visibility fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Edit / Revise">
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
        <Typography variant="h4" fontWeight={800}>Technical Specifications</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Sales</Link>
          <Typography color="warning.main">Tech Specs</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="Technical Specifications"
        columns={columns}
        data={techSpecs || []}
        loading={loading}
        onAddClick={() => setSelectSheetModalOpen(true)}
        addLabel="New Tech Spec"
      />

      {selectSheetModalOpen && (
        <SelectCostingSheetModal
          open={selectSheetModalOpen}
          onClose={() => setSelectSheetModalOpen(false)}
          onGenerated={(newSpec) => {
            // Automatically open the edit modal for the newly generated spec
            setSelectedSpec(newSpec);
            setModalOpen(true);
          }}
        />
      )}

      {modalOpen && (
        <TechSpecFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          spec={selectedSpec}
        />
      )}

      {previewOpen && (
        <TechSpecPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          spec={selectedSpec}
        />
      )}
    </Box>
  );
}
