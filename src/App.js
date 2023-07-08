import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [ movies, setMovies ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState(null)

  const fetchMoviesHandler = useCallback(async() => {   //  THE useCallback ALLOWS THE FUNC TO BE USED PROPERLY IN THE useEffect HOOK WITHOUT ANY COMPLICATIONS
    try {   //TRY-CATCH STATEMENT  
      setIsLoading(true)
      setError(null)

      const response = await fetch("https://swapi.dev/api/films")

      // CHECK AND THROW ERRORS
      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      const data = await response.json()

      const transformedMoviesList = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }
      })
      setMovies(transformedMoviesList)
    } catch (error) {   //CATCHING ERRORS
      setError(error.message)
    }
    setIsLoading(false)
  },[])
 
  useEffect(() => {         //  THE FUNCTION IS CALLED ANYTIME THE APP IS RENDERED
    fetchMoviesHandler();
  },[fetchMoviesHandler])

  //  HANDLING THE CONTENT MORE  ELEGANTLY
  let content = <p>No movies to Display!!</p>;
  if(error) {
    content = <p>{error}</p>
  }
  if(isLoading){
    content = <p>Loading Content...</p>
  }
  if(!isLoading && movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
