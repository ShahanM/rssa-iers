import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import { useEffect, useState } from 'react';


export default function EmotionToggle(props) {
	const emotions = ['Joy', 'Trust', 'Fear', 'Surprise', 'Sadness', 'Disgust', 'Anger', 'Anticipation'];

	const [emotionValues, setEmotionValues] = useState(props.emotions);

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

	return (
		<Container>
			<h4>Your taste on movie emotions</h4>
			<div>
				{	
					emotions.map((emotion, i) =>
						<Row key={emotion + '_' + i} md={2} style={{ margin: "9px 0" }}>
							<Col className="d-flex" md={{ span: 2, offset: 1 }} style={{ height: "36px" }}>
								<p style={{ margin: "auto" }}>{emotion}</p>
							</Col>
							<Col md={{ span: 3, offset: 2 }}>
								<ToggleButtonGroup type="radio" name={emotion+"_Toggle"} value={emotionValues[emotion]}
									onChange={(evt) => handleToggle(emotion, evt)}>
									<ToggleButton id={emotion + "_low"} value={"low"} 
										className={emotionValues[emotion] === 'low' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											Low
									</ToggleButton>
									<ToggleButton id={emotion + "_high"} value={"high"}
										className={emotionValues[emotion] === 'high' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											High
									</ToggleButton>
									<ToggleButton id={emotion + "ignore"} value={"ignore"} 
										className={emotionValues[emotion] === 'ignore' ? 'ersToggleBtnChecked' : 'ersToggleBtn'}>
											Ignore
									</ToggleButton>
								</ToggleButtonGroup>
							</Col>
						</Row>
					)
				}
			</div>
			<div className='d-flex'>
				<Button variant="ersControl" style={{ margin: "2em auto 0" }} onClick={() => handleReset()}>
					Reset
				</Button>
			</div>
		</Container>
	)
}