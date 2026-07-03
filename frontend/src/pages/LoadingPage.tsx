import React, { JSX } from 'react'

const LoadingSpinner = (): JSX.Element => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-700"></div>
  </div>
);

export default LoadingSpinner;