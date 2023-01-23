import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SurveyTemplate from "../widgets/surveyTemplate";
import { useEffect, useState } from "react";
import { API, CORSHeaders } from "../utils/api-middleware";

export default function Survey(props) {

	const user = useLocation().state.user;
	const navigate = useNavigate();

	const [pageData, setPageData] = useState({});
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [surveyComplete, setSurveyComplete] = useState(false);
	const [serverValidation, setServerValidation] = useState({});

	const getsurveypage = (studyid, stepid, pageid) => {
		let path = '';
		if (pageid !== null) {
			path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
		} else {
			path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
		}
		fetch(API + path, {
			method: 'GET',
			headers: CORSHeaders
		})
			.then((response): Promise<page> => response.json())
			.then((page: page) => {
				console.log(page);
				setPageData(page);
				const pagevalidation = {};
				pagevalidation[page.id] = false;
				setServerValidation({ ...serverValidation, ...pagevalidation });
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		// FIXME fetch the page number dynamically
		getsurveypage(user.study_id, 1, null);
	}, []);

	useEffect(() => {
		if (pageData.id === null) {
			navigate('/ratemovies', { state: { user: user } });
		}
		setLoading(false);
	}, [pageData, navigate, user]);

	const next = () => {
		setLoading(true);
		if (pageData.id !== null) {
			if (serverValidation[pageData.id] === false) {
				// TODO submit data to server and then fetch new set of questions
				console.log('submitting data to server');
				submitAndValidate();
			} else {
				getsurveypage(user.study_id, 1, pageData.id);
			}
		}
	}

	const submitHandler = (data) => {
		console.log('submitHandler', data);
		setSurveyAnswers(data);
		setNextButtonDisabled(false);
	}

	const submitAndValidate = () => {
		console.log('submitAndValidate');
		console.log('validate', surveyAnswers);
		fetch(API + 'user/' + user.id + '/response/likert', {
			method: 'PUT',
			headers: CORSHeaders,
			body: JSON.stringify({
				'user_id': user.id,
				'study_id': user.study_id,
				'page_id': pageData.id,
				'responses': Object.entries(surveyAnswers).map(([key, value]) => {
					return {
						'question_id': key,
						'response': value
					}
				})
			})
		})
			.then((response): Promise<isvalidated> => response.json())
			.then((isvalidated: isvalidated) => {
				console.log('isvalidated', isvalidated);
				if (isvalidated === true) {
					setServerValidation({ ...serverValidation, [pageData.id]: true });
					getsurveypage(user.study_id, 1, pageData.id);
					setNextButtonDisabled(true);
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
					<h1 className="header">Study Survey</h1>
					<p>Please pick the option that best describe your agreement with the following statements.</p>
				</div>
			</Row>
			<Row>
				{Object.entries(pageData).length !== 0 ?
					<SurveyTemplate surveyquestions={pageData.questions}
						surveyquestiongroup={pageData.page_name}
						submitCallback={submitHandler} />
					: ''
				}
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						disabled={nextButtonDisabled}
						onClick={() => next()}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)

}