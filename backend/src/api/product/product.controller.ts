import { Request, Response } from "express";
import ProductService from "./product.service";

class ProductController {

  list = async (req: Request, res: Response) => {
    res.json(await ProductService.list());
  };

  get = async (req: Request, res: Response) => {
    res.json(await ProductService.get(req.params.id));
  };

  create = async (req: Request, res: Response) => {
    res.status(201).json(await ProductService.create(req.body));
  };

  update = async (req: Request, res: Response) => {
    res.json(await ProductService.update(req.params.id, req.body));
  };

  remove = async (req: Request, res: Response) => {
    res.json(await ProductService.remove(req.params.id));
  };
}

export default new ProductController();