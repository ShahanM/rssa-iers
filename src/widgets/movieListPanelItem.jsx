import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";


export default function MovieListPanelItem(props) {

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
				<p style={{ marginBottom: "0", marginTop: "0.25rem", textAlign: "left", marginLeft: "0.5em" }}>
					{props.movie.title + " (" + props.movie.year + ")"}
				</p>
			</div>
			{props.pick ?
				<div>
					{props.movie.movie_id === props.selectedid ?
						<Button variant="ersDone">Selected</Button>
						:
						<Button variant="ers" onClick={() => props.selectionHandler(props.movie.movie_id)}>Select</Button>
					}
				</div>
				: ''}
		</ListGroup.Item>
	)
}