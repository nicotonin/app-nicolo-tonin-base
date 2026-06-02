import { notFoundHandler } from "./not-found-error";
import { genericHandler } from './generic';
import { validationHandler } from "./validation";


export const errorHandlers = [validationHandler, notFoundHandler, genericHandler];