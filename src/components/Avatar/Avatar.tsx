import React, { useState, useReducer, useEffect, Reducer } from 'react';
import classNames from 'classnames';
import styles from './avatar.less';

type AvatarShape = 'circle' | 'square';
type AvatarSize = number | 'large' | 'small' | 'default';
export interface AvatarProps extends classAndStyleProps {
  icon?: React.ReactNode;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  srcSet?: string;
  alt?: string;
  onError?: NoArgFn<boolean>;
  gap?: number;
}

interface renderState {
  renderShape?: AvatarShape;
  renderSize?: AvatarSize;
  renderIcon?: boolean;
  renderSrc?: boolean;
  renderString?: boolean;
  renderChildren?: JSX.Element;
}

function handleImgError() {}
function reducer(state: renderState, action: Partial<renderState>) {
  return {
    ...state,
    ...action,
  };
}
function useAvatarProps({
  icon,
  shape,
  size,
  src,
  srcSet,
  alt,
  onError,
  gap,
}: AvatarProps) {
  const [renderState, dispatchRenderState] = useReducer(reducer, {});
  function handleImgLoadError() {
    const fallback = onError ? onError() : true;
    fallback &&
      dispatchRenderState({
        renderSrc: false,
      });
  }
  if (src) {
    dispatchRenderState({
      renderChildren: <img src={src} onError={handleImgLoadError} />,
    });
  }
  return [renderState];
}
export const Avatar: React.FC<AvatarProps> = props => {
  const [state] = useAvatarProps(props);
  return <span className={classNames('avatar')}>{state.renderChildren}</span>;
};

Avatar.defaultProps = {
  shape: 'circle',
  size: 'default',
  gap: 4,
};
