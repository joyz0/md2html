import React from 'react';
import { Link, history } from 'umi';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { Avatar as Demo } from 'antd';
import { UserOutlined } from '@ant-design/icons';
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
        <Demo
          icon={<UserOutlined />}
          src="https://static.dribbble.com/users/581199/screenshots/3656303/duo.png"
          onError={() => true}
        >
          USER
        </Demo>
      </div>
    </div>
  );
};
