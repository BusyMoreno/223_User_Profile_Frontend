import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { User } from '../../../types/models/User.model';
import UserService from '../../../Services/UserService';
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    UserService.getAllUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  const handleAdd = () => {
    navigate('../user/edit/');
  };

  const handleEdit = (id: string) => {
    navigate('../user/edit/' + id);
  };

  const handleDelete = async (id: string) => {
    await UserService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <>
      {users.map((user) => (
        <Card key={user.id} sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* ✅ PROFILE IMAGE */}
              <Avatar
                src={
                  user.profileImageUrl &&
                  user.profileImageUrl.startsWith('http')
                    ? user.profileImageUrl
                    : undefined
                }
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 64, height: 64 }}
              />

              {/* USER DATA */}
              <Stack>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="body2">{user.address}</Typography>
                <Typography variant="body2">
                  {user.birthDate}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>

          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEdit(user.id)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}

      <Button
        size="small"
        color="success"
        variant="contained"
        onClick={handleAdd}
      >
        Add
      </Button>
    </>
  );
};

export default UserTable;