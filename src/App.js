import "./App.css";
import Navbar from "./Components/Navbar";
import WeatherForm from "./Components/WeatherForm"; 
import Chart from "./Components/Chart";
function App() {
  return (
    <div className="App">
      <Navbar   />
      <WeatherForm />
      {/* <Chart /> */}
    </div>
  );
}

export default App;
