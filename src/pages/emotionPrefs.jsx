import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from "react-router-dom";
import { post } from '../utils/api-middleware';
import { emotionsDict, studyConditions } from '../utils/constants';
import { ParameterInput } from '../widgets/algocontrols/parameterInput';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton, { FooterButton } from '../widgets/nextButton';


const WarningDialog = (props) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);

	useEffect(() => {
		setShow(props.show);
	}, [props.show]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Finalizing will freeze your current emotion settings.
					<br />
					This action cannot be undone.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="ersCancel" onClick={() => props.confirmCallback('cancel')}>
						Close
					</Button>
					<Button variant="ers" onClick={() => props.confirmCallback('confirm')}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

const Content = (props) => {

	const ratings = useLocation().state.ratings;
	const recommendations = useLocation().state.recommendations;
	const userid = props.user.id;
	const numrec = 20;

	const studyStep = {
		step_name: "Rate Movies",
		step_description: "Rate 10 movies to get recommendations"
	}

	const [movies, setMovies] = useState(recommendations);
	const [isShown, setIsShown] = useState(false);
	const [activeMovie, setActiveMovie] = useState(recommendations[0]);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [emotionToggles, setEmotionToggles] = useState(emotionsDict);
	const [isToggleDone, setIsToggleDone] = useState(false);
	const [selectedMovieid, setSelectedMovieid] = useState(null);
	const [hideInstruction, setHideInstruction] = useState(true);
	const [recCriteria, setRecCriteria] = useState('')
	const [pageData, setPageData] = useState(undefined);
	const [showWarning, setShowWarning] = useState(false);

	const [lastRequestDuration, setLastRequestDuration] = useState(0);

	const [updateParams, setUpdateParams] = useState({
		user_id: userid,
		condition_algo: 1,
		input_type: "discrete",
		emotion_input: Object.keys(emotionsDict).map((key, value) => ({
			emotion: key, weight: 'ignore'})),
		ratings: ratings,
		num_rec: numrec,
		scale_vector: false,
		low_val: -0.3,
		high_val: 0.3,
		algo: 'algo1',
		dist_method: 'euclidean',
		diversity_criterion: 'all',
	});

	useEffect(() => {
		if (Object.values(emotionToggles).some(item => item.length > 0)) {
			const emoinput = Object.keys(emotionToggles).map(
				(key) => ({
					emotion: key,
					weight: emotionToggles[key].length > 0
						? emotionToggles[key] : 'ignore'
				}));
			const emostr = emoinput.map((item) => {
				if (item.weight !== 'ignore') {
					return item.emotion + ':' + item.weight;
				}
				return undefined;
			}).filter((item) => item !== undefined).join('; ');
			setRecCriteria(emostr);

			setUpdateParams(prevState => {
				return {
					...prevState,
					emotion_input: emoinput
				}
			});
		}
	}, [emotionToggles]);

	useEffect(() => {
		const updateRecommendations = () => {
			setLoading(true);
			const timenow = new Date().getTime();
			post('ers/experimental/updaterecommendations/', updateParams)
				.then((response): Promise<movie[]> => response.json())
				.then((movies: movie[]) => {
					setMovies(movies);
					setLoading(false);
					setLastRequestDuration(new Date().getTime() - timenow);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		}
		if (Object.keys(updateParams.emotion_input).length > 0) {
			updateRecommendations(updateParams);
		}
	}, [updateParams]);

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
		setSelectedMovieid(movieid);
		setButtonDisabled(false);
	}

	const resetToggles = () => {
		setEmotionToggles(emotionsDict);
	}

	const finalizeToggles = () => {
		setShowWarning(true);
	}

	const handleWarningDialog = (action) => {
		if (action === 'cancel') {
			setShowWarning(false);
		} else if (action === 'confirm') {
			setShowWarning(false);
			finalizeEmotionPrefs();
		}
	}

	const finalizeEmotionPrefs = () => {
		setIsToggleDone(true);
	}

	const handleNext = () => {

	}

	const infoHandler = () => {
		setHideInstruction(false);
	}

	const updateHandler = (callbackParams) => {
		console.log('updateHandler, callbackParams: ', callbackParams);
		setUpdateParams(prevState => {
			return {
				...prevState,
				...callbackParams
			}
		})
		console.log('updateHandler, updateParams: ', updateParams);
	}

	return (
		<Container>
			<Row>
				{pageData !== undefined ?
					<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
					:
					<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
				}
			</Row>
			<WarningDialog show={showWarning} confirmCallback={handleWarningDialog} />
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						<Row>
							<ParameterInput updateCallback={updateHandler} />
						</Row>
						<Row style={{ marginTop: "18px" }}>
							<p>Last recommendation request took {lastRequestDuration / 1000} seconds</p>
						</Row>
						{props.emoTogglesEnabled &&
							<Row>
								<EmotionToggle onToggle={handleToggle}
									emotions={emotionToggles}
									onReset={resetToggles}
									isDone={isToggleDone}
									onFinalize={finalizeToggles}
									infoCallback={infoHandler}
									defaultLabel={updateParams.condition_algo === 1 ? 'Ignore' : 'Diversify'} />
							</Row>
						}
					</div>
				</Col>
				<Col id="moviePanel">
					{loading ?
						<div className="movieListPanelOverlay" style={{
							position: "absolute", width: "423px",
							height: "690px", zIndex: "999", display: "block", backgroundColor: "rgba(90, 45, 72, 0.8)"
						}}>
							<Spinner animation="border" role="status" style={{ margin: "300px auto", color: "white" }}>
								<span className="sr-only">Loading...</span>
							</Spinner>
						</div>
						:
						<div className="movieListPanelOverlay" style={{ position: "absolute", width: "423px", height: "690px", zIndex: "999", display: "None" }}></div>
					}
					<MovieListPanel id="leftPanel"
						movieList={movies.slice(0, 7)}
						panelTitle={'Recommendations'}
						panelByline={recCriteria}
						byline={emotionToggles}
						render={(props) => <MovieListPanelItem {...props}
							pick={isToggleDone} />}
						hoverHandler={handleHover}
						selectionHandler={handleSelection}
					/>
				</Col>
				<Col id="moviePosterPreview">
					<div className="d-flex mx-auto moviePreviewPanel">
						{isShown && (activeMovie != null) ? (
							<MovieEmotionPreviewPanel movie={activeMovie}
								emoVizEnabled={props.emoVizEnabled} />
						) : (<></>)}
					</div>
				</Col>
			</Row >
			<Row>
				<div className="jumbotron jumbotron-footer">
					{props.emoTogglesEnabled && !isToggleDone ?
						<FooterButton className="toggleFinalizeButton" variant="ersDone"
							onClick={() => finalizeToggles()} text="Back to Rating Page" />
						:
						<NextButton className="nextButton" disabled={buttonDisabled && !loading}
							onClick={handleNext} loading={loading} />
					}
				</div>
			</Row>
		</Container >
	)
}


const EmotionPreferences = (props) => {

	const userdata = useLocation().state.user;

	const condition = userdata.condition;
	const emoVizEnabled = studyConditions[condition].emoVizEnabled;
	const emoTogglesEnabled = studyConditions[condition].emoTogglesEnabled;
	const defaultEmoWeightLabel = studyConditions[condition].defaultEmoWeightLabel;

	return (
		<div>
			<Content
				emoTogglesEnabled={emoTogglesEnabled}
				emoVizEnabled={emoVizEnabled}
				defaultEmoWeightLabel={defaultEmoWeightLabel}
				user={userdata} />
		</div>
	)
}

export default EmotionPreferences;