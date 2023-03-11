import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import LikertBar from "./likertBar";
import { useEffect, useState } from "react";

export default function SurveyTemplate(props) {

	const [surveyAnswers, setSurveyAnswers] = useState({});
	const [resBoolSet, setResBoolSet] = useState(new Set());

	useEffect(() => {
		setSurveyAnswers({});
		setResBoolSet(new Set());
	}, [props.surveyquestions]);

	useEffect(() => {
		if ((Object.keys(surveyAnswers).length === props.surveyquestions.length)
			&& (Object.values(surveyAnswers).every((x) => x !== undefined))) {
			props.submitCallback(surveyAnswers);
		}
	}, [surveyAnswers, props]);

	const valueSelectHandler = (qid, value) => {
		let newResBoolSet = new Set(resBoolSet);
		newResBoolSet.add(qid);
		let newAnswers = { ...surveyAnswers };
		newAnswers[qid] = value;
		setSurveyAnswers(newAnswers);
		setResBoolSet(newResBoolSet);
	}

	return (
		<Row>
			{props.surveyquestions.map((question, i) => {
				return (
					<FormGroup key={props.surveyquestiongroup + '_' + i}
						className={resBoolSet.has(i) ?
							"survey-question-block-responded"
							: "survey-question-block"}>
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
