import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep, submitDemographicInfo, sendLog } from "../utils/api-middleware";
import { ageGroups, educationGroups, genderCats } from "../utils/constants";
import NextButton from "../widgets/nextButton";


export const DemographyPage = (props) => {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.studyStep;
	const navigate = useNavigate();

	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [studyStep, setStudyStep] = useState({});

	const [age, setAge] = useState(-1);
	const [gender, setGender] = useState(-1);
	const [genderText, setGenderText] = useState('');
	const [education, setEducation] = useState(-1);

	const [genderPref, setGenderPref] = useState("hidden");

	const [starttime, setStarttime] = useState(new Date());

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStudyStep(value) });
		setStarttime(new Date());
	}, []);

	useEffect(() => {
		if (gender === 4) {
			setGenderPref("text");
		} else {
			setGenderPref("hidden");
		}
	}, [gender]);

	useEffect(() => {
		setButtonDisabled(!(age >= 0 && gender >= 0 && education >= 0 &&
			((gender === 4 && genderText.length >= 3) || gender !== 4)));
	}, [age, gender, education, genderText.length]);



	const updateLog = useCallback((action, target) => {
		if (userdata !== undefined && userdata !== null
			&& studyStep.id !== undefined) {
			sendLog(userdata, studyStep.id, null, new Date() - starttime,
				action, target, null, null);
		}
	}, [userdata, studyStep.id, starttime]);

	useEffect(() => {
		if (age >= 0) {
			updateLog("changed age value to " + age, "age");
		}
	}, [age, updateLog]);

	useEffect(() => {
		if (gender >= 0) {
			updateLog("changed gender value to " + gender, "gender");
		}
	}, [gender, updateLog]);

	useEffect(() => {
		if (education >= 0) {
			updateLog("changed education value to " + education, "education");
		}
	}, [education, updateLog]);

	const submitHandler = () => {
		setLoading(true);
		setButtonDisabled(true);

		const agestr = ageGroups[age];
		const genderstr = gender === 4 ? genderText : genderCats[gender];

		const educationstr = educationGroups[education];

		submitDemographicInfo(userdata, agestr, genderstr, educationstr)
			.then(() => {
				sendLog(userdata, studyStep.id, null, new Date() - starttime,
					"submit demographic info", "submit", null, null);
				navigateToNext();
			});

		setLoading(false);
		setButtonDisabled(false);
	}

	const navigateToNext = () => {
		sendLog(userdata, studyStep.id, null, new Date() - starttime,
			"navigate", "next", null, null);
		navigate(props.next, {
			state: {
				user: userdata,
				studyStep: studyStep.id
			}
		});
	}


	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Thank you for interacting with the movie recommender system</h1>
					<p>We will now ask you several questions about your experience interacting with the system.
					</p>
				</div>
			</Row>
			<Row className="generalBodyContainer">
				<Form.Group className="mb-3" style={{ textAlign: "left" }}>
					<Form.Label>What is your age?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-1"
						style={{ width: "400px" }}
						onChange={(evt) => setAge(+evt.target.value)} value={age}>
						<option value="-1">Please choose an option</option>
						{Object.keys(ageGroups).map((key) => {
							return <option key={'age_' + key} value={key}>
								{ageGroups[key]}
							</option>
						})}
					</Form.Select>
					<br />
					<Form.Label>What is your gender?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-2"
						style={{ width: "400px" }}
						onChange={(evt) => setGender(+evt.target.value)} value={gender}>
						<option value="-1">Please choose an option</option>
						{Object.keys(genderCats).map((key) => {
							return <option key={'gender_' + key} value={key}>
								{genderCats[key]}
							</option>
						})}
					</Form.Select>
					<Form.Control type={genderPref} style={{ marginTop: "9px" }}
						onChange={(evt) => setGenderText(evt.target.value)} />
					<br />
					<Form.Label>What is the highest degree or level of education you have completed?</Form.Label>
					<Form.Select variant="outline-secondary" title="Dropdown" id="input-group-dropdown-4"
						style={{ width: "400px" }}
						onChange={(evt) => setEducation(+evt.target.value)} value={education}>
						<option value="-1">Please choose an option</option>
						{Object.keys(educationGroups).map((key) => {
							return <option key={'education_' + key} value={key}>
								{educationGroups[key]}
							</option>
						})}
					</Form.Select>
				</Form.Group>
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => submitHandler()} />
				</div>
			</Row>

		</Container>

	);
}

export default DemographyPage;
