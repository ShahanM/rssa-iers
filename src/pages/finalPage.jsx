import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCompletionURL } from "../utils/api-middleware";
import { LoadingScreen } from "../utils/loadingScreen";

export const FinalPage = (props) => {

	const userdata = useLocation().state.user;
	const [navUrl, setNavUrl] = useState('');

	const [loading, setLoading] = useState(false);


	useEffect(() => {
		setLoading(true);
		getCompletionURL(userdata)
			.then((value) => {
				const url = value.completion_url;
				if (url !== undefined && url !== null && url !== '') {
					setNavUrl(url);
				}
			});
	}, []);

	useEffect(() => {
		function redirect(url) {
			window.location.href = url;
		}
		if (navUrl !== '') {
			setLoading(false);
			redirect(navUrl);
		}
	}, [navUrl]);

	return (
		<>
			{loading && navUrl != '' ?
				<LoadingScreen loading={loading}
					loadingMessage="Thank you for participating! Please wait while we process your response." />
				: <div style={{ marginTop: '36px' }}>
					<h3>
						If you are not redirected back to Prolific in 10 seconds please click the following link.
					</h3>
					<a href={navUrl}>Click here to return to Prolific</a>
				</div>
			}
		</>
	)
}