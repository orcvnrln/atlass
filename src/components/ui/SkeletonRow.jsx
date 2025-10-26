import React from 'react';

const SkeletonRow = ({ columns = 5 }) => {
  return (
    <tr className="animate-pulse">
      {Array(columns).fill(0).map((_, colIndex) => (
        <td key={colIndex} className="px-6 py-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 5 }) => {
  return (
    <>
      {Array(rows).fill(0).map((_, rowIndex) => (
        <SkeletonRow key={rowIndex} columns={columns} />
      ))}
    </>
  );
};

export default SkeletonRow;
