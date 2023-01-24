export default function HeaderJumbotron(props) {
	return (
		<div className="jumbotron">
			<h1 className="header">{props.step.step_name}</h1>
			<p>{props.step.step_description}</p>
		</div>
	)
}