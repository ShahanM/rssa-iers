import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EmotionPreferences from './pages/emotionPrefs';
import RateMovies from './pages/rateMovies';
import Welcome from './pages/welcome';

function App() {
	return (
		<div className="App">
			<Router basename='/ierss'>
				<header className="App-header">
					<Navbar id="topnav" bg="light" style={{width: "100%"}}>
						<Navbar.Brand style={{ marginLeft: "1em", fontWeight: "450", textAlign: 'center', height: "1.5em" }}>Movie Recommender Study</Navbar.Brand>
					</Navbar>
				</header>
				<Container>
					<Suspense fallback={<h1>Loading</h1>}>
						<Routes>
							<Route path="/" element={<Welcome />} />
							<Route path="/ratemovies" element={<RateMovies />} />
							<Route path="/recommendations" element={<EmotionPreferences />} />
							<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
						</Routes>
					</Suspense>
				</Container>
			</Router>
		</div>
	);
}

export default App;
