import { Outlet } from 'react-router';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
// import { useI18nHTMLAttributes } from './hooks/useI18nHTMLAttributes';
import { IntlayerProvider } from 'react-intlayer';

const Layout = () => {
  return (
    <IntlayerProvider>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </IntlayerProvider>
  );
};

export default Layout;
