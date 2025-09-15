import { Outlet } from 'react-router';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { useI18nHTMLAttributes } from './hooks/useI18nHTMLAttributes';
import { IntlayerProvider } from 'react-intlayer';
import { configuration } from 'intlayer';
import type { Route } from './+types/layout';
import { VariablesProvider } from './context/VariablesContext';

const Layout = ({ params }: Route.ComponentProps) => {
  useI18nHTMLAttributes();

  return (
    <IntlayerProvider
      locale={params.locale ?? configuration.internationalization.defaultLocale}
    >
      <VariablesProvider>
        <div>
          <Header />
          <Outlet />
          <Footer />
        </div>
      </VariablesProvider>
    </IntlayerProvider>
  );
};

export default Layout;
