import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, getNextStudyStep, post, put } from '../utils/api-middleware';
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieGrid from '../widgets/movieGrid';
import NextButton from '../widgets/nextButton';


export default function RateMovies() {


	const itemsPerPage = 24;
	const userdata = useLocation().state.user;
	const stepid = useLocation().state.step;
	const navigate = useNavigate();

	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);

	const [movies, setMovies] = useState([]);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);

	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [buttonDisabled, setButtonDisabled] = useState(true);

	const [step, setStep] = useState({});


	const rateMoviesHandler = (newRating, movieid) => {
		const isNew = !ratedMoviesData.some(item => item.item_id === movieid);
		let updatevisited = [];
		let updaterated = [];
		if (isNew) {
			let updatedmovie = movies.find(item => item.movie_id === movieid);
			updatedmovie.rating = newRating;
			updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
			updaterated = [...ratedMovies, updatedmovie];
		} else {
			updatevisited = ratedMoviesData.map(item => (
				item.item_id === movieid ? {
					...item, rating: newRating
				} : item
			));
			updaterated = ratedMovies.map(item => (
				item.movie_id === movieid ? {
					...item, rating: newRating
				} : item));
		}

		setRatedMovies(updaterated);
		setRatedMoviesData(updatevisited);
		setMovies(movies.map(movie => (
			movie.movie_id === movieid ? {
				...movie, rating: newRating
			} : movie)));
		setRatedMovieCount(updatevisited.length);
		setButtonDisabled(updatevisited.length < 10);
	}

	const fetchMovies = async () => {
		const offset = (currentPage - 1) * itemsPerPage * 2;
		const limit = itemsPerPage * 2;
		get('ers/movies/?skip=' + offset + '&limit=' + limit)
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => {
				updateSeenItems(newmovies.map(item => item.movie_id));
				setMovies([...movies, ...newmovies]);
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		getNextStudyStep(userdata.study_id, stepid)
			.then((value) => { setStep(value) });
		fetchMovies();
	}, []);

	useEffect(() => {
		if (recommendedMovies.length > 0) {
			navigate('/recommendations',
				{
					state: {
						recommendations: recommendedMovies,
						ratings: ratedMoviesData,
						user: userdata,
						step: step.id
					}
				});
		}
	}, [recommendedMovies, ratedMoviesData, navigate, userdata, step]);

	const submitHandler = (recType) => {
		setLoading(true);
		if (ratedMovies.length > 0) {
			updateItemrating().then((isupdateSuccess): Promise<Boolean> => isupdateSuccess)
				.then((isupdateSuccess) => {
					if (isupdateSuccess) {
						post('ers/recommendation/', {
							user_id: userdata.id,
							ratings: ratedMoviesData,
							rec_type: recType,
							num_rec: 20
						})
							.then((response): Promise<movie[]> => response.json())
							.then((movies: movie[]) => { setRecommendedMovies([...movies]); })
							.catch((error) => { console.log(error); });
					}
				});
		}
		setLoading(false);
	}

	const updateItemrating = async () => {
		return put('user/' + userdata.id + '/itemrating/', {
			'user_id': userdata.id,
			'page_id': 4,
			'page_level': currentPage,
			'ratings': ratedMoviesData
		})
			.then((response): Promise<ratedItems[]> => response.json())
			.then((ratedItems: ratedItems) => { return ratedItems.length > 0; })
			.catch((error) => { console.log(error); return false });
	}

	const updateSeenItems = async (items) => {
		put('user/' + userdata.id + '/seenitems/', {
			'user_id': userdata.id,
			'page_id': 4,
			'page_level': currentPage,
			'items': items
		})
			.then((response): Promise<success> => response.json())
			.then((success: success) => { console.log('LKOG', success); })
			.catch((error) => console.log(error));
	}


	const updateCurrentPage = (page) => {
		setCurrentPage(page);
	}

	return (
		<Container>
			<Row>
				<HeaderJumbotron step={step} />
			</Row>
			<Row>
				<MovieGrid ratingCallback={rateMoviesHandler} userid={userdata.id} movies={movies}
					pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
					<div className="rankHolder">
						<span> Ranked Movies: </span>
						<span><i>{ratedMovieCount}</i></span>
						<span><i>of {10}</i></span>
					</div>
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => submitHandler(0)} />
				</div>
			</Row>
		</Container>
	);
}