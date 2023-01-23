import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useLocation, useNavigate } from "react-router-dom";

export default function StudyMap(props) {

	const state = { state: useLocation().state };
	const navigate = useNavigate();

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Welcome</h1>
					<p>Welcome to the study on movie recommendation.</p>
				</div>
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
						onClick={() => navigate('/presurvey', state)}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)
}