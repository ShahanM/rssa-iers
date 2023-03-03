import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../utils/api-middleware';
import HeaderJumbotron from '../widgets/headerJumbotron';
import MovieGrid from '../widgets/movieGrid';
import NextButton from '../widgets/nextButton';


export const Content = (props) => {
	const userid = 1;
	const studyStep = {
		step_name: "Rate Movies",
		step_description: "Rate 10 movies to get recommendations"
	}
	const studyCondition = 1;
	const itemsPerPage = 24;

	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);

	const [movieids, setMovieIds] = useState([]);

	const [movies, setMovies] = useState([]);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);

	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [buttonDisabled, setButtonDisabled] = useState(true);

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
		const limit = itemsPerPage * 2;
		const nextpageids = pickRandomMovies(movieids, limit);
		getMoviesByIDs(nextpageids);
	}

	const getAllMovieIds = async () => {
		get('ers/movies/ids/')
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => {
				const firstpageitems = pickRandomMovies(newmovies, itemsPerPage * 2);
				getMoviesByIDs(firstpageitems);
			})
			.catch((error) => console.log(error));
	}

	const getMoviesByIDs = async (ids) => {
		post('ers/movies/', ids)
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => {
				setMovies([...movies, ...newmovies]);
			})
			.catch((error) => console.log(error));
	}

	const pickRandomMovies = (moviearr: int[], limit) => {
		let randomMovies = [];
		for (let i = 0; i < limit; i++) {
			let randomMovie = moviearr.splice(Math.floor(Math.random() * moviearr.length), 1);
			randomMovies.push(...randomMovie);
		}
		setMovieIds(moviearr);
		return randomMovies;
	}

	useEffect(() => {
		getAllMovieIds();
	}, []);

	useEffect(() => {
		if (recommendedMovies.length > 0) {
			props.navigationCallback(recommendedMovies,
				ratedMoviesData, userid, studyCondition);
		}
	}, [recommendedMovies, ratedMoviesData]);


	const submitHandler = (recType) => {
		setLoading(true);
		if (ratedMovies.length > 0) {
			post('ers/recommendation/', {
				user_id: userid,
				user_condition: studyCondition,
				ratings: ratedMoviesData,
				rec_type: recType,
				num_rec: 20
			})
				.then((response): Promise<movie[]> => response.json())
				.then((movies: movie[]) => {
					setRecommendedMovies([...movies]);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		}
	}

	const updateCurrentPage = (page) => {
		setCurrentPage(page);
	}

	return (
		<Container>
			{loading &&
				<div style={{
					position: "absolute", width: "1320px",
					height: "698px", zIndex: "999",
					backgroundColor: "rgba(25, 15, 0, 0.9)"
				}}>
					<h2 style={{
						margin: "300px auto",
						color: "white"
					}}>
						Please wait while the system prepares your recommendations
						<div className="loaderStage">
							<div className="dot-floating" style={{
								margin: "1.5em auto"
							}}></div>
						</div>
					</h2>
				</div>
			}
			<Row>
				<HeaderJumbotron title={studyStep.step_name} content={studyStep.step_description} />
			</Row>
			<Row>
				<MovieGrid ratingCallback={rateMoviesHandler} userid={userid} movies={movies}
					pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
					<RankHolder count={ratedMovieCount} />
					<NextButton disabled={buttonDisabled && !loading}
						loading={loading} onClick={() => submitHandler(0)} />
				</div>
			</Row>
		</Container>
	);
}

const RankHolder = (props) => {
	return (
		<div className="rankHolder">
			<span> Ranked Movies: </span>
			<span><i>{props.count}</i></span>
			<span><i>of {10}</i></span>
		</div>
	)
}

export const RateMovies = (props) => {

	const navigate = useNavigate();

	function handleNavigate(recommendedMovies,
		ratedMoviesData, userid, condition) {
		navigate(props.next,
			{
				state: {
					recommendations: recommendedMovies,
					ratings: ratedMoviesData,
					user: {
						id: userid,
						condition: condition
					}
				}
			});
	}

	return (
		<div>
			<Content navigationCallback={handleNavigate} />
		</div>
	);
}

export default RateMovies;