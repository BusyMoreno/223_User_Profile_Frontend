import { useFormik } from 'formik';
import { User } from '../../../types/models/User.model';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

interface UserProps {
  user: User;
  submitActionHandler: (values: User) => void;
}

const UserForm = ({ user, submitActionHandler }: UserProps) => {
  const navigate = useNavigate();

const formik = useFormik({
  initialValues: {
    id: user.id,
    lastName: user?.lastName ?? '',
    firstName: user?.firstName ?? '',
    email: user?.email ?? '',
    roles: user?.roles ?? [],
    address: user?.address ?? '',
    birthDate: user?.birthDate ?? '',
    profileImageUrl: user?.profileImageUrl ?? '',
    password: '',
  },

  validationSchema: object({
  firstName: string().required().min(2).max(50),
  lastName: string().required().min(2).max(50),
  email: string().required().email(),
  address: string().required().min(2).max(100),
  birthDate: string().required(),
  profileImageUrl: string().required().min(2).max(100),
  password: string().when('id', {
    is: (id: string) => !id,
    then: schema => schema.required().min(4),
  }),
}),

  onSubmit: async (values, { setErrors }) => {
    try {
      await submitActionHandler(values);
    } catch (backendErrors: any) {
      setErrors(backendErrors);
    }
  },

  enableReinitialize: true,
});

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ paddingTop: '15px' }}>
        <TextField
          id="firstName"
          name="firstName"
          label="Firstname"
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.firstName && formik.errors.firstName)}
          value={formik.values.firstName}
        />

        <TextField
          id="lastName"
          name="lastName"
          label="Lastname"
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.lastName && formik.errors.lastName)}
          value={formik.values.lastName}
        />

        <TextField
          id="email"
          name="email"
          label="E-Mail"
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          value={formik.values.email}
        />

        <TextField
          id="address"
          name="address"
          label="Address"
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.address && formik.errors.address)}
          value={formik.values.address}
        />

        <TextField
          id="birthDate"
          name="birthDate"
          label="Birth Date"
          type='date'
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          InputLabelProps={{ shrink:true}}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.birthDate && formik.errors.birthDate)}
          helperText={formik.touched.birthDate && formik.errors.birthDate}
          value={formik.values.birthDate}
        />

        <TextField
          id="profileImageUrl"
          name="profileImageUrl"
          label="Profile Image URL"
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(
            formik.touched.profileImageUrl && formik.errors.profileImageUrl
          )}
          helperText={formik.touched.profileImageUrl && formik.errors.profileImageUrl}
          value={formik.values.profileImageUrl}
        />

      {!user.id && (
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          sx={{ paddingRight: '10px' }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.password && formik.errors.password)}
          value={formik.values.password}
        />
      )}
      </Box>

      <div>
        <Button
          sx={{ marginTop: '15px', marginRight: '10px' }}
          variant="contained"
          color="success"
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
        >
          {user.id ? 'Save' : 'Add'}
        </Button>

        <Button
          sx={{ marginTop: '15px' }}
          variant="contained"
          color="error"
          onClick={() => navigate('/user')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
