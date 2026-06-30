import { Film } from "./film.entity";
import { FilmModel } from "./film.model";

export class FilmService {

    async list(): Promise<Film[]> {
        return await FilmModel.find().populate('categoryID');
    }

    async get(id: string): Promise<Film | null> {
        return await FilmModel.findById(id).populate('categoryID');
    }

    async create(data: Partial<Film>): Promise<Film> {
        return await FilmModel.create(data);
    }

    async update(id: string, data: Partial<Film>): Promise<Film | null> {
        return await FilmModel.findByIdAndUpdate(id, data, { new: true }).populate('categoryID');
    }

    async delete(id: string): Promise<Film | null> {
        return await FilmModel.findByIdAndDelete(id);
    }
}

export default new FilmService();
