import React from 'react';
import background from "./components/background.png"

class Home extends React.Component {
	
	render(){

        return(
            <div style={{ 
                backgroundImage: `url(${background}})` 
              }}>
              </div>
		);
	}
}


export default Home;