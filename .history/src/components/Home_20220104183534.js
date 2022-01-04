import React from 'react';
import background from './background.png';

function Home() {

  return (
    <div>
      <img 
      style={{position: 'absolute', minWidth: '100%', minHeight: '100%', backgroundSize: 'cover', backgroundPosition: 'center' }} 
      src={background}/>
    </div>
  );
}

export default Home;