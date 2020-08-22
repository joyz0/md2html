import React, { useEffect } from 'react';
import { Link, history } from 'umi';
import { Icon } from '@/components/Icon';
import { Avatar } from '@/components/Avatar';
import { useRafState, useWindowScroll } from '@/components/shared/hooks';
import LogoHome from '@/assets/logo_home.png';
import styles from './basic-layout.less';

const BasicHeader = () => {
  const { x, y } = useWindowScroll();
  const [opacity, setOpacity] = useRafState(0);
  useEffect(() => {}, [y]);
  return (
    <div className={styles.basicHeader} style={{}}>
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

export default BasicHeader;
