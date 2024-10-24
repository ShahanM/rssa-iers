import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { imgurl } from '../utils/api-middleware';
import { useEffect, useState } from 'react';

export default function MoviePreviewCard(props) {

	const [movie, setMovie] = useState(props.movie);
	useEffect(() => { setMovie(props.movie); }, [props.movie]);

	return (
		<Container className={props.className}>
			<Row>
				<Col>
					<div className="movie-preview-card-image">
						<Image src={movie.poster}
							alt={"Post of the movie " + movie.title}
							variant="left"
							className="d-flex mx-auto d-block img-thumbnail" />
					</div>
				</Col>
				<Col>
					<Row>
						<h5 style={{ textAlign: "left" }}>{props.movie.title} ({movie.year})</h5>
					</Row>
					<Row style={{ height: "216px", overflowY: "scroll" }}>
						<p style={{ textAlign: "left" }}>
							{props.movie.description}
						</p>
					</Row>
				</Col>
			</Row>
		</Container >
	)
} 