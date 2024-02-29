import React from 'react';
import Skeleton from 'react-loading-skeleton';

function SkeletonLoading() {
  return (
    <section>
      <h2>
        <Skeleton duration={1} height={30} width={300} />
      </h2>
      <ul>
        {Array(8)
          .fill()
          .map((item, index) => (
            <h1 key={index}>
              <Skeleton height="40" width="500" />
              <Skeleton height="20" width="80%" />
            </h1>
          ))}
      </ul>
    </section>
  );
}
export default SkeletonLoading;
