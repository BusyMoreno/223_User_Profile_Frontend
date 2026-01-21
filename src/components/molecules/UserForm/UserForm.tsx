import { useFormik } from "formik";
import { User } from "../../../types/models/User.model";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

interface UserProps {
  user: User;
  submitActionHandler: (values: User) => void;
}

const UserForm = ({ user, submitActionHandler }: UserProps) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: user.id,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      roles: user?.roles ?? [],
      password: "",
      profile: {
        address: user.profile?.address ?? "",
        birthDate: user.profile?.birthDate ?? "",
        profileImageUrl: user.profile?.profileImageUrl ?? "",
      },
    },
    validationSchema: object({
      firstName: string().required().min(2).max(50),
      lastName: string().required().min(2).max(50),
      email: string().required().email(),
      profile: object({
        address: string().required().min(2).max(100),
        birthDate: string().required(),
        profileImageUrl: string().required().min(2).max(100),
      }),
      password: string().when("id", {
        is: (id: string) => !id,
        then: (schema) => schema.required().min(4),
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
      <Box sx={{ paddingTop: "15px" }}>
        <TextField
          id="firstName"
          name="firstName"
          label="Firstname"
          variant="outlined"
          sx={{ paddingRight: "10px" }}
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
          sx={{ paddingRight: "10px" }}
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
          name="profile.address"
          label="Address"
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.profile.address}
          error={Boolean(
            formik.touched.profile?.address && formik.errors.profile?.address
          )}
        />

        <TextField
          id="birthDate"
          name="profile.birthDate"
          label="Birth Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.profile.birthDate}
          error={Boolean(
            formik.touched.profile?.birthDate &&
              formik.errors.profile?.birthDate
          )}
        />

        <TextField
          id="profileImageUrl"
          name="profile.profileImageUrl"
          label="Profile Image URL"
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.profile.profileImageUrl}
          error={Boolean(
            formik.touched.profile?.profileImageUrl &&
              formik.errors.profile?.profileImageUrl
          )}
        />

        {!user.id && (
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            sx={{ paddingRight: "10px" }}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.password && formik.errors.password)}
            value={formik.values.password}
          />
        )}
      </Box>

      <div>
        <Button
          sx={{ marginTop: "15px", marginRight: "10px" }}
          variant="contained"
          color="success"
          type="submit"
          disabled={!(formik.dirty && formik.isValid)}
        >
          {user.id ? "Save" : "Add"}
        </Button>

        <Button
          sx={{ marginTop: "15px" }}
          variant="contained"
          color="error"
          onClick={() => navigate("/user")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
