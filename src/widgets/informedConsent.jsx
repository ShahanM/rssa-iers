import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function InformedConsentModal(props) {

	const [isConsentGiven, setIsConsentGiven] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleConsent = (e) => {
		setIsLoading(true);
		props.consentCallback(isConsentGiven);
	}

	return (

		< Modal show={props.show} dialogClassName="modal-80w" style={{ zIndex: "2050" }
		}>
			<Modal.Header>
				<Modal.Title>Consent: taking part in the study</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p style={{ marginBottom: "0" }}><strong>Voluntary Consent</strong></p>
				<p>
					Participation is voluntary, and you have the option to not participate.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Participation Time</strong></p>
				<p>
					It will take you about 15 to 20 minutes to be this study.
				</p>
				<p style={{ marginBottom: "0" }}><strong>Risks and discomforts</strong></p>
				<p>
					We do not know of any risks or discomforts to you in this research study.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Possible Benefits</strong></p>
				<p>
					This study will help create technology that will help users leverage
					recommendations to explore, learn, and develop their unique personal
					preferences.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Incentives</strong></p>
				<p>
					You must complete all step in the study to get a compensation of $2.75.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Protection of Privacy and Confidentiality</strong></p>
				<p>
					The results of this study may be published in scientific journals, professional
					publications, or educational presentations.
					<br /><br />
					The information collected during the study could be used for future research
					studies or distributed to another investigator for future research studies
					without additional informed consent from the participants or legally
					authorized representative. No identifiable information will be collected during
					the study.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Contact Information</strong></p>
				<p>
					If you have any questions or concerns about your rights in this research study,
					please contact the Clemson University Office of Research Compliance (ORC) at
					864-656-0636 or <a href="mailto:irb@clemson.edu">irb@clemson.edu</a>. If you are
					outside of the Upstate South Carolina area, please use the ORC's toll-free number,
					866-297-3071. The Clemson IRB will not be able to answer some study-specific
					questions. However, you may contact the Clemson IRB if the research staff cannot
					be reached or if you wish to speak with someone other than the research staff.
					If you have any study related questions or if any problem arise, please contact
					Sushmita Khan at <a href="mailto:<lijieg>@clemson.edu">&lt;lijieg&gt;@clemson.edu</a>.
				</p>

				<p style={{ marginBottom: "0" }}><strong>Consent</strong></p>
				<p>
					By participation in the study, you indicate that you have read the information
					wirtten abovem been allowed to ask any questions, and you are voluntarily
					choosing to take part in this research. You do not give up any legal rights by
					taking part in this research study.
				</p>
				<Form.Check
					label="I have read and understand this study and my rights above. My participation in this
                            study is voluntary. I voluntarily agree to participate in this research study."
					onChange={(evt) => setIsConsentGiven(evt.target.checked)}
					default={false} />

			</Modal.Body>
			<Modal.Footer>
				<Link to="/quit">
					<Button variant="ersCancel">
						Exit
					</Button>
				</Link>
				<Button variant="ers" disabled={!isConsentGiven || isLoading}
					onClick={(e) => handleConsent(e)}>
					{!isLoading ? 'Continue'
						:
						<>
							<Spinner
								as="span"
								animation="grow"
								size="sm"
								role="status"
								aria-hidden="true"
							/>
							Loading...
						</>
					}
				</Button>
			</Modal.Footer>
		</Modal >

	)
}