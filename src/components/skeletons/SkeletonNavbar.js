import React from 'react';
import Skeleton from 'react-loading-skeleton';

function SkeletonNavbar() {
  return (
    <section>
      <h2>
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
        <Skeleton duration={1} height={30} width={300} />
      </h2>
    </section>
  );
}
export default SkeletonNavbar;
