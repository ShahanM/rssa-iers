import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

export default function MoviePreviewCard(props) {
	return (
		<Container>
			<Row>
				<Col>
					<div className="movie-preview-card-image">
						<Image src={props.movie.poster} alt={"Post of the movie " + props.movie.title}
							variant="left"
							className="d-flex mx-auto d-block 
						img-thumbnail"
							style={{
								maxHeight: "36%", minHeight: "36%",
								width: "auto"
							}} />
					</div>
				</Col>
				<Col>
					<Row>
						<h5 style={{ textAlign: "left" }}>{props.movie.title}</h5>
					</Row>
					<Row>
						<p style={{ textAlign: "left" }}>
							{props.movie.description}
						</p>
					</Row>
				</Col>
			</Row>
		</Container >
	)
} 