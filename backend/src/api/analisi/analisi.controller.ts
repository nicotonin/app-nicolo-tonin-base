import { Response, NextFunction } from "express";
import AnalisiService from "./analisi.service";
import { TypedRequest } from "../../lib/typed-request.interface";
import { AddAnalisiDTO, UpdateAnalisiDTO } from "./analisi.dto";
import { NotFoundError } from "../../errors/not-found-error";

export const list = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await AnalisiService.list());
  } catch (err) {
    next(err);
  }
};

export const get = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AnalisiService.get(req.params.id);
    if (!item) throw new NotFoundError();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: TypedRequest<AddAnalisiDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(201).json(await AnalisiService.create(req.body));
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: TypedRequest<UpdateAnalisiDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AnalisiService.update(req.params.id, req.body);
    if (!item) throw new NotFoundError();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AnalisiService.remove(req.params.id);
    if (!item) throw new NotFoundError();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};