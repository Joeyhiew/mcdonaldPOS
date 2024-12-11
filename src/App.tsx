import CompletedOrder from './completedOrder';
import Cook from './cook';
import Order from './pendingOrder';
import mcLogo from './assets/logo.png';

const App = () => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl flex justify-center items-center">
        Welcome to
        <img className="ml-2" src={mcLogo} width={55} />
      </h1>
      <div className="flex flex-col justify-around align-middle h-full items-center gap-24 p-24 md:flex-row">
        <Order />
        <Cook />
        <CompletedOrder />
      </div>
    </div>
  );
};
export default App;
