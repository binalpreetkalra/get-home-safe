import React from 'react';

class Loading extends React.Component {
	
	render(){

        const container = {
            textAlign: 'center',
        }
		const title = {
            color: "#D40B0B",
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 350,
        }

        const paragraph = {
            marginTop: -20
        }
        return(
            <div style={container}>
                <h3 style={title}>Get Home Safe</h3>
                <p style={paragraph}>An error has occured</p>
          </div>
		);
	}
}


export default Loading;