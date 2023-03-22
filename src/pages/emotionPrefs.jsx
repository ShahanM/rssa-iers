import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShepherdTour } from 'react-shepherd';
import Shepherd from 'shepherd.js';
import "shepherd.js/dist/css/shepherd.css";
import { get, getNextStudyStep, post, put } from '../utils/api-middleware';
import { emotionsDict, studyConditions } from '../utils/constants';
import { LoadingScreen } from '../utils/loadingScreen';
import {
	emoFinalizeStep, emoPrefDone, emoPrefSelectStep, emoPrefSteps,
	emoToggleSteps, emoVizSteps, moviePreviewStep, movieSelectStep,
	recommendationInspectionSteps, resommendationSelectionInspection,
	tourOptions
} from '../utils/onboarding';
import { InstructionModal } from '../widgets/dialogs/instructionModal';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieEmotionPreviewPanel from '../widgets/movieEmotionPreviewPanel';
import MovieListPanel from "../widgets/movieListPanel";
import MovieListPanelItem from "../widgets/movieListPanelItem";
import NextButton, { FooterButton } from '../widgets/nextButton';

import { WarningDialog } from '../widgets/dialogs/warningDialog';


const PageHeader = (props) => {

	const [pageData, setPageData] = useState(props.pageData);
	const [studyStep, setStudyStep] = useState(props.stepData);

	useEffect(() => { setPageData(props.pageData) }, [props.pageData]);
	useEffect(() => { setStudyStep(props.stepData) }, [props.stepData]);

	return (
		<Row>
			{pageData !== undefined ?
				<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
				:
				<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
			}
		</Row >
	)
}

const Content = (props) => {


	const condition = props.user.condition;
	const emoVizEnabled = studyConditions[condition].emoVizEnabled;
	const emoTogglesEnabled = studyConditions[condition].emoTogglesEnabled;
	const defaultEmoWeightLabel = studyConditions[condition].defaultEmoWeightLabel;
	const ratings = useLocation().state.ratings;
	const recommendations = useLocation().state.recommendations;

	const [movies, setMovies] = useState(recommendations);
	const [isShown, setIsShown] = useState(true);
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

	const tour = useRef();
	tour.current = new Shepherd.Tour(tourOptions);

	function init_emo_tour() {
		tour.current.addStep(emoPrefSteps(tour.current));
		tour.current.addStep(recommendationInspectionSteps(tour.current));
		tour.current.addStep(moviePreviewStep(tour.current));
		if (emoVizEnabled) {
			tour.current.addStep(
				emoVizSteps(tour.current)
			);
		}
		tour.current.addSteps(
			emoToggleSteps(tour.current, defaultEmoWeightLabel === 'Diversify')
		);
		tour.current.addStep(
			emoFinalizeStep(tour.current));
	}

	function init_selection_tour() {
		// FIXME: this is a duplicated code.
		// split this into two parts: inro and the final step

		// if (selectButton) {
		tour.current.addStep(emoPrefSelectStep(tour.current));
		tour.current.addStep(resommendationSelectionInspection(tour.current));
		tour.current.addStep(moviePreviewStep(tour.current));
		if (emoVizEnabled) {
			tour.current.addStep(
				emoVizSteps(tour.current)
			);
		}
		tour.current.addStep(movieSelectStep(tour.current, recommendations[0].movie_id));
		tour.current.addStep(emoPrefDone(tour.current));
	}

	const handleSelectionOnboarding = (isSelectionStep, movies) => {
		if (isSelectionStep) {
			Shepherd.activeTour && Shepherd.activeTour.cancel();
			tour.current = new Shepherd.Tour(tourOptions);
			tour.current.addStep(emoPrefSelectStep(tour.current));
			tour.current.addStep(resommendationSelectionInspection(tour.current));
			tour.current.addStep(movieSelectStep(tour.current, movies[0].movie_id));
			tour.current.addStep(emoPrefDone(tour.current));
			tour.current.start();
		}
	}

	useEffect(() => {
		if (!emoTogglesEnabled) {
			setIsToggleDone(true);
		}
		if (emoTogglesEnabled) {
			init_emo_tour();
		} else {
			init_selection_tour();
		}
		tour.current.start();
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
	}

	const confirmWarning = () => {
		setShowWarning(false);
		finalizeEmotionPrefs();
	}

	const cancelWarning = () => {
		setShowWarning(false);
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
		const emopanel = document.getElementById('emotionPanel');
		emopanel.style.opacity = '0.5';
		getStepPage(props.user.study_id, props.studyStep.id, pageData.id);
		handleSelectionOnboarding(true, movies);
	}

	const handleNext = () => {
		submitSelection(selectedMovieid);
	}

	const updateRecommendations = (emoinput) => {
		setLoading(true);
		const topmovie = movies[0];
		post('ers/updaterecommendations/', {
			user_id: props.user.id,
			user_condition: props.user.condition,
			input_type: "discrete",
			emotion_input: emoinput,
			ratings: ratings,
			num_rec: 20
		})
			.then((response): Promise<movie[]> => response.json())
			.then((movies: movie[]) => {
				setMovies(movies);
				if (topmovie.movie_id !== movies[0].movie_id)
					setActiveMovie(movies[0]);
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
		// setHideInstruction(false);
		Shepherd.activeTour && Shepherd.activeTour.current.cancel();
		init_emo_tour();
		tour.current.start();
	}

	return (
		<Container>
			<PageHeader pageData={pageData} stepData={props.studyStep} />
			<WarningDialog show={showWarning} title={"Are you sure?"}
				message={`Finalizing will freeze your current emotion settings. 
					<br />
					This action cannot be undone.`}
				confirmCallback={confirmWarning}
				confirmText={"Confirm"}
				cancelCallback={cancelWarning} />
			<InstructionModal show={!hideInstruction} onHide={() => setHideInstruction(true)} />
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						{emoTogglesEnabled &&
							<Row>
								<EmotionToggle onToggle={handleToggle}
									emotions={emotionToggles}
									onReset={resetToggles}
									isDone={isToggleDone}
									onFinalize={finalizeToggles}
									infoCallback={infoHandler}
									defaultLabel={defaultEmoWeightLabel} />
							</Row>
						}
					</div>
				</Col>
				<Col id="moviePanel">
					{loading ?
						<div className="movieListPanelOverlay" style={{
							position: "absolute", width: "415px", marginTop: "120px",
							height: "100%", borderRadius: "5px",
							zIndex: "999", display: "block", backgroundColor: "rgba(72, 72, 72, 0.8)"
						}}>
							<Spinner animation="border" role="status" style={{ margin: "300px auto", color: "white" }}>
								<span className="sr-only">Loading...</span>
							</Spinner>
						</div>
						: ""}
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
								emoVizEnabled={emoVizEnabled} />
						) : (<></>)}
					</div>
				</Col>
			</Row >
			<Row>
				<div className="jumbotron jumbotron-footer">
					{emoTogglesEnabled && !isToggleDone ?
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
	const [studyStep, setStudyStep] = useState(undefined);

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => {
				setStudyStep(value);
			});
	}, []);

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
		<>
			{
				studyStep === undefined ?
					<LoadingScreen loading={!studyStep} />
					:
					<ShepherdTour steps={[]}>
						<Content nagivationCallback={navigateHandler}
							studyStep={studyStep} user={userdata} />
					</ShepherdTour>

			}
		</>
	)

}
export default EmotionPreferences;