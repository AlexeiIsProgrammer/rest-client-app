import React from 'react';

function Header({ children }: { children: React.ReactNode }): React.ReactElement {
  console.log('Header component rendering!');
  return (
    <header>
      Header1 {children}
    </header>
  );
};

export default Header;
