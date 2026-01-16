import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";
import UserService from "../../../Services/UserService";
import RoleService from "../../../Services/RoleService";
import { User } from "../../../types/models/User.model";
import { Role } from "../../../types/models/Role.model";
import TextField from "@mui/material/TextField";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage = () => {
  const { checkRole } = useContext(ActiveUserContext);
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    page: 0,
    size: 10,
  });

  if (!checkRole("ADMIN")) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          p: 3,
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          403 - Forbidden
        </Typography>
        <Typography variant="body1">
          You do not have access to this page.
        </Typography>
      </Box>
    );
  }

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasFilters =
        filters.firstName ||
        filters.lastName ||
        filters.minAge !== undefined ||
        filters.maxAge !== undefined;

      const usersResponse = hasFilters
        ? await UserService.getFilteredUsers({
            firstName: filters.firstName || undefined,
            lastName: filters.lastName || undefined,
            minAge: filters.minAge,
            maxAge: filters.maxAge,
          })
        : await UserService.getAllUsers();

      setUsers(usersResponse.data);

      try {
        const rolesResponse = await RoleService.findAll();
        setRoles(rolesResponse.data);
      } catch (rolesError: any) {
        if (
          rolesError.response?.status === 404 ||
          rolesError.message?.includes("404")
        ) {
          const uniqueRolesMap = new Map<string, Role>();
          usersResponse.data.forEach((user: User) => {
            user.roles.forEach((role: Role) => {
              if (!uniqueRolesMap.has(role.id)) {
                uniqueRolesMap.set(role.id, role);
              }
            });
          });
          setRoles(Array.from(uniqueRolesMap.values()));
        } else {
          throw rolesError;
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((role) => role.id));
    setRoleDialogOpen(true);
  };

  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRoles = roles.filter((role) =>
        selectedRoles.includes(role.id)
      );
      const updatedUser: User = {
        ...selectedUser,
        roles: updatedRoles,
      };

      await UserService.updateUser(updatedUser);
      setSuccess("Roles updated successfully");
      await loadData();
      handleCloseRoleDialog();
    } catch (err: any) {
      setError(err.message || "Failed to update roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await UserService.deleteUser(userId);
      setSuccess("User deleted successfully");
      await loadData();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
        >
          <Tab label="User Management" />
          <Tab label="Role Management" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="First name"
              value={filters.firstName}
              onChange={(e) =>
                setFilters({ ...filters, firstName: e.target.value })
              }
            />

            <TextField
              label="Last name"
              value={filters.lastName}
              onChange={(e) =>
                setFilters({ ...filters, lastName: e.target.value })
              }
            />

            <TextField
              label="Min age"
              type="number"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minAge: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />

            <TextField
              label="Max age"
              type="number"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxAge: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {user.roles.map((role) => (
                            <Chip
                              key={role.id}
                              label={role.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {user.roles.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No roles
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenRoleDialog(user)}
                          title="Edit Roles"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete User"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Role Management
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Role Name</TableCell>
                    <TableCell>Authorities</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Chip
                          label={role.name}
                          color="primary"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {role.authorities.map((authority) => (
                            <Chip
                              key={authority.id}
                              label={authority.name}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                          {role.authorities.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No authorities
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Role Assignment Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={handleCloseRoleDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Assign Roles to {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            {roles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">{role.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {role.authorities.map((a) => a.name).join(", ") ||
                        "No authorities"}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button
            onClick={handleSaveRoles}
            variant="contained"
            disabled={loading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
