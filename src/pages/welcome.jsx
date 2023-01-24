import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../utils/api-middleware';
import InformedConsentModal from '../widgets/informedConsent';

export default function Welcome(props) {

	const studyID = 1;
	// const step = 1;

	const [show, setShowInformedConsent] = useState(false);
	const [userdata, setUserdata] = useState({});
	const [study, setStudy] = useState({});
	const [step, setStep] = useState({});

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const navigate = useNavigate();

	useEffect(() => {
		const userProps = ['id', 'condition', 'user_type', 'seen_items'];
		if (userProps.every(item => userdata.hasOwnProperty(item))) {
			navigate('/studyoverview',
				{
					state: {
						user: userdata,
						step: step.id
					}
				});
		}
	}, [userdata, navigate, step]);

	useEffect(() => {
		get('study/' + studyID)
			.then((response): Promise<studyres> => response.json())
			.then((studyres: studyres) => {
				setStudy(studyres);
			});
		get('/study/' + studyID + '/step/first/')
			.then((response): Promise<step> => response.json())
			.then((step: step) => {
				console.log(step.step_name, step);
				setStep(step);
			})

	}, []);

	const consentCallbackHandler = (consent) => {
		if (consent) {
			const conditions = study.conditions.map(con => con.id);
			post('user/consent/', {
				study_id: study.id,
				study_conditions: conditions,
				user_type: 'ersStudy'
			})
				.then((response): Promise<user> => response.json())
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