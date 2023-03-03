import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export const ParameterInput = (props) => {

	const [conditionAlgo, setConditionAlgo] = useState(1);
	const [itemPoolCount, setItemPoolCount] = useState(200);
	const [divCount, setDivCount] = useState(50);
	const [scaleVector, setScaleVector] = useState(false);
	const [lowval, setLowval] = useState(-0.3);
	const [highval, setHighval] = useState(0.3);
	const [algoExperiment, setAlgoExperiment] = useState(1);


	const algoExpMap = {
		1: 'algo1',
		2: 'algo2',
		3: 'algo3'
	}

	const handleLowValInput = (event) => {
		setLowval(event.target.value);
	}

	const handleHighValInput = (event) => {
		setHighval(event.target.value);
	}

	const handleAlgoSelect = (event) => {
		const algo = parseInt(event.target.value);
		if (algo === 1 && algoExperiment === 2) {
			setAlgoExperiment(1);
		} else if (algo === 2 && algoExperiment === 1) {
			setAlgoExperiment(2);
		}
		setConditionAlgo(algo);
	}

	const handleItemPoolCount = (event) => {
		setItemPoolCount(event.target.value);
	}

	const handleDivCount = (event) => {
		setDivCount(event.target.value);
	}

	const handleAlgoExperiment = (event) => {
		const algo = parseInt(event.target.value);
		// console.log(algo);
		// if (algo === 3) {
		// 	setLowval(-0.125);
		// 	setHighval(0.125);
		// } else {
		// 	setLowval(-0.3);
		// 	setHighval(0.3);
		// }
		setAlgoExperiment(algo);
	}

	const handleScaleValue = (event) => {
		const scale = parseInt(event.target.value);
		if (scale === 1) {
			setScaleVector(true);
		} else {
			setScaleVector(false);
		}
	}

	const handleUpdate = () => {
		const params = {
			condition_algo: conditionAlgo,
			scale_vector: scaleVector,
			lowval: lowval,
			highval: highval,
			algo: algoExpMap[algoExperiment]
		}
		props.updateCallback(params);
	}

	return (
		<>
			<InputGroup className="mb-3">
				<InputGroup.Text id="inputGroup-sizing-sm">
					Algo Condition
				</InputGroup.Text>
				<Form.Select aria-label="Algo Condition"
					onChange={handleAlgoSelect}
					value={conditionAlgo}>
					<option value="1" >
						TopN
					</option>
					<option value="2" >
						DiverseN
					</option>
				</Form.Select>
			</InputGroup>
			<InputGroup className="mb-3"
				onChange={handleItemPoolCount}>
				<InputGroup.Text id="inputGroup-sizing-sm">
					Item Pool Count
				</InputGroup.Text>
				<Form.Control
					placeholder={itemPoolCount}
					aria-label="itempoolcount"
					aria-describedby="inputGroup-sizing-sm"
				/>
			</InputGroup>
			{conditionAlgo === 2 &&
				<InputGroup className="mb-3"
					onChange={handleDivCount}>
					<InputGroup.Text id="inputGroup-sizing-sm">
						Diversity Sampling Count
					</InputGroup.Text>
					<Form.Control
						placeholder={divCount}
						aria-label="diversitysamplingcount"
						aria-describedby="inputGroup-sizing-sm"
					/>
				</InputGroup>
			}
			<InputGroup className="mb-3">
				<InputGroup.Text id="inputGroup-sizing-sm">
					Ranking Strategy
				</InputGroup.Text>
				<Form.Select aria-label="Algo Experiment"
					onChange={handleAlgoExperiment}
					value={algoExperiment}>
					{conditionAlgo === 1 &&
						<option value="1">
							Emotion Distance
						</option>
					}
					{conditionAlgo === 2 &&
						<option value="2">
							Diversify on unspecified
						</option>
					}
					<option value="3" >
						Weighted Ranking
					</option>
				</Form.Select>
			</InputGroup>
			<InputGroup className="mb-3">
				<InputGroup.Text id="inputGroup-sizing-sm">
					Enable Scale Value
				</InputGroup.Text>
				<Form.Select aria-label="Scale Value"
					onChange={handleScaleValue}
					value={scaleVector ? 1 : 2}>
					<option value="1">
						Yes
					</option>
					<option value="2" >
						No
					</option>
				</Form.Select>
			</InputGroup>
			<InputGroup className="mb-3" type="number"
				onChange={handleLowValInput}>
				<InputGroup.Text id="inputGroup-sizing-sm">
					Low Value
				</InputGroup.Text>
				<Form.Control
					placeholder={lowval}
					aria-label="lowval"
					aria-describedby="inputGroup-sizing-sm"
				/>
			</InputGroup>
			<InputGroup className="mb-3"
				onChange={handleHighValInput}
				default={highval}>
				<InputGroup.Text id="inputGroup-sizing-default">
					High Value
				</InputGroup.Text>
				<Form.Control
					placeholder={highval}
					aria-label="highval"
					aria-describedby="inputGroup-sizing-default"
				/>
			</InputGroup>
			<Button variant="ers" onClick={handleUpdate}>
				Update
			</Button>
		</>
	)
}