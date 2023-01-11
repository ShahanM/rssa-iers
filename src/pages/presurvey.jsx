import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SurveyTemplate from "../widgets/surveyTemplate";
import { useEffect, useState } from "react";
import { API } from "../constants";

export default function PreSurvey(props) {

	const user = useLocation().state.user;
	const navigate = useNavigate();

	const [pageData, setPageData] = useState({});

	const getsurveypage = (studyid, stepid, pageid) => {
		let path = '';
		if (pageid !== null) {
			path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
		} else {
			path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
		}
		fetch(API + path, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*"
			}
		})
			.then((response): Promise<page> => response.json())
			.then((page: page) => { console.log(page); setPageData(page); })
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		getsurveypage(1, 1, null);
	}, []);

	useEffect(() => {
		if (pageData.id === null) {
			navigate('/ratemovies', { state: { user: user } });
		}
	}, [pageData, navigate, user]);

	const next = () => {
		if (pageData.id !== null) {
			// TODO submit data to server and then fetch new set of questions
			getsurveypage(1, 1, pageData.id);
		}
	}

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Welcome</h1>
					<p>Welcome to the study on movie recommendation.</p>
				</div>
			</Row>
			<Row>
				{Object.entries(pageData).length !== 0 ?
					<SurveyTemplate surveyquestions={pageData.questions}
						surveyquestiongroup={pageData.page_name} />
					: ''
				}
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button variant="ers" size="lg" className="footer-btn"
						onClick={() => next()}>
						Next
					</Button>
				</div>
			</Row>
		</Container>
	)

}