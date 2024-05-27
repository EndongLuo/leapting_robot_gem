const xml2js = require('xml2js');
const crypto = require('crypto') //引入加密模块
const svgCaptcha = require("svg-captcha"); // 生成 svg 格式的验证码

function getSignature (timestamp, nonce, token) {
    let hash = crypto.createHash('sha1')
    //字典排序
    const tempStr = [token, timestamp, nonce].sort().join('');
    const resultCode = hash.update(tempStr, 'utf8').digest('hex')
    return resultCode
}

function parseXMLAsync(xml){
    return new Promise((resolve,reject)=>{
        xml2js.parseString(xml,{trim:true},function(err,content){
            if(err){
                reject(err);
            }
            resolve(content);
        });
    });
}

function formatMessage(result){
    var message={};
    if(typeof result ==='object'){
        var keys=Object.keys(result);
        for(let i=0;i<keys.length;i++){
            var item=result[keys[i]];
            var key=keys[i];
            if(!(item instanceof Array) || item.length===0){
                continue;
            }
            else if(item.length===1){
                var val=item[0];
                if(typeof val === 'object'){
                    messgae[key]=formatMessage(val);
                }else{
                    message[key]=(val || '').trim();
                }
            }
            else{
                message[key]=[];
                for(var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}


// var crypto = require('crypto');

function cryptoPwd(password) {
    var md5 = crypto.createHash('md5');
    var saltPassword = password + ':leapting';
    return md5.update(saltPassword).digest('hex');
}

// 生成 svg格式验证码
const createCaptcha = () => {
    const captcha = svgCaptcha.create({
      size: 4,
      noise: 1,
      fontSize: 35,
      width: 100,
      height: 35,
      background: "#e9e9e9",
    });
  
    return captcha;
  };

module.exports = {
    getSignature,
    parseXMLAsync,
    formatMessage,
    cryptoPwd,
    createCaptcha
};
