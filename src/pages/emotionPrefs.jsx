import { useLocation } from "react-router-dom"
import React, { useEffect } from 'react';
import { Button, Container, ListGroup, ListGroupItem, Spinner } from 
	"react-bootstrap";
import MovieSidePanel from "../widgets/movieSidePanel";
import SidePanelItem from "../widgets/movieSidePanelItem";
import EmotionToggle from "../widgets/emotionToggle";
import EmotionStats from "../widgets/emotionStats";
import EmotionSlider from "../widgets/emotionSlider";
import { API } from '../constants';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Card from "react-bootstrap/Card";

export default function EmotionPreferences(props) {
	let userid = 1;
	const state = useLocation().state;
	const ratings = state.ratings;
	// const movies = state.recommendations;

	const [movies, setMovies] = useState(state.recommendations);
	const [isShown, setIsShown] = useState(false);
	const [activeMovie, setActiveMovie] = useState(null);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [emotionToggles, setEmotionToggles] = useState({
		'Joy': '',
		'Trust': '',
		'Fear': '',
		'Surprise': '',
		'Sadness': '',
		'Disgust': '',
		'Anger': '',
		'Anticipation': ''
	});

	useEffect(() => {
		console.log(emotionToggles);
		if (Object.values(emotionToggles).some(item => item.length > 0)) {
			console.log(emotionToggles);
			const emoinput = Object.keys(emotionToggles).map(
				(key) => ({
					emotion: key, 
					weight: emotionToggles[key].length > 0 ? emotionToggles[key] : 'ignore'
				}));
			updateRecommendations(emoinput);
		}
		// if (Object.values(emotionToggles).some(value => value !== 'ignore')) {
			// console.log('button enabled');
			// updateRecommendations();
		// }
	}, [emotionToggles]);

	const handleHover = (isShown, activeMovie, action, panelid) => {
		setIsShown(isShown);
		setActiveMovie(activeMovie);
	}

	const handleSliderChange = (emotion, event) => {
		console.log(emotion, event.target.value);
	}

	const handleToggle = (emotion, value) => {
		setEmotionToggles(prevState => {
			return {
				...prevState,
				[emotion]: value
			}
		});
	}

	const updateRecommendations = (emoinput) => {
		setLoading(true);
		setButtonDisabled(true);
		console.log(emoinput);
		fetch(API + "ers/updaterecommendations", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*"
			},
			body: JSON.stringify({
				user_id: userid,
				input_type: "discrete",
				emotion_input: emoinput,
				ratings: ratings,
				num_rec: 20
			})
		})
		.then((response): Promise<movie[]> => response.json())
		.then((movies: movie[]) => {
			console.log(movies);
			setMovies(movies);
			setLoading(false);
			setButtonDisabled(false);
		})
		.catch((error) => {
			console.log(error);
			setLoading(false);
			setButtonDisabled(false);
		});
	}

	return (
		<Container>
			<Row>
				<div className="jumbotron">
					<h1 className="header">Refine your recommendations</h1>
					<p>
						Please rate the following recommendations and
						alternative items to help us fine-tune our
						recommendations to you. Please rate all movies, even the
						ones you haven't watched (read the description and then
						guess how you'd rate it.)
					</p>
				</div>
			</Row>
			<Row>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						<div style={{ marginTop: "2rem" }}>
							<p style={{ fontWeight: "800" }}>
								Please inspect the recommendations and adjust 
								them to your preference.
							</p>
							<ol>
								<li>
									<p>
										Among the movies in your system, we 
										predict that you will like these 7 
										movies the best based on your ratings.
									</p>
								</li>
								<li>
									<p>
										You can hover over movies to see a 
										preview of the poster, a short synopsis,
										and a radar graph depicting the movie's 
										emotional feature in 8 emotions: joy, 
										trust, fear, surprise, surprise, 
										sadness, disgust, anger, and 
										anticipation.
									</p>
								</li>
								<li>
									<p>
										You can specify your preference of 
										movies from the perspective of movie 
										emotions in the following panel. Please 
										adjust the emotion strength indicators 
										bellow so we could fine-tune the 
										recommendations for you.
									</p>
								</li>
							</ol>
							<p style={{ fontWeight: "800" }}>
								Adjust the recommendations until they best fit 
								your preferences.
							</p>
						</div>
						<div style={{ marginTop: "4em" }}>
							<EmotionToggle onToggle={handleToggle} emotions={emotionToggles}/>
							{/* <EmotionSlider onSliderChange={handleSliderChange}/> */}
						</div>
						{/* <Button variant="info" onClick={() => sortmovies('anger')}>Anger</Button> */}
						{/* <Button variant="info" onClick={() => sortmovies('joy')}>Joy</Button> */}
					</div>
				</Col>
				<Col id="moviePanel">
					<MovieSidePanel id="leftPanel" 
						movieList={movies.slice(0, 10)}
						panelTitle={'Movies you may like'}
						panelByline={''}
						byline={''}
						render={(props) => <SidePanelItem {...props} />}
						hoverHandler={handleHover}
					/>
				</Col>
				<Col id="moviePosterPreview">
					{isShown && (activeMovie != null) ? (
						<Card bg="light" text="black">
							<Card.Body style={{ height: '900px' }}>
								<Card.Img variant="top" 
									className="d-flex mx-auto d-block 
										img-thumbnail"
									src={activeMovie.poster} 
									alt={"Poster of the movie " +
										activeMovie.title}
									style={{ maxHeight: "36%", minHeight: "36%",
										width: "auto" }} />
								<Card.Title style={{ marginTop: "0.5rem" }}>
									{activeMovie.title}
								</Card.Title>
								<Container className="overflow-auto" 
									style={{ height: "27%" }}>
									<Card.Text>
										{activeMovie.description}
									</Card.Text>
								</Container>
								<EmotionStats movie={activeMovie} />
							</Card.Body>
						</Card>
					) : (<div style={{ height: "900px" }} />)
					}
				</Col>
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer">
					<Button className="next-button footer-btn" 
						variant={buttonDisabled ? 'secondary' : 'primary'} 
						size="lg"
						disabled={buttonDisabled && !loading}
						onClick={''}>
						{!loading ? 'Next'
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
				</div>
			</Row>
		</Container>
	)
}
