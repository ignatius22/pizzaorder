import { useSelector } from 'react-redux';
import CreateUser from '../features/user/CreateUser';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { username } = useSelector((state) => state.user);
  const navigate = useNavigate();

  function gotoMenu() {
    navigate('/menu');
  }
  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-center text-xl font-semibold">
        The best pizza.
        <br />
        <span className="text-yellow-500 ">
          Straight out of the oven, straight to you.
        </span>
      </h1>
      {username === '' ? (
        <CreateUser />
      ) : (
        <Button type="primary" onClick={gotoMenu}>
          Continue order {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
