import React from 'react';
import { Link, history } from 'umi';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import LogoHome from '@/assets/logo_home.png';
import styles from './header.less';

export const BasicHeader = () => {
  return (
    <div className={styles.basicHeader}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={LogoHome} alt="link to home" />
        </Link>
      </div>
      <div className={styles.search}>search</div>
      <div className={styles.user}>
        <Avatar icon={<Icon type="icon-user"></Icon>}></Avatar>
      </div>
    </div>
  );
};
