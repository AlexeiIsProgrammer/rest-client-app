import { Outlet } from 'react-router';
import { logout } from './firebase';

const Layout = () => {
  return (
    <div>
      <header>
        Header
        <button onClick={() => logout()}>Logout</button>
      </header>
      <Outlet />
      <header>Footer</header>
    </div>
  );
};

export default Layout;
