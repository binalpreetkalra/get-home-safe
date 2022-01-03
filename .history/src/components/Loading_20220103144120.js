import React from 'react';

class Loading extends React.Component {
	
	render(){

        const container = {
            justifycontent: 'center',
            textAlign: 'center'
        }
		const title = {
            color: "#6CBCAE",
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 50,
            paddingBottom: "0.5rem"
        }
        return(
            <div style={container}>
                <img src={require('./loading.webp')} />
                <h3 style={title}>Get Home Safe</h3>
                <p>getting set up, please wait a moment</p>
          </div>
		);
	}
}


export default Loading;