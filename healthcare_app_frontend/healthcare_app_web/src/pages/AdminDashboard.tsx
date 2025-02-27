import React from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { Typography, Paper, Grid, Card, CardContent } from "@mui/material";

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Users
              </Typography>
              <Typography variant="h3">1,245</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Active Doctors
              </Typography>
              <Typography variant="h3">48</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Today's Appointments
              </Typography>
              <Typography variant="h3">156</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Activity content would go here */}
            <Typography paragraph>
              Recent system activities and logs would be displayed here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
