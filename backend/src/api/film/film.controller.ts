import { Response, NextFunction } from "express";
import filmService from "./film.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddFilmDTO } from "./film.dto";
import { NotFoundError } from "../../errors/not-found-error";

export const listFilms = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const films = await filmService.list();
        res.json(films);
    } catch (error) {
        next(error);
    }
};

export const getFilm = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const film = await filmService.get(req.params.id);
        if (!film) throw new NotFoundError();
        res.json(film);
    } catch (error) {
        next(error);
    }
};

export const createFilm = async (
    req: TypedRequest<AddFilmDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = {
            ...req.body,
            releaseDate: new Date(req.body.releaseDate)
        };
        const film = await filmService.create(data);
        res.status(201).json(film);
    } catch (error) {
        next(error);
    }
};

export const updateFilm = async (
    req: TypedRequest<AddFilmDTO>,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: any = { ...req.body };
        if (data.releaseDate) {
            data.releaseDate = new Date(data.releaseDate);
        }
        const film = await filmService.update(req.params.id, data);
        if (!film) throw new NotFoundError();
        res.json(film);
    } catch (error) {
        next(error);
    }
};

export const deleteFilm = async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const film = await filmService.delete(req.params.id);
        if (!film) throw new NotFoundError();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
