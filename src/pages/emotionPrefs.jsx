import React, { useEffect, useRef, useState } from 'react';
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { ShepherdTour } from 'react-shepherd';
import Shepherd from 'shepherd.js';
import { get, getNextStudyStep, post, put } from '../utils/api-middleware';
import { emotionsDict, studyConditions } from '../utils/constants';
import {
	emoFinalizeStep, emoPrefDone, emoPrefSelectStep, emoPrefSteps,
	emoToggleSteps, emoVizSteps, moviePreviewStep, movieSelectStep,
	recommendationInspectionSteps, tourOptions
} from '../utils/onboarding';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import { InstructionModal } from '../widgets/instructionModal';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton, { FooterButton } from '../widgets/nextButton';


const WarningDialog = (props) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);

	useEffect(() => {
		if (props.show) {
			setShow(true);
		} else {
			setShow(false);
		}
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

	useEffect(() => {
		if (!props.emoTogglesEnabled) {
			setIsToggleDone(true);
		}
	}, []);


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
			updateRecommendations(emoinput);
		}
	}, [emotionToggles]);

	const getStepPage = (studyid, stepid, pageid) => {
		let path = '';
		if (pageid !== null) {
			path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
		} else {
			path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
		}
		get(path)
			.then((response): Promise<page> => response.json())
			.then((page: page) => {
				setPageData(page);
			})
			.catch((error) => console.log(error));

	}

	useEffect(() => {
		if (Object.keys(props.studyStep).length > 0) {
			getStepPage(props.user.study_id, props.studyStep.id, null);
		}
	}, [props.studyStep]);

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
		// finalizeEmotionPrefs();
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
		const emoinput = Object.keys(emotionToggles).map(
			(key) => ({
				emotion: key,
				weight: emotionToggles[key].length > 0
					? emotionToggles[key] : 'ignore'
			}));
		put('user/' + props.user.id + '/emotionprefs/', emoinput)
			.then((response) => {
				setIsToggleDone(true);
			})
			.catch((error) => {
				console.log(error);
			});
		getStepPage(props.user.study_id, props.studyStep.id, pageData.id);
		props.onboardingCallback(true, movies);
	}

	const handleNext = () => {
		submitSelection(selectedMovieid);
	}

	const updateRecommendations = (emoinput) => {
		setLoading(true);
		post('ers/updaterecommendations/', {
			user_id: props.user.id,
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
		put('user/' + props.user.id + '/itemselect/', {
			'user_id': props.user.id,
			'page_id': props.studyStep.id,
			'selected_item': {
				'item_id': movieid,
				'rating': 99
			}
		}).then((response): Promise<value> => response.json())
			.then((selectedItem: value) => {
				if (selectedItem.item_id === parseInt(selectedMovieid) && selectedItem.rating === 99) {
					props.nagivationCallback(props.user, props.studyStep);
				}
			}).catch((error) => {
				console.log(error);
			});
		setLoading(false);
	}

	const infoHandler = () => {
		setHideInstruction(false);
	}

	return (
		<Container>
			<Row>
				{pageData !== undefined ?
					<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
					:
					<HeaderJumbotron title={props.studyStep.step_name} content={props.studyStep.step_description} />
				}
			</Row>
			<WarningDialog show={showWarning} confirmCallback={handleWarningDialog} />
			<InstructionModal show={!hideInstruction} onHide={() => setHideInstruction(true)} />
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						{props.emoTogglesEnabled &&
							<Row>
								<EmotionToggle onToggle={handleToggle}
									emotions={emotionToggles}
									onReset={resetToggles}
									isDone={isToggleDone}
									onFinalize={finalizeToggles} infoCallback={infoHandler} />
							</Row>
						}
					</div>

				</Col>
				<Col id="moviePanel">
					<div className="movieListPanelOverlay" style={{ position: "absolute", width: "423px", height: "690px", zIndex: "999", display: "None" }}></div>
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
							onClick={() => finalizeToggles()} text="Finalize" />
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
	const stepid = useLocation().state.studyStep;

	const navigate = useNavigate();
	const tour = useRef();
	tour.current = new Shepherd.Tour(tourOptions);

	const [studyStep, setStudyStep] = useState({});
	const condition = 1; // TODO: get condition from backend
	const emoVizEnabled = studyConditions[condition].emoVizEnabled;
	const emoTogglesEnabled = studyConditions[condition].emoTogglesEnabled;

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => {
				setStudyStep(value);

			});
		tour.current.addSteps(emoPrefSteps(tour.current));
		tour.current.addSteps(recommendationInspectionSteps(tour.current));
		tour.current.addSteps(moviePreviewStep(tour.current));
		if (emoVizEnabled) {
			tour.current.addSteps(
				emoVizSteps(tour.current)
			);
		}
		if (emoTogglesEnabled) {
			tour.current.addSteps(
				emoToggleSteps(tour.current)
			);
			tour.current.addSteps(
				emoFinalizeStep(tour.current));
		}
		tour.current.start();
	}, []);

	const handleSelectionOnboarding = (isSelectionStep, movies) => {
		if (isSelectionStep) {
			tour.current = new Shepherd.Tour(tourOptions);
			tour.current.addSteps(emoPrefSelectStep(tour.current));
			tour.current.addSteps(recommendationInspectionSteps(tour.current));
			tour.current.addSteps(movieSelectStep(tour.current, movies[0].movie_id));
			tour.current.addSteps(emoPrefDone(tour.current));
			tour.current.start();
		}
	}

	function navigateHandler(userdata, studyStep) {
		navigate(props.next,
			{
				state: {
					user: userdata,
					studyStep: studyStep.id
				}
			});
	}

	return (
		<div>
			<Content nagivationCallback={navigateHandler}
				emoTogglesEnabled={emoTogglesEnabled}
				emoVizEnabled={emoVizEnabled}
				onboardingCallback={handleSelectionOnboarding}
				studyStep={studyStep} user={userdata} />
			<ShepherdTour tour={tour.current} steps={[]} />
		</div>
	)
}

export default EmotionPreferences;