import { Outlet } from 'react-router';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { VariablesProvider } from './context/VariablesContext';

const Layout = () => {
  return (
    <VariablesProvider>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </VariablesProvider>
  );
};

export default Layout;
