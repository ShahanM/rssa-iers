import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import LikertBar from "./likertBar";

export default function SurveyTemplate(props) {
	const surveyquestiongroup = "test";
	const surveyquestions = ['a', 'b', 'c', 'd'];

	console.log(props);

	return (
		<Row>
			{props.surveyquestions.map((question, i) => {
				return (
					<FormGroup className="survey-question-block">
						<div>
							<p className="surveyQuestionText">{question.question}</p>
						</div>
						<LikertBar surveyquestiongroup={props.surveyquestiongroup} qid={i} />
					</FormGroup>
				)
			})}
		</Row>

	)
}
