import logo from './logo.svg';
import './App.css';
import UserInfo from './UserInfo';
import ItemList from './ItemList.js'
import Item from './Item.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Scalapay Engineering Assessment
      </header>
      <div className="body">
        <UserInfo name="Mark" />

        <h3>Items</h3>
          <Item />
      </div>

    </div>
  );
}

export default App;
