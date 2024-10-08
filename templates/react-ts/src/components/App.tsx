import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import "@/styles/App.css";

type Props = {
  entryFile: string;
};

function App({ entryFile }: Props) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className='flex justify-center mb-4'>
        <a href='https://vitejs.dev' target='_blank'>
          <img src={viteLogo} className='logo h-24 p-4' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img
            src={reactLogo}
            className='logo h-24 p-4 react'
            alt='React logo'
          />
        </a>
      </div>
      <h1 className='text-4xl font-bold'>Vite + React</h1>
      <div className='card'>
        <button className='mb-4' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>{entryFile}</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
