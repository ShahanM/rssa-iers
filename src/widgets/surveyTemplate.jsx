import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import LikertBar from "./likertBar";
import { useEffect, useState } from "react";

export default function SurveyTemplate(props) {

	const [surveyAnswers, setSurveyAnswers] = useState({});

	useEffect(() => {
		if ((Object.keys(surveyAnswers).length === props.surveyquestions.length)
			&& (Object.values(surveyAnswers).every((x) => x !== undefined))) {
			props.submitCallback(surveyAnswers);
		}
	}, [surveyAnswers, props]);

	const valueSelectHandler = (qid, value) => {
		let newAnswers = { ...surveyAnswers };
		newAnswers[qid] = value;
		setSurveyAnswers(newAnswers);
	}

	return (
		<Row>
			{props.surveyquestions.map((question, i) => {
				return (
					<FormGroup key={props.surveyquestiongroup + '_' + i} 
						className="survey-question-block">
						<div>
							<p className="surveyQuestionText">
								{question.question}
							</p>
						</div>
						<LikertBar surveyquestiongroup={props.surveyquestiongroup} 
							qid={i} changeCallback={valueSelectHandler} />
					</FormGroup>
				)
			})}
		</Row>

	)
}
