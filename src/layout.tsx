import { Outlet } from 'react-router';
import { logout } from './firebase';
import Header from './components/header/Header';

const Layout = () => {
  return (
    <div>
      <Header>
        <button onClick={() => logout()}>Logout</button>
      </Header>
      <Outlet />
      <header>Footer</header>
    </div>
  );
};

export default Layout;
