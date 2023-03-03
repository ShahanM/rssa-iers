import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
// import { ShepherdTour } from 'react-shepherd';
// import Shepherd from 'shepherd.js';
import { get, post, put } from '../utils/api-middleware';
import { emotionsDict, studyConditions } from '../utils/constants';
import Spinner from 'react-bootstrap/Spinner';
// import {
// emoFinalizeStep, emoPrefDone, emoPrefSelectStep, emoPrefSteps,
// emoToggleSteps, emoVizSteps, moviePreviewStep, movieSelectStep,
// recommendationInspectionSteps, tourOptions
// } from '../utils/onboarding';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
// import { InstructionModal } from '../widgets/instructionModal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton, { FooterButton } from '../widgets/nextButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


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

	const [conditionAlgo, setConditionAlgo] = useState(1);
	const [itemPoolCount, setItemPoolCount] = useState(200);
	const [divCount, setDivCount] = useState(50);
	const [scaleVector, setScaleVector] = useState(false);
	const [lowval, setLowval] = useState(0.3);
	const [highval, setHighval] = useState(0.8);
	const [algoExperiment, setAlgoExperiment] = useState(1);

	const [lastRequestDuration, setLastRequestDuration] = useState(0);

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

	// const getStepPage = (studyid, stepid, pageid) => {
	// 	let path = '';
	// 	if (pageid !== null) {
	// 		path = 'study/' + studyid + '/step/' + stepid + '/page/' + pageid + '/next';
	// 	} else {
	// 		path = 'study/' + studyid + '/step/' + stepid + '/page/first/';
	// 	}
	// 	get(path)
	// 		.then((response): Promise<page> => response.json())
	// 		.then((page: page) => {
	// 			setPageData(page);
	// 		})
	// 		.catch((error) => console.log(error));

	// }

	// useEffect(() => {
	// 	if (Object.keys(props.studyStep).length > 0) {
	// 		getStepPage(props.user.study_id, props.studyStep.id, null);
	// 	}
	// }, [props.studyStep]);

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
		setIsToggleDone(true);
		// put('user/' + props.user.id + '/emotionprefs/', emoinput)
		// 	.then((response) => {
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
		// getStepPage(props.user.study_id, props.studyStep.id, pageData.id);
		// props.onboardingCallback(true, movies);
	}

	const handleNext = () => {
		// submitSelection(selectedMovieid);
	}

	const algoExpMap = {
		1: 'algo1',
		2: 'algo2',
		3: 'algo3'
	}
	const updateRecommendations = (emoinput) => {
		setLoading(true);
		const timenow = new Date().getTime();
		post('ers/experimental/updaterecommendations/', {
			user_id: props.user.id,
			condition_algo: conditionAlgo,
			input_type: "discrete",
			emotion_input: emoinput,
			ratings: ratings,
			num_rec: 20,
			scale_vector: scaleVector,
			lowval: lowval,
			highval: highval,
			algo: algoExpMap[algoExperiment]

		})
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

	// const submitSelection = (movieid) => {
	// 	setLoading(true);
	// 	put('user/' + props.user.id + '/itemselect/', {
	// 		'user_id': props.user.id,
	// 		'page_id': props.studyStep.id,
	// 		'selected_item': {
	// 			'item_id': movieid,
	// 			'rating': 99
	// 		}
	// 	}).then((response): Promise<value> => response.json())
	// 		.then((selectedItem: value) => {
	// 			if (selectedItem.item_id === parseInt(selectedMovieid) && selectedItem.rating === 99) {
	// 				props.nagivationCallback(props.user, props.studyStep);
	// 			}
	// 		}).catch((error) => {
	// 			console.log(error);
	// 		});
	// 	setLoading(false);
	// }

	const infoHandler = () => {
		setHideInstruction(false);
	}

	const handleLowValInput = (event) => {
		setLowval(event.target.value);
	}

	const handleHighValInput = (event) => {
		setHighval(event.target.value);
	}

	const handleAlgoSelect = (event) => {
		const algo = parseInt(event.target.value);
		if (algo === 1 && algoExperiment === 3) {
			setAlgoExperiment(1);
		} else if (algo === 2 && algoExperiment === 1) {
			setAlgoExperiment(2);
		}

		setConditionAlgo(algo);
	}

	const handleItemPoolCount = (event) => {
		setItemPoolCount(event.target.value);
	}

	const handleDivCount = (event) => {
		setDivCount(event.target.value);
	}

	const handleAlgoExperiment = (event) => {
		const algo = parseInt(event.target.value);
		setAlgoExperiment(algo);
	}

	const handleScaleValue = (event) => {
		const scale = parseInt(event.target.value);
		if (scale === 1) {
			setScaleVector(true);
		} else {
			setScaleVector(false);
		}
	}

	const handleUpdate = () => {
		const emoinput = Object.keys(emotionToggles).map(
			(key) => ({
				emotion: key,
				weight: emotionToggles[key].length > 0
					? emotionToggles[key] : 'ignore'
			}));
		updateRecommendations(emoinput);
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
			{/* <InstructionModal show={!hideInstruction} onHide={() => setHideInstruction(true)} /> */}
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						<Row>
							<InputGroup className="mb-3"
							>
								<InputGroup.Text id="inputGroup-sizing-sm">
									Algo Condition
								</InputGroup.Text>
								<Form.Select aria-label="Algo Condition"
									onChange={handleAlgoSelect}
									value={conditionAlgo}>
									<option value="1" >
										TopN
									</option>
									<option value="2" >
										DiverseN
									</option>
								</Form.Select>
							</InputGroup>
							<InputGroup className="mb-3"
								onChange={handleItemPoolCount}>
								<InputGroup.Text id="inputGroup-sizing-sm">
									Item Pool Count
								</InputGroup.Text>
								<Form.Control
									placeholder={itemPoolCount}
									aria-label="itempoolcount"
									aria-describedby="inputGroup-sizing-sm"
								/>
							</InputGroup>
							{conditionAlgo === 2 &&
								<InputGroup className="mb-3"
									onChange={handleDivCount}>
									<InputGroup.Text id="inputGroup-sizing-sm">
										Diversity Sampling Count
									</InputGroup.Text>
									<Form.Control
										placeholder={divCount}
										aria-label="diversitysamplingcount"
										aria-describedby="inputGroup-sizing-sm"
									/>
								</InputGroup>
							}
							<InputGroup className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">
									Ranking Strategy
								</InputGroup.Text>
								<Form.Select aria-label="Algo Experiment"
									onChange={handleAlgoExperiment}
									value={algoExperiment}>
									{conditionAlgo === 1 &&
										<option value="1">
											Emotion Distance
										</option>
									}
									{conditionAlgo === 2 &&
										<option value="2">
											Diversify on unspecified
										</option>
									}
									<option value="3" >
										Weighted Ranking
									</option>
								</Form.Select>
							</InputGroup>
							<InputGroup className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">
									Enable Scale Value
								</InputGroup.Text>
								<Form.Select aria-label="Scale Value"
									onChange={handleScaleValue}
									value={scaleVector ? 1 : 2}>
									<option value="1">
										Yes
									</option>
									<option value="2" >
										No
									</option>
								</Form.Select>
							</InputGroup>
							<InputGroup className="mb-3" type="number"
								onChange={handleLowValInput}>
								<InputGroup.Text id="inputGroup-sizing-sm">
									Low Value
								</InputGroup.Text>
								<Form.Control
									placeholder={lowval}
									aria-label="lowval"
									aria-describedby="inputGroup-sizing-sm"
								/>
							</InputGroup>
							<InputGroup className="mb-3"
								onChange={handleHighValInput}
								default={highval}>
								<InputGroup.Text id="inputGroup-sizing-default">
									High Value
								</InputGroup.Text>
								<Form.Control
									placeholder={highval}
									aria-label="highval"
									aria-describedby="inputGroup-sizing-default"
								/>
							</InputGroup>
							<Button variant="ers" onClick={handleUpdate}>
								Update
							</Button>
						</Row>
						<Row style={{marginTop: "18px"}}>
							<p>Last recommendation request took {lastRequestDuration/1000} seconds</p>
						</Row>
						{props.emoTogglesEnabled &&
							<Row>
								<EmotionToggle onToggle={handleToggle}
									emotions={emotionToggles}
									onReset={resetToggles}
									isDone={isToggleDone}
									onFinalize={finalizeToggles}
									infoCallback={infoHandler}
									defaultLabel={conditionAlgo === 1? 'Ignore' : 'Diversify'} />
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
	// const stepid = useLocation().state.studyStep;

	const navigate = useNavigate();
	// const tour = useRef();
	// tour.current = new Shepherd.Tour(tourOptions);

	// const [studyStep, setStudyStep] = useState({});
	const condition = userdata.condition;
	const emoVizEnabled = studyConditions[condition].emoVizEnabled;
	const emoTogglesEnabled = studyConditions[condition].emoTogglesEnabled;
	const defaultEmoWeightLabel = studyConditions[condition].defaultEmoWeightLabel;

	// useEffect(() => {
	// getNextStudyStep(userdata.study_id, stepid)
	// 	.then((value) => {
	// 		setStudyStep(value);

	// 	});
	// tour.current.addSteps(emoPrefSteps(tour.current));
	// tour.current.addSteps(recommendationInspectionSteps(tour.current));
	// tour.current.addSteps(moviePreviewStep(tour.current));
	// if (emoVizEnabled) {
	// tour.current.addSteps(
	// emoVizSteps(tour.current)
	// );
	// }
	// if (emoTogglesEnabled) {
	// tour.current.addSteps(
	// emoToggleSteps(tour.current)
	// );
	// tour.current.addSteps(
	// emoFinalizeStep(tour.current));
	// }
	// tour.current.start();

	// return () => {
	// Shepherd.activeTour && Shepherd.activeTour.cancel();
	// }
	// }, []);

	// const handleSelectionOnboarding = (isSelectionStep, movies) => {
	// if (isSelectionStep) {
	// Shepherd.activeTour && Shepherd.activeTour.cancel();
	// tour.current = new Shepherd.Tour(tourOptions);
	// tour.current.addSteps(emoPrefSelectStep(tour.current));
	// tour.current.addSteps(recommendationInspectionSteps(tour.current));
	// tour.current.addSteps(movieSelectStep(tour.current, movies[0].movie_id));
	// tour.current.addSteps(emoPrefDone(tour.current));
	// tour.current.start();
	// }
	// }

	// function navigateHandler(userdata, studyStep) {
	// 	navigate(props.next,
	// 		{
	// 			state: {
	// 				user: userdata,
	// 				studyStep: studyStep.id
	// 			}
	// 		});
	// }

	return (
		<div>
			<Content
				// nagivationCallback={navigateHandler}
				emoTogglesEnabled={emoTogglesEnabled}
				emoVizEnabled={emoVizEnabled}
				defaultEmoWeightLabel={defaultEmoWeightLabel}
				// onboardingCallback={handleSelectionOnboarding}
				// studyStep={studyStep} 
				user={userdata} />
			{/* <ShepherdTour tour={tour.current} steps={[]} /> */}
		</div>
	)
}

export default EmotionPreferences;