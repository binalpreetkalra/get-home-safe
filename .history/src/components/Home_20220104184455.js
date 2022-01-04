import React from 'react';
import background from './background.png';

function Home() {

  return (
    <div>
      <img 
      style={{height: '100vh', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}} 
      src={background}/>
    </div>
  );
}

export default Home;