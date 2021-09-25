import React, { ReactElement } from 'react';
import './Loader.scss';

export function Loader(): ReactElement {
  return (
    <div className="lds-ripple">
      <div />
      <div />
    </div>
  );
}
