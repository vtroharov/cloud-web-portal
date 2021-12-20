import React, { Fragment } from 'react';
import spinner from '../../img/spinner.gif';

export default ()=> (
  <Fragment className="mt-5">
    <img
      src={spinner}
      style={{ width: '200px', margin: '100px auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);