import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";

export default function MovieSidePanel(props) {


	const changeRating = (newRating, movieid) => {
		let panelid = props.id;
		props.ratingHandler(panelid, newRating, movieid);
	}

	const onValueChange = (event) => {
		let panelid = props.id;
		let movieid = event.target.value;
		props.selectionHandler(panelid, movieid);
	}

	const onHover = (evt, isShown, activeMovie, action) => {
		let panelid = props.id;
		props.hoverHandler(isShown, activeMovie, action, panelid);
	}

	return (
		<Col id={props.id}>
			<div className="align-items-center justify-content-center"
				style={{
					height: props.byline.length > 0 ? "108px" : "81", padding: "27px 18px",
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
						selectedid: props.selectedid,
						hoverHandler: onHover,
						ratingsHandler: changeRating,
						selectStateHandler: onValueChange
					})
					// <SidePanelItem key={movie.movie_id} movie={movie}
					// 	pick={this.props.pick || false}
					// 	selectedid={this.props.selectedid}
					// 	hoverHandler={this.onHover}
					// 	ratingsHandler={this.changeRating}
					// 	selectStateHandler={this.onValueChange} />
				))}
			</ListGroup>
		</Col>
	)
}