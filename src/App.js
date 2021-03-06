import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Button} from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.css'
import axios from 'axios'
import './App.css';

const Pagination = ({ items, pageSize, onPageChange }) => {
  if (items.length <= 1) return null;
  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num);
  const list = pages.map((page) => {
    return (
      <Button key={page} onClick={onPageChange} className="custom-btn">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul style={{
          width: '350px',
          overflowY: 'auto',
      }} className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, { 
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("ttttttttttttttttttttttttt")
        console.log(result.data)
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => { 
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};
// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("dollar");
  console.log(query)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(

    "https://restcountries.com/v3.1/currency/dollar",
    []
  );
  const handlePageChange = e => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data /* here, page means all items from data */
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    <Fragment className='app-form'>
      <form className='search-form'
        onSubmit={event => {
          //http://api.airvisual.com/v2/cities?state={{STATE_NAME}}&country={{COUNTRY_NAME}}&key={{YOUR_API_KEY}}
          doFetch(`https://restcountries.com/v3.1/currency/${query}`);
          setCurrentPage(1)
          event.preventDefault();
        }}
      > 
        <h6>Search Currency</h6>
        <input
          type="text"
          value={query}
          className = "text-input"
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit" className="text-submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ol className="ordered-list"> 
          {page.map((item, index) => (
            <li key={index} className="data">
              <img src={item.flags.png}/>
              <h5><b>Country name:</b> {item.name.common}</h5>
              <h5><b>Currency name:</b> {item.currencies[Object.keys(item.currencies)[0]].name}</h5>
              <h5><b>Region:</b> {item.region}</h5>
              <h5><b>Population:</b> {item.population}</h5>
              {/* <img src={item.maps.googleMaps}/> */}
            </li>
          ))}
        </ol>
      )}
      <Pagination
        items={data}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
//ReactDOM.render(<App />, document.getElementById("root"));

export default App;