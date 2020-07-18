import React from 'react';
import {Pane} from 'evergreen-ui';
import ReactDom from 'react-dom';
import JSONPretty from 'react-json-pretty';
import {Header, Footer} from './navigation-components';
import PatientButtons from './patient-buttons';
import {getAuthToken, getPatientData} from './services';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasData: false,
			patientData: {},
			access_token: '',
			expiration: Math.infinity,
			error: ''
		}
	}

	componentWillMount() {
		getAuthToken(this.state.expiration)
			.then(data => {
				const {access_token, expiration} = data;
				this.setState({access_token, expiration});
			})
			.catch(error => {
				console.log(error);
				this.setState({error: 'There was a problem fetching an access token please try refreshing the page'});
			});
	}

	handlePatientClick = e => {
		const {target: {name}} = e;
		console.log(this.state.expiration);
		return (async () => {
			let auth_token = this.state.access_token;
			console.log(auth_token);

			if (this.state.expiration < Date.now()) {
				const {token, expiration} = await getAuthToken(this.state.expiration);
				auth_token = token;
				this.setState({access_token: token, expiration});
			}
			getPatientData(name, auth_token)
				.then(patientData => {
					this.setState({hasData: true, patientData, error: ''});
			}).catch(error => {
				this.setState({error});
			});
		})()
	}

	render() {
		return (
			<Pane>
				<Header />
				<Pane height={700}>
				    <PatientButtons handleClick={this.handlePatientClick}/>
				    {this.state.hasData && 
				    	<JSONPretty data={this.state.patientData} />
				    }
				    {this.state.error && 
				    	<p>this.state.error</p>
				    }
			    </Pane>
				<Footer />
			</Pane>
		);
	}
}

ReactDom.render(<App />, document.getElementById('root'));