import { ChangeEvent, useEffect, useState } from "react";
import './index.scss';

import { getMovies, MovieData } from '../api';
import MovieCard from "../MovieCard";

type AverageType = {
  runtime: number;
  budget: number;
}

const MovieList = () => {

  const [movies, setMovies] = useState<MovieData[]>([]);
  const [filtered, setFiltered] = useState<MovieData[]>([]);
  const [average, setAverage] = useState<AverageType>({ runtime: 0, budget: 0 });

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value) {
      const result = movies.filter((movie) => movie.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
      return setFiltered(result);
    }
    setFiltered(movies);
  };

  const handleAverage = (movies: MovieData[]) => {
    let runtime = 0;
    let budget = 0;

    if (movies.length > 0) {
      runtime = movies.reduce((acc, el) => (acc += el.runtimeInMinutes), 0);
      budget = movies.reduce((acc, el) => (acc += el.budgetInMillions), 0);

      setAverage({
        runtime: runtime / movies.length,
        budget: budget / movies.length,
      })
    }
  };

  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log('onSelect', e)
  }

  useEffect(() => {
    getMovies().then((response) => {
      setMovies(response);
      setFiltered(response);
      handleAverage(response)
    });
  }, []);

  return (
    <div className="movieList">
      <header className="movieList__header">
        <h1>Lord of the Rings Movies</h1>
        <div className="movieList__header__metrics">
          <div>Avg. movie runtime: {average.runtime} min</div>
          <div>Avg. movie budget: {average.budget} M</div>
        </div>
        <input className="movieList__header__filter" placeholder="Filter movies by name" onChange={(e) => onInput(e)} />
        <select className="movieList__header__sort" placeholder="Filter movies by name" />
      </header>
      <main className="movieList__items">
        {filtered.map((movie) => <MovieCard key={movie.name} data={movie} />)}
      </main>
    </div>
  );
}

export default MovieList