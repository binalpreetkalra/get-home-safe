import React from 'react';

class Loading extends React.Component {
	
	render(){
		return(
            <div>
                <img src={require('./loading.webp')} />
                <h3>HELLO WORLD</h3>
                <p>getting set up, please wait a moment</p>
          </div>
		);
	}
}


export default Loading;