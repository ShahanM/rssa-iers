import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import { Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import RateMovies from './pages/rateMovies';
import EmotionPreferences from './pages/emotionPrefs';
import { Container } from 'react-bootstrap';

function App() {
	return (
		<div className="App">
			<Router basename='/iers-algo-experiments'>
				<header className="App-header">
					<Navbar id="topnav" bg="light">
						<Navbar.Brand style={{ marginLeft: "1em", fontWeight: "450" }}>Movie Recommender Study</Navbar.Brand>
					</Navbar>
				</header>
				<Container>
					<Suspense fallback={<h1>Loading</h1>}>
						<Routes>
							<Route path="/" element={<RateMovies next="/recommendations" />} />
							<Route path="/recommendations" element={<EmotionPreferences next="/" />} />
						</Routes>
					</Suspense>
				</Container>
			</Router>
		</div>
	);
}

export default App;
