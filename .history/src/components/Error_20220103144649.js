import React from 'react';

class Loading extends React.Component {
	
	render(){

        const container = {
            top: '50%',
            left: '50%',
            textAlign: 'center',
            //alignItems: 'center'
        }
		const title = {
            color: "#D40B0B",
            fontSize: 30,
            fontWeight: "bold",
            marginTop: 300,
        }

        const paragraph = {
            marginTop: -20
        }
        return(
            <div style={container}>
                <h3 style={title}>Get Home Safe</h3>
                <p style={paragraph}>getting set up, please wait a moment</p>
          </div>
		);
	}
}


export default Loading;