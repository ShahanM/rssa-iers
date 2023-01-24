import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep } from "../utils/api-middleware";
import HeaderJumbotron from "../widgets/headerJumbotron";

export default function StudyMap(props) {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.step;
	const navigate = useNavigate();

	const [step, setStep] = useState({});

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStep(value) });
	}, []);

	return (
		<Container>
			<Row>
				<HeaderJumbotron step={step} />
			</Row>

			<Row>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Pre-survey
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Rate Movies
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Tweak recommendation
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Post-survey
							</Card.Title>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={() => navigate('/presurvey', {
							state: {
								user: userdata,
								step: step.id
							}
						})}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)
}