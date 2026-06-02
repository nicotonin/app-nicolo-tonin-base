import { create } from "domain";
import { get } from "http";
import {{Name}} from "stream/iter";
import {{{Name}}Model} from "./{{name}}.model";

class {{Name}}Service {

  list() {
    return {{Name}}Model.find();
  }

  get(id: string) {
    return {{Name}}Model.findById(id);
  }

  create(data: any) {
    return {{Name}}Model.create(data);
  }

  update(id: string, data: any) {
    return {{Name}}Model.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return {{Name}}Model.findByIdAndDelete(id);
  }
}

export default new {{Name}}Service();