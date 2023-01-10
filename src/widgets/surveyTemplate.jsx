import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";
import LikertBar from "./likertBar";

export default function SurveyTemplate(props) {
	const surveyquestiongroup = "test";
	const surveyquestions = ['a', 'b', 'c', 'd'];

	return (
		<Row>
			{surveyquestions.map((question, i) => {
				return (
					<FormGroup className="survey-question-block">
						<div>
							<p>{question}</p>
						</div>
						<LikertBar surveyquestiongroup={surveyquestiongroup} qid={i} />
					</FormGroup>
				)
			})}
		</Row>

	)
}
