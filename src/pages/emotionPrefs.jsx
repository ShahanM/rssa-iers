import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep, post, put } from '../utils/api-middleware';
import { emotionsDict } from '../utils/constants';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton from '../widgets/nextButton';

export default function EmotionPreferences(props) {

	const userdata = useLocation().state.user;
	const stepid = useLocation().state.step;
	const ratings = useLocation().state.ratings;
	const recommendations = useLocation().state.recommendations;
	const navigate = useNavigate();

	const [movies, setMovies] = useState(recommendations);
	const [isShown, setIsShown] = useState(false);
	const [activeMovie, setActiveMovie] = useState(null);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [emotionToggles, setEmotionToggles] = useState(emotionsDict);

	const [step, setStep] = useState({});
	const [isToggleDone, setIsToggleDone] = useState(false);
	const [selectedMovieid, setSelectedMovieid] = useState(null);

	const [hideInstruction, setHideInstruction] = useState(true);


	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStep(value) });
	}, []);

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
		setSelectedMovieid(movieid);
		setButtonDisabled(false);
	}

	const resetToggles = () => {
		setEmotionToggles(emotionsDict);
	}

	const finalizeToggles = () => {
		console.log('finalizing');
		finalizeEmotionPrefs();
	}

	const finalizeEmotionPrefs = () => {
		const emoinput = Object.keys(emotionToggles).map(
			(key) => ({
				emotion: key,
				weight: emotionToggles[key].length > 0
					? emotionToggles[key] : 'ignore'
			}));
		put('user/' + userdata.id + '/emotionprefs/', emoinput)
			.then((response) => {
				console.log(response);
				setIsToggleDone(true);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const handleNext = () => {
		submitSelection(selectedMovieid);
	}

	const updateRecommendations = (emoinput) => {
		setLoading(true);
		post('ers/updaterecommendations/', {
			user_id: userdata.id,
			input_type: "discrete",
			emotion_input: emoinput,
			ratings: ratings,
			num_rec: 20
		})
			.then((response): Promise<movie[]> => response.json())
			.then((movies: movie[]) => {
				setMovies(movies);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	}

	const submitSelection = (movieid) => {
		setLoading(true);
		put('user/' + userdata.id + '/itemselect/', {
			'user_id': userdata.id,
			'page_id': 4,
			'selected_item': {
				'item_id': movieid,
				'rating': 99
			}
		}).then((response): Promise<value> => response.json())
			.then((selectedItem: value) => {
				if (selectedItem.item_id === parseInt(selectedMovieid) && selectedItem.rating === 99) {
					navigate('/postsurvey',
						{
							state: {
								user: userdata,
								step: step.id
							}
						});
				}
			}).catch((error) => {
				console.log(error);
			});
		setLoading(false);
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron step={step} />
			</Row>
			<Row style={{height: "fit-content"}}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						<Row style={{ marginBottom: "0.25em" }}>
							<Button style={{ textAlign: "left" }}
								variant="secondary" onClick={() => setHideInstruction(!hideInstruction)}>
								{hideInstruction ? '+ Show' : '- Hide'} Instructions
							</Button>
							<div className="instructionsBlock" style={{
								height: hideInstruction ? "0" : "245px",
								margin: "0em 0em 0.5em 0em", backgroundColor: "#e0e0e0", borderRadius: "0.25em"
							}}>
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
						</Row>
						<Row>
							<EmotionToggle onToggle={handleToggle}
								emotions={emotionToggles}
								onReset={resetToggles}
								onFinalize={finalizeToggles} />
						</Row>
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
				<Col id="moviePosterPreview" >
					<div className="d-flex mx-auto moviePreviewPanel">
						{isShown && (activeMovie != null) ? (
							<MovieEmotionPreviewPanel movie={activeMovie} />
						) : (<></>)}
					</div>
				</Col>
			</Row >
			<Row>
				<div className="jumbotron jumbotron-footer">
					<NextButton disabled={buttonDisabled && !loading}
						onClick={handleNext} loading={loading} />
				</div>
			</Row>
		</Container >
	)
}
