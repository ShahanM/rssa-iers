import React, { useEffect, useState } from 'react';
import { Button, Container, Spinner } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from '../constants';
import EmotionStats from "../widgets/emotionStats";
import EmotionToggle from "../widgets/emotionToggle";
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";

export default function EmotionPreferences(props) {
	let userid = 1;
	const state = useLocation().state;
	const ratings = state.ratings;

	const [movies, setMovies] = useState(state.recommendations);
	const [isShown, setIsShown] = useState(false);
	const [activeMovie, setActiveMovie] = useState(null);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [emotionToggles, setEmotionToggles] = useState({
		'Joy': 'ignore',
		'Trust': 'ignore',
		'Fear': 'ignore',
		'Surprise': 'ignore',
		'Sadness': 'ignore',
		'Disgust': 'ignore',
		'Anger': 'ignore',
		'Anticipation': 'ignore'
	});
	const [isToggleDone, setIsToggleDone] = useState(false);
	// const [isSelectionDone, setIsSelectionDone] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (Object.values(emotionToggles).some(item => item.length > 0)) {
			const emoinput = Object.keys(emotionToggles).map(
				(key) => ({
					emotion: key,
					weight: emotionToggles[key].length > 0 
						? emotionToggles[key] : 'ignore'
				}));
			updateRecommendations(emoinput);
		}
	}, [emotionToggles]);

	const handleHover = (isShown, activeMovie, action, panelid) => {
		setIsShown(isShown);
		setActiveMovie(activeMovie);
	}

	const handleToggle = (emotion, value) => {
		setEmotionToggles(prevState => {
			return {
				...prevState,
				[emotion]: value
			}
		});
	}

	const handleSelection = (movieid) => {
		console.log('selected movie: ' + movieid);
		// setIsSelectionDone(true);
		setButtonDisabled(false);
	}

	const resetToggles = () => {
		setEmotionToggles({
			'Joy': 'ignore',
			'Trust': 'ignore',
			'Fear': 'ignore',
			'Surprise': 'ignore',
			'Sadness': 'ignore',
			'Disgust': 'ignore',
			'Anger': 'ignore',
			'Anticipation': 'ignore'
		});
	}

	const finalizeToggles = () => {
		console.log('finalizing');
		setIsToggleDone(true);
	}

	const handleNext = () => {
		navigate('/selection',
			{
				state: {
					finalrecommendations: movies
				}
			});
	}

	const updateRecommendations = (emoinput) => {
		setLoading(true);
		// setButtonDisabled(true);
		console.log(emoinput);
		console.log(API + 'ers/updaterecommendations');
		fetch(API + 'ers/updaterecommendations/', {
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
				// setButtonDisabled(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				// setButtonDisabled(false);
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
						<div style={{ marginTop: "4em" }}>
							<EmotionToggle onToggle={handleToggle}
								emotions={emotionToggles}
								onReset={resetToggles}
								onFinalize={finalizeToggles} />
							{/* <EmotionSlider onSliderChange={handleSliderChange}/> */}
						</div>
						{/* <Button variant="info" onClick={() => sortmovies('anger')}>Anger</Button> */}
						{/* <Button variant="info" onClick={() => sortmovies('joy')}>Joy</Button> */}
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
					</div>

				</Col>
				<Col id="moviePanel">
					<MovieListPanel id="leftPanel"
						movieList={movies.slice(0, 7)}
						panelTitle={'Movies you may like'}
						panelByline={''}
						byline={''}
						render={(props) => <MovieListPanelItem {...props} 
							pick={isToggleDone} />}
						hoverHandler={handleHover}
						selectionHandler={handleSelection}
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
									style={{
										maxHeight: "36%", minHeight: "36%",
										width: "auto"
									}} />
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
						variant="ers"
						size="lg"
						disabled={buttonDisabled && !loading}
						onClick={handleNext}>
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
