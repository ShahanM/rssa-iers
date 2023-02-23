import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import EmotionStats from "./emotionStats";
import MoviePreviewCard from "./moviePreviewCard";

export default function MovieEmotionPreviewPanel(props) {
	return (
		<Container>
			<Row style={{ height: "300px" }}>
				<div className="moviePreviewPanelOverlay" style={{ position: "absolute", width: "405px", height: "315px", zIndex: "999", display: "None" }}></div>
				<MoviePreviewCard className="moviePreviewCard" movie={props.movie} />
			</Row>
			<hr />
			{props.emoVizEnabled &&
				<Row className="floatLeft">
					<div className="emoVizOverlay" style={{ position: "absolute", width: "390px", height: "230px", zIndex: "999", display: "None" }}></div>
					<EmotionStats movie={props.movie} />
				</Row>
			}
		</Container>
	)
}