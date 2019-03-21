/**
 * Created by lenovo on 2016/5/31.
 */
define(['fdGlobal'], function (fdGlobal) {
    var  params = fdGlobal.getLocalParams();
    //  获取项目绝对地址，传入false，那么就是相对地址
    var  getLocalPath=fdGlobal.getLocalPath(false);
    var getAbsolutePath=fdGlobal.getLocalPath(true);
    //  根目录文件夹
    var  rootFolder=getLocalPath+'../';
    var  config={
        isDebug:true,//  是否是调试模式，true 为json数据，false为服务器数据
        methodGet:'get',// ajax查询方式   get
        methodPost:'post',// ajax查询方式  post
        url:{},     //  url链接,也就是数据的地址
        showLog:false, // 是否显示日志
        dirJsPath:getLocalPath+rootFolder+'/js/app/' , //js直接路径
        dirCssPath:getLocalPath+rootFolder+'/css/' , //css直接路径
        dirJsonPath:getLocalPath+rootFolder+'/json/' , //json直接路径
        dirTemplatePath:getLocalPath+rootFolder+'/html/template/' , //模板的根路径
        dirHtmlPath:getLocalPath+rootFolder+'/html/', //html直接路径
        dirProjectPath:getAbsolutePath //项目路径
    };
    // json对应的路径
    var  localUrl={
        // 刑事法官智能办案系统
        index:{

        },
        //框架页
        frame:{

        }
    };
    // 服務器对应的路径
    var serverlUrl={
        // 刑事法官智能办案系统
        frame:{

        }
    };
    config.url= config.isDebug?localUrl:serverlUrl;
    config.localParams = params;
    return config;
});

