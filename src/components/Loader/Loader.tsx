import css from '../css/Loader.module.css';

export default function Loader() {
  return (
    <p className={css.text}>Loading movies, please wait...</p>
  );
}
