import { BaseError } from '../types/error';

// export class BaseError extends Error {
//     constructor(params: IBaseError) {
//         super();
//     }
// }

export class HTTPError extends Error {
    tupleErrorParams: BaseError;

    constructor(params: BaseError) {
        super(params.message);
        this.tupleErrorParams = params;
    }
}
