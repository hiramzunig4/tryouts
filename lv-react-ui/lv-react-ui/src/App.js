import logo from './logo.svg';
import './App.css';

function clickHandler(){
  console.log("clicked");
}

function App() {
  return (
    <div className="App">
      <button onClick={clickHandler}> Click me! </button>
    </div>
  );
}

export default App;
