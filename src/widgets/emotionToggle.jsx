import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { emotionsDict } from '../utils/constants';
import { FcAbout } from "react-icons/fc";


export default function EmotionToggle(props) {
	const emotions = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];

	const [emotionValues, setEmotionValues] = useState(props.emotions);
	const [isDone, setIsDone] = useState(props.isDone);

	useEffect(() => {
		setIsDone(props.isDone);
	}, [props.isDone]);

	const handleToggle = (emotion, value) => {
		setEmotionValues(prevState => {
			return {
				...prevState,
				[emotion]: value
			}
		});
		props.onToggle(emotion, value);
	}

	const handleReset = () => {
		setEmotionValues(emotionsDict);
		props.onReset();
	}

	const handleSave = () => {
		setIsDone(true);
		props.onFinalize();
	}

	return (
		<Container>
			<div style={{ marginBottom: "3px", display: "inline-flex", marginTop: "27px" }}>
				<h4>Adjust your emotion preferences</h4>
				<FcAbout size={30} className="infoIcon"
					style={{ marginTop: "-18px", marginLeft: "9px" }}
					onClick={props.infoCallback} />
			</div>
			<Row className="emoToggleInputs">
				<div className="emoToggleInputsOverlay" style={{ position: "absolute", width: "410px", height: "320px", zIndex: "999", display: "None" }}></div>
				{
					emotions.map((emotion, i) =>
						<Row key={emotion + '_' + i} md={2} style={{ margin: "3px 0" }}>
							<Col className="d-flex" md={{ span: 2 }} style={{ height: "27px" }}>
								<p style={{ marginTop: "3px" }}>{emotion}</p>
							</Col>
							<Col md={{ span: 3, offset: 1 }}>
								<ToggleButtonGroup type="radio" name={emotion + "_Toggle"} value={emotionValues[emotion]}
									onChange={(evt) => handleToggle(emotion, evt)}>
									<ToggleButton id={emotion + "_low"} value={"low"} disabled={isDone}
										className={emotionValues[emotion] === 'low' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										Less
									</ToggleButton>
									<ToggleButton id={emotion + "_high"} value={"high"} disabled={isDone}
										className={emotionValues[emotion] === 'high' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										More
									</ToggleButton>
									<ToggleButton id={emotion + "ignore"} value={"ignore"} disabled={isDone}
										className={emotionValues[emotion] === 'ignore' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
										{props.defaultLabel}
									</ToggleButton>
								</ToggleButtonGroup>
							</Col>
						</Row>
					)
				}
			</Row>
			<Row style={{ marginTop: "2em" }}>
				<Button className="emoToggleResetBtn" style={{ margin: "auto", width: "300px" }} variant="ersCancel" onClick={() => handleReset()} disabled={isDone}>
					Reset
				</Button>
			</Row>
		</Container>
	)
}