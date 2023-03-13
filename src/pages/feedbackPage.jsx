import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, getNextStudyStep, put } from '../utils/api-middleware';
import NextButton from '../widgets/nextButton';


export default function FeedbackPage(props) {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [responseText, setResponseText] = useState('');
	const [studyStep, setStudyStep] = useState({});
	const [pageData, setPageData] = useState({});

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
	}, []);

	const storeText = (evt) => {
		setResponseText(evt.target.value);
		if (evt.target.textLength > 1) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}

	}

	const getStepPage = (studyid, stepid, pageid) => {
		let path = '';
		if (pageid !== null) {
			path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
		} else {
			path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
		}
		get(path)
			.then((response): Promise<page> => response.json())
			.then((page: page) => {
				setPageData(page);
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		if (Object.keys(studyStep).length > 0) {
			getStepPage(userdata.study_id, studyStep.id, null);
		}
	}, [studyStep]);

	const submitHandler = () => {
		put('user/' + userdata.id + '/response/freetext/', {
			'user_id': userdata.id,
			'study_id': userdata.study_id,
			'page_id': pageData.id,
			'responses': [{
				question_id: pageData.questions[0].id,
				response: responseText
			}]
		})
			.then((response): Promise<isvalidated> => response.json())
			.then((isvalidated: isvalidated) => {
				if (isvalidated === true) {
					navigate(props.next, {
						state: {
							user: userdata,
							studyStep: studyStep.id
						}
					});
				} else {
					setLoading(false);
				}
			})
			.catch((error) => console.log(error));
	}

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Thank you for interacting with the movie recommender system</h1>
					<p>We will now ask you several questions about your experience interacting with the system.
					</p>
				</div>
			</Row>
			<Row>
				<Card bg="light">
					<Card.Body>
						<Card.Title>Did anything go wrong while using the system?</Card.Title>
						<Form.Group className="mb-3" controlId="responseText">
							<Form.Label>We appreciate the feedback.</Form.Label>
							<Form.Control as="textarea" rows={3} onChange={(evt) =>
								storeText(evt)} />
						</Form.Group>
					</Card.Body>
				</Card>
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => submitHandler()} />
				</div>
			</Row>
		</Container>
	);
}