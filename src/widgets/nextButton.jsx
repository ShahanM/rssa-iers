import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function NextButton(props) {

	return (
		<Button variant="ers" size="lg" className="nextButton footer-btn"
			disabled={props.disabled} onClick={props.onClick}>
			{!props.loading ? 'Next'
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
	)
}

export const FooterButton = (props) => {
	return (
		<Button variant="ers" size="lg" className={props.className + " nextButton footer-btn"}
			disabled={props.disabled} onClick={props.onClick}>
			{!props.loading ? props.text
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
	)
}