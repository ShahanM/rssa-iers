import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep } from "../utils/api-middleware";
import HeaderJumbotron from "../widgets/headerJumbotron";
import Image from "react-bootstrap/Image";

export default function StudyMap(props) {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.step;
	const navigate = useNavigate();

	const [step, setStep] = useState({});


	const rspref = require("../res/rate-prefs.png");
	const presurvey = require("../res/pre-survey.png");
	const rsinteract = require("../res/interact.png");
	const postsurvey = require("../res/post-survey.png")

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
							<Image src={presurvey} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Rate Movies
							</Card.Title>
							<Image src={rspref} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Interact with the system
							</Card.Title>
							<Image src={rsinteract} fluid />
						</Card.Body>
					</Card>
				</Col>
				<Col>
					<Card className="overviewCard">
						<Card.Body>
							<Card.Title>
								Post-survey
							</Card.Title>
							<Image src={postsurvey} fluid />
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