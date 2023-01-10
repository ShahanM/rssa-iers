import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { API } from '../constants';
import InformedConsentModal from '../widgets/informedConsent';

export default function Welcome(props) {


	const [show, setShowInformedConsent] = useState(false);
	const [userdata, setUserdata] = useState({});

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const navigate = useNavigate();

	useEffect(() => {
		const userProps = ['id', 'condition', 'user_type', 'seen_items'];
		if (userProps.every(item => userdata.hasOwnProperty(item))) {
			console.log('works great!');
			navigate('/studyoverview',
				{
					state: {
						user: userdata
					}
				});
		}
	}, [userdata, navigate]);

	const consentCallbackHandler = (consent) => {
		if (consent) {
			fetch(API + 'user/consent/', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Headers": "*",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*"
				},
				body: JSON.stringify({
					"condition": 1,
					"user_type": "ersStudy"
				})
			})
				.then((response): Promive<user> => response.json())
				.then((user: user) => {
					setUserdata(user);
				})
				.catch((error) => console.log(error));
		}
	}

	return (
		<Container>
			<Row>

				<div className="jumbotron">
					<h1 className="header">Welcome</h1>
					<p>Welcome to the study on movie recommendation.</p>
				</div>
			</Row>

			<Row>
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
			</Row>

			<InformedConsentModal show={show} consentCallback={consentCallbackHandler} />
			
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn" onClick={showInformedConsent}>
						Get started
					</Button>
				</div>
			</Row>
		</Container>
	)
}