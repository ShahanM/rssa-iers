import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router-dom';
import { API, CORSHeaders, post, get, put } from '../utils/api-middleware';
import MovieGrid from '../widgets/movieGrid';


export default function RateMovies() {
	let userid = 1;
	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);

	const [movies, setMovies] = useState([]);

	const [ratedMovieCount, setRatedMovieCount] = useState(0);

	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const [buttonDisabled, setButtonDisabled] = useState(true);

	const itemsPerPage = 24;
	const navigate = useNavigate();

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
		fetchMovies();
	}, []);

	useEffect(() => {
		if (recommendedMovies.length > 0) {
			navigate('/recommendations',
				{
					state: {
						recommendations: recommendedMovies,
						ratings: ratedMoviesData
					}
				});
		}
	}, [recommendedMovies, ratedMoviesData, navigate]);

	const submitHandler = (recType) => {
		setLoading(true);
		if (ratedMovies.length > 0) {
			updateItemrating().then((isupdateSuccess): Promise<Boolean> => isupdateSuccess)
				.then((isupdateSuccess) => {
					if (isupdateSuccess) {
						post('ers/recommendation/', {
							user_id: userid,
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
		return put('user/' + userid + '/itemrating/', {
			'user_id': userid,
			'page_id': 4,
			'page_level': currentPage,
			'ratings': ratedMoviesData
		})
			.then((response): Promise<ratedItems[]> => response.json())
			.then((ratedItems: ratedItems) => { return ratedItems.length > 0; })
			.catch((error) => { console.log(error); return false });
	}

	const updateSeenItems = async (items) => {
		put('user/' + userid + '/seenitems/', {
			'user_id': userid,
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
				<div className="jumbotron">
					<h1 className="header">Indicate your preferences</h1>
					<p>Use the blue button on the right to scroll through
						the gallery of movies and rate at least 10 movies
						that you have already watched. Once you have rated 10
						movies, the system will be able to give you
						recommendations.
						Keep in mind, you can click on the blue button on the
						right to get more movies to rate!</p>
				</div>
			</Row>
			<Row>
				<MovieGrid ratingCallback={rateMoviesHandler} userid={userid} movies={movies}
					pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
			</Row>
			<Row>
				<div className="jumbotron jumbotron-footer" style={{ display: "flex" }}>
					<div className="rankHolder">
						<span> Ranked Movies: </span>
						<span><i>{ratedMovieCount}</i></span>
						<span><i>of {10}</i></span>
					</div>
					<Button variant="ers" size="lg" style={{ height: "fit-content", marginTop: "1em" }}
						className="next-button footer-btn" disabled={buttonDisabled && !loading}
						onClick={() => submitHandler(0)}>
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
	);
}