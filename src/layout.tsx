import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div>
      <header>Header</header>
      <Outlet />
      <header>Footer</header>
    </div>
  );
};

export default Layout;
