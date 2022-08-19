/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href={'/'} className="items">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link href={'/'} className="items">
          <a className="item">Campaigns</a>
        </Link>

        <Link href={'/campaigns/new'} className="items">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export { Header };
