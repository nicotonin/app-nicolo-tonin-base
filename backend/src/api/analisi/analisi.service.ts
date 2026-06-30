import { AnalisiModel } from "./analisi.model";
import { Analisi } from "./analisi.entity";

export class AnalisiService {

  async list(): Promise<Analisi[]> {
    return await AnalisiModel.find();
  }

  async get(id: string): Promise<Analisi | null> {
    return await AnalisiModel.findById(id);
  }

  async create(data: Partial<Analisi>): Promise<Analisi> {
    return await AnalisiModel.create(data);
  }

  async update(id: string, data: Partial<Analisi>): Promise<Analisi | null> {
    return await AnalisiModel.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<Analisi | null> {
    return await AnalisiModel.findByIdAndDelete(id);
  }
}

export default new AnalisiService();