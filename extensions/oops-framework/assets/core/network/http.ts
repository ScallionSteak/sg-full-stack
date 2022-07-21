import { oops } from "../Oops";

const url = 'http://47.241.9.181:3009';

export class HttpRequestForDS {

    /**
    * 请求协议的方法
    * @param path 请求接口的路径
    * @param params 参数
    * @param callBack 回调函数
    */

    get(path, params, callBack) {
        var requestUrl = url + path;
        var xhr = new XMLHttpRequest();
        // var data=self.paramData(params);
        var data = params;
        let param = '?';

        for (var key in data) {
            var paramStr = key + "=" + data[key];
            if (param == "") {
                param += paramStr;
            } else {
                param += "&" + paramStr;
            }
        }
        xhr.timeout = 5000;
        xhr.open("GET", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log(xhr.responseText);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                var respone = xhr.responseText;
                console.log('响应参数', respone);
                callBack(JSON.parse(respone));
            }
        };
        xhr.send();
    }

    postImg(path, img, callBack){
        var imgFile = this.dataURLtoFile(img, oops.storage.get('walletAddress'));
        var requestUrl = url + path;
        var imgFormData = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("POST", requestUrl);
        imgFormData.append("file", imgFile);
        xhr.send(imgFormData);
    }

    postJSON(path, jsonFile, callBack){
        var requestUrl = url + path;
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("POST", requestUrl);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(jsonFile));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status == 200) {
                var respone = xhr.responseText;
                console.log('响应参数', respone);
                callBack(respone);
            }
        }
    }

    dataURLtoFile(dataurl, walletAddress) {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${walletAddress}.${suffix}`, {
            type: mime
        })
    }

}