import React from 'react';
import StarRatings from 'react-star-ratings';


export default function MovieGridItem(props) {
	return (
		<div id={"TN_" + props.movieItem.movie_id}
			className={"grid-item"} style={{
				backgroundImage: "url(" + props.movieItem.poster + "), url('" + 'defaultMovieIco' + "')",
			}}>
			<div className="overlay">
				<div className={props.movieItem.rating > 0 ? 'star-div-rated' : 'star-div'}>
					<StarRatings
						rating={props.movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="18px"
						starSpacing="1px"
						changeRating={props.handleRating}
						numberOfStars={5}
						name={props.movieItem.movie_id} />
				</div>
			</div>
			<div className="grid-item-label" style={{ position: "absolute" }}>
				{props.movieItem.title + " (" + props.movieItem.year + ")"}
			</div>
		</div>
	);
}