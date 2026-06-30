import { {{Name}}Model } from "./{{name}}.model";
import { {{Name}} } from "./{{name}}.entity";

export class {{Name}}Service {

  async list(): Promise<{{Name}}[]> {
    return await {{Name}}Model.find();
  }

  async get(id: string): Promise<{{Name}} | null> {
    return await {{Name}}Model.findById(id);
  }

  async create(data: Partial<{{Name}}>): Promise<{{Name}}> {
    return await {{Name}}Model.create(data);
  }

  async update(id: string, data: Partial<{{Name}}>): Promise<{{Name}} | null> {
    return await {{Name}}Model.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id: string): Promise<{{Name}} | null> {
    return await {{Name}}Model.findByIdAndDelete(id);
  }
}

export default new {{Name}}Service();