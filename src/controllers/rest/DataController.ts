import { Controller } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post } from "@tsed/schema";
import fs from 'fs';

@Controller('/data')
export class DataController{

    @Post('/upload-data')
    async uploadData(@BodyParams('input_data') string_data: string) {
        const data: RecieveUploadData = JSON.parse(string_data);
        const path = `src/data/${data.title}.txt`;
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, '', 'utf8');
        }
        fs.writeFileSync(path, data.data, 'utf8');
    }
}

export class RecieveUploadData{
    title: string;
    data: string;
}