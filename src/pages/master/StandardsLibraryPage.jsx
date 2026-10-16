import React, { useState } from "react";
import { Box, Typography, Breadcrumbs, Link, Tabs, Tab } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';

import NBSizesTab from "./standards/NBSizesTab";
import PipeSchedulesTab from "./standards/PipeSchedulesTab";
import TubeODsTab from "./standards/TubeODsTab";
import FlangeRatingsTab from "./standards/FlangeRatingsTab";

export default function StandardsLibraryPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Standards Library</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Standards</Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="standards library tabs">
          <Tab label="NB Sizes" />
          <Tab label="Pipe Schedules" />
          <Tab label="Tube ODs" />
          <Tab label="Flange Ratings" />
        </Tabs>
      </Box>

      {tabIndex === 0 && <NBSizesTab />}
      {tabIndex === 1 && <PipeSchedulesTab />}
      {tabIndex === 2 && <TubeODsTab />}
      {tabIndex === 3 && <FlangeRatingsTab />}
    </Box>
  );
}
