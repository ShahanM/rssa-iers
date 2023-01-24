import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { get, getNextStudyStep, put } from "../utils/api-middleware";
import HeaderJumbotron from "../widgets/headerJumbotron";
import NextButton from "../widgets/nextButton";
import SurveyTemplate from "../widgets/surveyTemplate";

export default function Survey(props) {


	const userdata = useLocation().state.user;
	const stepid = useLocation().state.step;
	const navigate = useNavigate();

	const [pageData, setPageData] = useState({});
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [serverValidation, setServerValidation] = useState({});
	const [step, setStep] = useState({});

	const getsurveypage = (studyid, stepid, pageid) => {
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
				const pagevalidation = {};
				pagevalidation[page.id] = false;
				setServerValidation({ ...serverValidation, ...pagevalidation });
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStep(value) });
	}, []);

	useEffect(() => {
		if (Object.keys(surveyAnswers).length === 0 && Object.entries(step).length !== 0) {
			getsurveypage(userdata.study_id, step.id, null);
		}
	}, [step]);

	useEffect(() => {
		if (pageData.id === null) {
			navigate('/ratemovies', {
				state: {
					user: userdata,
					step: step.id
				}
			});
		}
		setLoading(false);
	}, [pageData, navigate, userdata, step]);

	const next = () => {
		setLoading(true);
		if (pageData.id !== null) {
			if (serverValidation[pageData.id] === false) {
				submitAndValidate();
			} else {
				getsurveypage(userdata.study_id, step.id, pageData.id);
			}
		}
	}

	const submitHandler = (data) => {
		setSurveyAnswers(data);
		setNextButtonDisabled(false);
	}

	const submitAndValidate = () => {
		put('user/' + userdata.id + '/response/likert/', {
			'user_id': userdata.id,
			'study_id': userdata.study_id,
			'page_id': pageData.id,
			'responses': Object.entries(surveyAnswers).map(([key, value]) => {
				return {
					'question_id': key,
					'response': value
				}
			})
		})
			.then((response): Promise<isvalidated> => response.json())
			.then((isvalidated: isvalidated) => {
				if (isvalidated === true) {
					setServerValidation({ ...serverValidation, [pageData.id]: true });
					getsurveypage(userdata.study_id, step.id, pageData.id);
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
				<HeaderJumbotron step={step} />
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
					<NextButton disabled={nextButtonDisabled}
						loading={loading} onClick={() => next()} />
				</div>
			</Row>
		</Container>
	)

}