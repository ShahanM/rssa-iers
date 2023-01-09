import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InformedConsentModal from '../widgets/informedConsent';

export default function Welcome(props) {

	const [show, setShowInformedConsent] = useState(false);

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const consentCallbackHandler = (consent) => {
		console.log(consent);
	}

	return (
		<>
			<div className="jumbotron">
				<h1 className="header">Welcome</h1>
				<p>Welcome to the study on movie recommendation.</p>
			</div>

			<Card bg="light">
				<Card.Body className="instructionblurb">
					<Card.Title>What can you expect?</Card.Title>
					<p>
						This is a study that aims to test a new recommender system for movies. Your participation in
						this study will be valued.
					</p>
					<p>
						It will take you about 10-15 minutes to complete the four steps of the study:
					</p>
					<ol>
						<li>Complete a pre-survey on your preference profile.</li>
						<li>Rate a few movies you are familiar with.</li>
						<li>Interact with the movie recommender system by tweaking the recommendations before picking a movie from the final recommendations.</li>
						<li>Complete survey about your experience interacting with the system.</li>
					</ol>

					<p>Thanks,<br />
						Research Team</p>

				</Card.Body>
			</Card>
			<InformedConsentModal show={show} consentCallback={consentCallbackHandler} />
			<div className="jumbotron jumbotron-footer">
				<Button variant="ers" size="lg" className="footer-btn" onClick={showInformedConsent}>
					Get started
				</Button>
			</div>
		</>
	)
}