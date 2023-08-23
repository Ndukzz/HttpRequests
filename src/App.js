import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios"

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //  FETCHING THE MOVIES FROM THE API
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const loadedMovies = []
    
    axios.get("https://react-movies-4a800-default-rtdb.firebaseio.com/movies.json")
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Something went wrong!!')    //  THROWING THE ERROR
        }
        const data = res.data;
        console.log(data);
      
        for(const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title, 
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
        });
        setMovies(loadedMovies);
        }
      })
      .catch(error => {    //  CATCHING THE ERROR
        setError(error.message)
      })
    
    
    // try {   
    //   // FETCH API GET METHOD

    //   // const response = await fetch('https://react-movies-4a800-default-rtdb.firebaseio.com/movies.json');
    //   // if (!response.ok) {
    //   //   throw new Error('Something went wrong!');
    //   // }
    //   // const data = await response.json();
    //   // console.log(data);
            
    //   //  OLD LOGIC FOR TRANSFORMING THE MOVIES

    //   // const transformedMovies = data.results.map((movieData) => {
    //   //   return {
    //   //     id: movieData.id,
    //   //     title: movieData.title,
    //   //     openingText: movieData.openingText,
    //   //     releaseDate: movieData.release
    //   //   };
    //   // });
      
    //   //  NEW LOGIC FOR TRANSFORMING THE MOVIES
      
    // } 
    // catch (error) {
    //   setError(error.message);
    // }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  //  SEND POST REQUEST WITH THE NEW MOVIES DATA
  async function addMovieHandler(movie) {
    axios.post('https://react-movies-4a800-default-rtdb.firebaseio.com/movies.json', {
      title: movie.title,
      openingText: movie.openingText,
      releaseDate: movie.releaseDate,
    })
      .then(res => {
        console.log(res);
        console.log(res.data);
        const data = res.data
        console.log(data);
      })
    // const response = await fetch('https://react-movies-4a800-default-rtdb.fidrebaseio.com/movies.json', {
    //   method: "POST",
    //   body: JSON.stringify(movie),
    //   headers: {
    //     'Content-Type': 'application/json' 
    //   }
    // });
    // const data = await response.json()
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
