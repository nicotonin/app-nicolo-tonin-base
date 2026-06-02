import { create } from "domain";
import { get } from "http";
import Product from "stream/iter";
import {ProductModel} from "./product.model";

class ProductService {

  list() {
    return ProductModel.find();
  }

  get(id: string) {
    return ProductModel.findById(id);
  }

  create(data: any) {
    return ProductModel.create(data);
  }

  update(id: string, data: any) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductService();