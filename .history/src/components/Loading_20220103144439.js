import React from 'react';

class Loading extends React.Component {
	
	render(){

        const container = {
            top: '50%',
            left: '50%',
            textAlign: 'center'
        }
		const title = {
            color: "#6CBCAE",
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 50,
        }

        const image = {
            marginBottom: -100,
            marginTop: 150
        }

        const paragraph = {
            marginTop: -30
        }
        return(
            <div style={container}>
                <img style={image} src={require('./loading.webp')} />
                <h3 style={title}>Get Home Safe</h3>
                <p style={paragraph}>getting set up, please wait a moment</p>
          </div>
		);
	}
}


export default Loading;