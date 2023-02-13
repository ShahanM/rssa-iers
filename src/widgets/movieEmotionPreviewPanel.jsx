import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import EmotionStats from "./emotionStats";
import MoviePreviewCard from "./moviePreviewCard";

export default function MovieEmotionPreviewPanel(props) {
	return (
		<Container>
			<Row style={{ height: "300px" }}>
				<MoviePreviewCard movie={props.movie} />
			</Row>
			<hr />
			{props.emoVizEnabled &&
				<Row className="floatLeft">
					<EmotionStats movie={props.movie} />
				</Row>
			}
		</Container>
	)
}