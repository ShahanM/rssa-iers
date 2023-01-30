import { useState } from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

export default function MovieListPanel(props) {

	const [selectedid, setSelectedid] = useState(props.selectedid);

	const changeRating = (newRating, movieid) => {
		let panelid = props.id;
		props.ratingHandler(panelid, newRating, movieid);
	}

	const onValueChange = (movieid) => {
		props.selectionHandler(movieid);
		setSelectedid(movieid);
	}

	const onHover = (evt, isShown, activeMovie, action) => {
		let panelid = props.id;
		props.hoverHandler(isShown, activeMovie, action, panelid);
	}

	return (
		<Col id={props.id}>
			<div className="align-items-center justify-content-center"
				style={{
					height: props.byline.length > 0 ? "108px" : "81", padding: "9px 18px",
					textAlign: "center", borderRadius: "0.3rem 0.3rem 0 0",
					backgroundColor: "#e9ecef"
				}}>
				<h5>{props.panelTitle}</h5>
				{props.byline.length > 0 ?
					<p style={{ textAlign: "left", fontSize: "14px" }}>
						{props.panelByline}
					</p>
					: ''
				}
			</div>
			<ListGroup as="ul">
				{props.movieList.map((movie) => (
					props.render({
						key: movie.movie_id,
						movie: movie,
						selectedid: selectedid,
						hoverHandler: onHover,
						ratingsHandler: changeRating,
						selectionHandler: onValueChange
					})
				))}
			</ListGroup>
		</Col>
	)
}