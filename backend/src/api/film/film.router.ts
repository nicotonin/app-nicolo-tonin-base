import { Router } from "express";
import { listFilms, getFilm, createFilm, updateFilm, deleteFilm } from "./film.controller";
import { validate } from "../../lib/validation-middleware";
import { AddFilmDTO } from "./film.dto";

const router = Router();

router.get('/', listFilms);
router.get('/:id', getFilm);
router.post('/', validate(AddFilmDTO), createFilm);
router.put('/:id', validate(AddFilmDTO), updateFilm);
router.delete('/:id', deleteFilm);

export default router;
