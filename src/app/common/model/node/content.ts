import {Media} from './media';
import {BaseEntity} from '../../base-entity';

export class Content extends BaseEntity {
    user: string;
    media: Media[];
    versionNo: number;
    versionMessage: string;
    translated: boolean;
    sentForTranslation: Date;
    published: Date;

    constructor() {
        super();
    }

}
