import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';


export default function EmotionToggle(props) {
	const emotions = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];

	const [emotionValues, setEmotionValues] = useState(props.emotions);
	const [isDone, setIsDone] = useState(props.isDone);

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
		setEmotionValues({
			'Joy': 'ignore',
			'Trust': 'ignore',
			'Fear': 'ignore',
			'Surprise': 'ignore',
			'Sadness': 'ignore',
			'Disgust': 'ignore',
			'Anger': 'ignore',
			'Anticipation': 'ignore'
		});
		props.onReset();
	}

	const handleSave = () => {
		setIsDone(true);
		props.onFinalize();
	}

	return (
		<Container>
			<h4>Your taste on movie emotions</h4>
			<Row>
				<div>
					{
						emotions.map((emotion, i) =>
							<Row key={emotion + '_' + i} md={2} style={{ margin: "9px 0" }}>
								<Col className="d-flex" md={{ span: 2, offset: 1 }} style={{ height: "36px" }}>
									<p style={{ margin: "auto" }}>{emotion}</p>
								</Col>
								<Col md={{ span: 3, offset: 2 }}>
									<ToggleButtonGroup type="radio" name={emotion + "_Toggle"} value={emotionValues[emotion]}
										onChange={(evt) => handleToggle(emotion, evt)}>
										<ToggleButton id={emotion + "_low"} value={"low"} disabled={isDone}
											className={emotionValues[emotion] === 'low' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											Low
										</ToggleButton>
										<ToggleButton id={emotion + "_high"} value={"high"} disabled={isDone}
											className={emotionValues[emotion] === 'high' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											High
										</ToggleButton>
										<ToggleButton id={emotion + "ignore"} value={"ignore"} disabled={isDone}
											className={emotionValues[emotion] === 'ignore' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											Ignore
										</ToggleButton>
									</ToggleButtonGroup>
								</Col>
							</Row>
						)
					}
				</div>
			</Row>
			<Row style={{ marginTop: "2em" }}>
				<Col md={{ span: 3, offset: 1 }}>
					<Button style={{ width: "100%" }} variant="ersCancel" onClick={() => handleReset()} disabled={isDone}>
						Reset
					</Button>
				</Col>
				<Col md={{ span: 6, offset: 1 }}>
					<Button style={{ width: "100%" }} variant="ersDone" onClick={() => handleSave()}>
						Finalize
					</Button>
				</Col>
			</Row>
		</Container>
	)
}