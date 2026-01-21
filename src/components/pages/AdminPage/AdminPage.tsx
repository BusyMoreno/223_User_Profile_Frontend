import React, { useContext, useEffect, useState } from 'react';
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
<<<<<<< Updated upstream
} from '@mui/material';
=======
  TextField as MuiTextField,
} from "@mui/material";
>>>>>>> Stashed changes
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';
import UserService from '../../../Services/UserService';
import RoleService from '../../../Services/RoleService';
import { User } from '../../../types/models/User.model';
import { Role } from '../../../types/models/Role.model';

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
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

<<<<<<< Updated upstream
  if (!checkRole('ADMIN')) {
=======
  // Edit user form state
  const [editUserForm, setEditUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    birthDate: "",
  });

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    page: 0,
    size: 10,
  });

  if (!checkRole("ADMIN")) {
>>>>>>> Stashed changes
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
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
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load users first
      const usersResponse = await UserService.getAllUsers();
      setUsers(usersResponse.data);

      // Try to load roles from API, fallback to extracting from users if endpoint doesn't exist
      try {
        const rolesResponse = await RoleService.findAll();
        setRoles(rolesResponse.data);
      } catch (rolesError: any) {
        // If /roles endpoint doesn't exist (404), extract unique roles from users
        if (rolesError.response?.status === 404 || rolesError.message?.includes('404')) {
          const uniqueRolesMap = new Map<string, Role>();
          usersResponse.data.forEach((user: User) => {
            user.roles.forEach((role: Role) => {
              if (!uniqueRolesMap.has(role.id)) {
                uniqueRolesMap.set(role.id, role);
              }
            });
          });
          setRoles(Array.from(uniqueRolesMap.values()));
          console.warn('Roles endpoint not found, using roles from user data');
        } else {
          throw rolesError;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Error loading admin data:', err);
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

  const handleOpenEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((role) => role.id));
    setEditUserForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.profile?.address || "",
      birthDate: user.profile?.birthDate || "",
    });
    setEditUserDialogOpen(true);
  };

  const handleCloseEditUserDialog = () => {
    setEditUserDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
    setEditUserForm({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      birthDate: "",
    });
  };

  const handleEditUserFormChange = (field: string, value: string) => {
    setEditUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEditUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRoles = roles.filter((role) =>
        selectedRoles.includes(role.id),
      );
      const updatedUser: User = {
        ...selectedUser,
        firstName: editUserForm.firstName,
        lastName: editUserForm.lastName,
        email: editUserForm.email,
        roles: updatedRoles,
        profile: {
          ...selectedUser.profile,
          address: editUserForm.address,
          birthDate: editUserForm.birthDate,
        },
      };

      await UserService.updateUser(updatedUser);
      setSuccess("User updated successfully");
      await loadData();
      handleCloseEditUserDialog();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
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
      setSuccess('Roles updated successfully');
      await loadData();
      handleCloseRoleDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to update roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await UserService.deleteUser(userId);
      setSuccess('User deleted successfully');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
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

      <Paper sx={{ width: '100%' }}>
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
                          onClick={() => handleOpenEditUserDialog(user)}
                          title="Edit User"
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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
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
                      {role.authorities.map((a) => a.name).join(', ') || 'No authorities'}
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

      {/* Edit User Dialog */}
      <Dialog
        open={editUserDialogOpen}
        onClose={handleCloseEditUserDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit User: {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <MuiTextField
                  sx={{ flex: '1 1 200px' }}
                  label="First Name"
                  value={editUserForm.firstName}
                  onChange={(e) => handleEditUserFormChange("firstName", e.target.value)}
                  required
                />
                <MuiTextField
                  sx={{ flex: '1 1 200px' }}
                  label="Last Name"
                  value={editUserForm.lastName}
                  onChange={(e) => handleEditUserFormChange("lastName", e.target.value)}
                  required
                />
              </Box>
              <MuiTextField
                fullWidth
                label="Email"
                type="email"
                value={editUserForm.email}
                onChange={(e) => handleEditUserFormChange("email", e.target.value)}
                required
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <MuiTextField
                fullWidth
                label="Address"
                value={editUserForm.address}
                onChange={(e) => handleEditUserFormChange("address", e.target.value)}
                multiline
                rows={2}
              />
              <MuiTextField
                sx={{ maxWidth: '300px' }}
                label="Birth Date"
                type="date"
                value={editUserForm.birthDate}
                onChange={(e) => handleEditUserFormChange("birthDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Roles
            </Typography>
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
                        {role.authorities?.map((a) => a.name).join(", ") ||
                          "No authorities"}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditUserDialog}>Cancel</Button>
          <Button
            onClick={handleSaveEditUser}
            variant="contained"
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;