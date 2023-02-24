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

	const [show, setShowInformedConsent] = useState(false);
	const [userdata, setUserdata] = useState({});
	const [study, setStudy] = useState({});
	const [studyStep, setStudyStep] = useState({});

	const showInformedConsent = () => {
		setShowInformedConsent(!show);
	}

	const navigate = useNavigate();

	useEffect(() => {
		const userProps = ['id', 'condition', 'user_type', 'seen_items'];
		if (userProps.every(item => userdata.hasOwnProperty(item))) {
			navigate(props.next,
				{
					state: {
						user: userdata,
						studyStep: studyStep.id
					}
				});
		}
	}, [userdata, navigate, studyStep]);

	useEffect(() => {
		get('study/' + studyID)
			.then((response): Promise<studyres> => response.json())
			.then((studyres: studyres) => {
				setStudy(studyres);
			});
		get('study/' + studyID + '/step/first/')
			.then((response): Promise<studyStep> => response.json())
			.then((studyStep: studyStep) => {
				setStudyStep(studyStep);
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
							<li>Complete a pre-survey.</li>
							<li>Rate a few movies you are familiar with to let the recommender system know about movie preference.</li>
							<li>Interact with the movie recommender system, then pick one movie you will watch.</li>
							<li>Complete a post-survey.</li>
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