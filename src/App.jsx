import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import DemographyPage from './pages/demographyPage';
import EmotionPreferences from './pages/emotionPrefs';
import FeedbackPage from './pages/feedbackPage';
import RateMovies from './pages/rateMovies';
import StudyMap from './pages/studymap';
import Survey from './pages/survey';
import Welcome from './pages/welcome';

function App() {
	return (
		<div className="App">
			<Router basename='/ierss'>
				<header className="App-header">
					<Navbar id="topnav" bg="light" style={{ width: "100%" }}>
						<Navbar.Brand style={{ marginLeft: "1em", fontWeight: "450", textAlign: 'center', height: "1.5em" }}>
							Movie Recommender Study
						</Navbar.Brand>
					</Navbar>
				</header>
				<Suspense fallback={<h1>Loading</h1>}>
					<Routes>
						<Route path="/" element={<Welcome next="/studyoverview" />} />
						<Route path="/studyoverview" element={<StudyMap next="/presurvey" />} />
						<Route path="/presurvey" element={<Survey next="/ratemovies" />} />
						<Route path="/ratemovies" element={<RateMovies next="/recommendations" />} />
						<Route path="/recommendations" element={<EmotionPreferences next="/feedback" />} />
						<Route path="/feedback" element={<FeedbackPage next="/postsurvey" />} />
						<Route path="/postsurvey" element={<Survey next="/demography" />} />
						<Route path="/demography" element={<DemographyPage next="/quit" />} />
						<Route path="/quit" element={<h1>Thank you for participating!</h1>} />
					</Routes>
				</Suspense>
			</Router>
		</div>
	);
}

export default App;
