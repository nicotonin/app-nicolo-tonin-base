import { Request, Response } from "express";
import {{Name}}Service from "./{{name}}.service";

class {{Name}}Controller {

  list = async (req: Request, res: Response) => {
    try {
      res.json(await {{Name}}Service.list());
    } catch (err) {
      res.status(500).json({ message: "Errore nel recupero" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const item = await {{Name}}Service.get(req.params.id);
      if (!item) res.status(404).json({ message: "Non trovato" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ message: "Errore nel recupero" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      res.status(201).json(await {{Name}}Service.create(req.body));
    } catch (err) {
      res.status(400).json({ message: "Errore nella creazione" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const item = await {{Name}}Service.update(req.params.id, req.body);
      if (!item) res.status(404).json({ message: "Non trovato" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Errore nell'aggiornamento" });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const item = await {{Name}}Service.remove(req.params.id);
      if (!item) res.status(404).json({ message: "Non trovato" });
      res.json({ message: "Eliminato" });
    } catch (err) {
      res.status(500).json({ message: "Errore nell'eliminazione" });
    }
  };
}

export default new {{Name}}Controller();
