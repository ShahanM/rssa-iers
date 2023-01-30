import { useState } from "react";
import FormLabel from "react-bootstrap/FormLabel";

export default function LikertBar(props) {

	const likert = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

	const qgroup = props.surveyquestiongroup;
	const qid = props.qid
	const [selectedValue, setSelectedValue] = useState(undefined);

	const handleRadioChange = (val) => {
		setSelectedValue(val);
		props.changeCallback(qid, val);
	}

	return (
		<div className="checkboxGroup">
			{likert.map((likertval, j) => {
				return (
					<FormLabel htmlFor={qgroup + "_" + qid + "_" + j}
						key={qgroup + "_" + qid + "_" + j}
						className={selectedValue === j ? "checkboxBtn checkboxBtnChecked" : "checkboxBtn"}>

						<p className="checkboxLbl">{likertval}</p>

						<input className="radio-margin" type="radio"
							name={qgroup + "_" + qid + "_" + j}
							value={j}
							id={qgroup + "_" + qid + "_" + j}
							onChange={(evt) => handleRadioChange(j)}
						/>
					</FormLabel>
				);
			}
			)}
		</div>
	)
}