import { Schema, model } from 'mongoose';
import { Film } from './film.entity';

const filmSchema = new Schema<Film>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    releaseDate: { type: Date, required: true },
    categoryID: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
})

filmSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        delete (ret as unknown as any)._id;
        delete (ret as unknown as any).__v;
        return ret;
    }
});

filmSchema.set('toObject', {
    virtuals: true,
    transform: (_, ret) => {
        delete (ret as unknown as any)._id;
        delete (ret as unknown as any).__v;
        return ret;
    }
});

export const FilmModel = model<Film>('Film', filmSchema);
