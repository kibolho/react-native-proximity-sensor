import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import type { ShimmerProps } from './types';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const Shimmer: React.FC<ShimmerProps> = ({
  children,
  isLoading,
  height = 28,
  ...rest
}) => {
  return (
    <ShimmerPlaceHolder {...rest} visible={!isLoading} height={height}>
      {children}
    </ShimmerPlaceHolder>
  );
};

export default Shimmer;
