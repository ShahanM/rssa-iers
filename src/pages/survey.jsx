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
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [pageData, setPageData] = useState({});
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [serverValidation, setServerValidation] = useState({});
	const [studyStep, setStudyStep] = useState({});
	const [showUnanswered, setShowUnanswered] = useState(false);

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
				setShowUnanswered(false);
				const pagevalidation = {};
				pagevalidation[page.id] = false;
				setServerValidation({ ...serverValidation, ...pagevalidation });
				setNextButtonDisabled(true);
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
	}, []);

	useEffect(() => {
		if (Object.keys(surveyAnswers).length === 0 && Object.entries(studyStep).length !== 0) {
			getsurveypage(userdata.study_id, studyStep.id, null);
		}
	}, [studyStep]);

	useEffect(() => {
		if (pageData.id === null) {
			navigate(props.next, {
				state: {
					user: userdata,
					studyStep: studyStep.id
				}
			});
		} else {
			window.scrollTo(0, 0);
		}
		setLoading(false);
	}, [pageData, navigate, userdata, studyStep, props.next]);

	const next = () => {
		if (nextButtonDisabled) {
			setShowUnanswered(true);
		} else {
			setLoading(true);
			if (pageData.id !== null) {
				if (serverValidation[pageData.id] === false) {
					submitAndValidate();
				} else {
					console.log('getting new set of questions.');
					getsurveypage(userdata.study_id, studyStep.id, pageData.id);
				}
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
					getsurveypage(userdata.study_id, studyStep.id, pageData.id);
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
				<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
			</Row>
			<Row>
				{Object.entries(pageData).length !== 0 ?
					<SurveyTemplate surveyquestions={pageData.questions}
						surveyquestiongroup={pageData.page_name}
						showUnanswered={showUnanswered}
						submitCallback={submitHandler} />
					: ''
				}
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={false} variant={nextButtonDisabled ? 'ers-disabled' : 'ers'}
						loading={loading} onClick={() => next()} />
				</div>
			</Row>
		</Container>
	)

}