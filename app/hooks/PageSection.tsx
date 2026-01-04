import { ReactNode } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { cn } from '../lib/utils';

const PageSection = ({
  id,
  className,
  children,
  disableMinHeight = false,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  disableMinHeight?: boolean;
}) => {
  const baseSpacing = disableMinHeight
    ? 'py-3 md:py-5'
    : 'min-h-[calc(100dvh-96px)] py-3 md:min-h-[calc(100dvh-116px)] md:py-5';

  return (
    <div
      id={id}
      className={cn(baseSpacing, className)}
    >
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
    </div>
  );
};

export default PageSection;
