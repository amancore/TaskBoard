import './App.css';
import Header from "./components/Header";
import Kboard from "./components/Kboard";

function App() {
	return (
		<div className="">
			<Header /> 
			<main className="flex-grow p-2 pt-8">
				<Kboard />
			</main>
		</div>
	);
}

export default App;
