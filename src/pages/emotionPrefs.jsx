import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useLocation, useNavigate } from "react-router-dom";
import { getNextStudyStep, post, put, get } from '../utils/api-middleware';
import { emotionsDict } from '../utils/constants';
import EmotionToggle from "../widgets/emotionToggle";
import HeaderJumbotron from '../widgets/headerJumbotron';
import { InstructionModal } from '../widgets/instructionModal';
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

	const [recCriteria, setRecCriteria] = useState('')

	const [pageData, setPageData] = useState(undefined);


	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => {
				setStep(value);

			});
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
		if (Object.keys(step).length > 0) {
			getStepPage(userdata.study_id, step.id, null);
		}
	}, [step]);

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
				setIsToggleDone(true);
			})
			.catch((error) => {
				console.log(error);
			});
		getStepPage(userdata.study_id, step.id, pageData.id);
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
					navigate(props.next,
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

	const infoHandler = () => {
		setHideInstruction(false);
	}

	return (
		<Container>
			<Row>
				{pageData !== undefined ?
					<HeaderJumbotron title={pageData.page_name} content={pageData.page_instruction} />
					:
					<HeaderJumbotron title={step.step_name} content={step.step_description} />
				}
			</Row>
			<InstructionModal show={!hideInstruction} onHide={() => setHideInstruction(true)} />
			<Row style={{ height: "fit-content" }}>
				<Col id="emotionPanel">
					<div className="emoPrefControlPanel">
						<Row>
							<div style={{ alignItems: "left" }}>
								{/* <FcAbout size={30}/> */}
							</div>
						</Row>
						<Row>
							<EmotionToggle onToggle={handleToggle}
								emotions={emotionToggles}
								onReset={resetToggles}
								onFinalize={finalizeToggles} infoCallback={infoHandler} />
						</Row>
					</div>

				</Col>
				<Col id="moviePanel">
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
