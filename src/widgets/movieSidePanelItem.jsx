import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";


export default function SidePanelItem(props) {

	return (
		<ListGroup.Item as="div"
			className={"d-flex justify-content-between align-items-center"}
			onMouseEnter={(evt) => props.hoverHandler(evt, true, props.movie, "enter")}
		>
			<div>
				<Image className="sidePanelThumbnail" src={props.movie.poster} />
			</div>
			<div style={{
				position: "relative", boxSizing: "border-box", width: "87%",
				display: "inline-block", verticalAlign: "middle"
			}}>
				<p style={{ marginBottom: "0", marginTop: "0.25rem" }}>
					{props.movie.title + " (" + props.movie.year + ")"}
				</p>
			</div>
			{props.pick ?
			<div>
				<Button variant="outline-primary">Select</Button>
			</div>
			: ''}
		</ListGroup.Item>
	)
}