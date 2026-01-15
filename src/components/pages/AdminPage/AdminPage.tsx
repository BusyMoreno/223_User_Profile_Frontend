import React, { useContext } from 'react';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';

const AdminPage = () => {
  const { checkRole } = useContext(ActiveUserContext);

  if (!checkRole('ADMIN')) {
    return (
      <div>
        <h1>403 - Forbidden</h1>
        <p>You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
};

export default AdminPage;