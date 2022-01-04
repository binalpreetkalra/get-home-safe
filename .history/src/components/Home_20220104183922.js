import React from 'react';
import background from './background.png';

function Home() {

  return (
    <div>
      <img 
      style={{position: 'fixed', minHeight: '50%', backgroundSize: 'contain', backgroundPosition: 'center' }} 
      src={background}/>
    </div>
  );
}

export default Home;