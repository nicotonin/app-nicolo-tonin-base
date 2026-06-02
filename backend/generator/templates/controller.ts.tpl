import { Request, Response } from "express";
import {{Name}}Service from "./{{name}}.service";

class {{Name}}Controller {

  list = async (req: Request, res: Response) => {
    res.json(await {{Name}}Service.list());
  };

  get = async (req: Request, res: Response) => {
    res.json(await {{Name}}Service.get(req.params.id));
  };

  create = async (req: Request, res: Response) => {
    res.status(201).json(await {{Name}}Service.create(req.body));
  };

  update = async (req: Request, res: Response) => {
    res.json(await {{Name}}Service.update(req.params.id, req.body));
  };

  remove = async (req: Request, res: Response) => {
    res.json(await {{Name}}Service.remove(req.params.id));
  };
}

export default new {{Name}}Controller();