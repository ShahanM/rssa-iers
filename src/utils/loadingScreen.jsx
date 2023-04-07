import { useEffect, useState } from "react";


export const LoadingScreen = (props) => {

	const [loading, setLoading] = useState(props.loading);
	useEffect(() => { setLoading(props.loading) }, [props.loading]);

	const [loadingMessage, setLoadingMessage] = useState(props.loadingMessage);
	useEffect(() => { setLoadingMessage(props.loadingMessage) }, [props.loadingMessage]);


	return (
		<>
			{loading &&
				<div style={{
					position: "absolute", width: "100%",
					height: "100%", zIndex: "999",
					backgroundColor: "rgba(255, 255, 255, 1)",
					margin: "18px auto auto auto"
				}}>
					<h2 style={{
						margin: "300px auto",
						color: "black"
					}}>
						{loadingMessage}
						<div className="loaderStage">
							<div className="dot-floating" style={{
								margin: "1.5em auto"
							}}></div>
						</div>
					</h2>
				</div>
			}
		</>
	)
}