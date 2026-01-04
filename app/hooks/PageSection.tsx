import { ReactNode } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { cn } from '../lib/utils';

const PageSection = ({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      id={id}
      className={cn(
        'min-h-[calc(100dvh-96px)] py-3 md:min-h-[calc(100dvh-116px)] md:py-5',
        className,
      )}
    >
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
    </div>
  );
};

export default PageSection;