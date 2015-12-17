/**
 * Created by Rodey on 2015/10/23.
 */

module YT{

    export class ShareModel{

        private static _instance: ShareModel;

        public static getInstance(){
            if(!this._instance){
                return new ShareModel();
            }
            return this._instance;
        }

        public constructor(){
            if(window['SYST']){
                window['SYST']['_shareModels'] = {};
            }
        }

        add(key: string, model: YT.Model): void{
            window['SYST']['_shareModels'][key] = model;
        }

        get(key: string): any{
            var shareModels = window['SYST']['_shareModels'];
            if(null == key){
                return shareModels;
            }
            if(shareModels[key] && shareModels[key] instanceof YT.Model){
                return shareModels[key];
            }
            return null;
        }

        remove(key: string){
            var shareModels = window['SYST']['_shareModels'];
            var model = shareModels[key];
            if(model && model instanceof(YT.Model)){
                shareModels[key] = null;
                delete shareModels[key];
            }
            return model;
        }

        has(key: string){
            var shareModels = window['SYST']['_shareModels'];
            return shareModels[key];
        }

    }

}
