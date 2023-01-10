import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SurveyTemplate from "../widgets/surveyTemplate";

export default function PreSurvey(props) {

	const state = { state: useLocation().state };
	const navigate = useNavigate();

	console.log(state);
	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Welcome</h1>
					<p>Welcome to the study on movie recommendation.</p>
				</div>
			</Row>
			<Row>
				<SurveyTemplate />
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={() => navigate('/presurvey', state)}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)

}