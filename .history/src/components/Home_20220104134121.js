import React from 'react';
import background from '../background.png'

function Home() {
  return (
    <div  styles={{ backgroundImage:`url(${background})` }}>
      <h1>This is blue car</h1>
    </div>
  );
}

export default Home;