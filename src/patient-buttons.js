import React from 'react';
import {Pane, Button, Text} from 'evergreen-ui';

const PatientButtons = props => (
	<Pane height={150}>
		<Pane display="flex" justifyContent="center">
			<Text>Click a button to see more information about a patient</Text>
		</Pane>
		<Pane display="flex" justifyContent="center">
			<Button appearance="primary" height={56} name="d47f763e7c7f" onClick={e => props.handleClick(e)}>Jessica</Button>
			<Button marginLeft={24} appearance="primary" height={56} name="f8fedcd9e6e5" onClick={props.handleClick}>Jason</Button>
		</Pane>
	</Pane>
);

export default PatientButtons;
