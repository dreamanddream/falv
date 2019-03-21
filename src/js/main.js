/**
 * @version:	 		    2016.11.01
 * @createTime: 	 		2016.11.23
 * @updateTime: 			2016.11.23
 * @author:				    ybw
 * @description             main.js ,所有js入口文件
 */
(function () {
    //判断 ie是否小于 ie9
    function checkIeVersion (){
        var userAgent = navigator.userAgent,
            rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
            rFirefox = /(firefox)\/([\w.]+)/,
            rOpera = /(opera).+version\/([\w.]+)/,
            rChrome = /(chrome)\/([\w.]+)/,
            rSafari = /version\/([\w.]+).*(safari)/;
        var browser;
        var version;
        var ua = userAgent.toLowerCase();
        //判断是否是ie浏览器
        var match = rMsie.exec(ua);
        if(match != null) {
            if(match[2] == '7.0'||match[2] == '8.0' || match[2] == '9.0') {
                console.log("浏览器版本低于ie10")
                return true;
            }
            return false;
        }
        //判断是否是火狐浏览器
        var match = rFirefox.exec(ua);
        if(match != null) {
            console.log(match[1] + "----" + match[2])
            return false;
        }
        //判断是否是Opera浏览器
        var match = rOpera.exec(ua);
        if(match != null) {
            console.log(match[1] + "----" + match[2])
            return false;
        }
        //判断是否是Chrome浏览器
        var match = rChrome.exec(ua);
        if(match != null) {
            console.log(match[1] + "----" + match[2])
            return false;
        }
        //判断是否是Safari浏览器
        var match = rSafari.exec(ua);
        if(match != null) {
            console.log(match[1] + "----" + match[2])
            return false;
        }
    }
    //检查console.IE8没有console。虽然我们用chrome内核插件，但用户没装插件首次用IE8访问时候会报错
    function checkConsole(){
        window.console = window.console || (function () {
            var c ={};
            c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile= c.clear = c.exception = c.trace = c.assert = function(){};
            return c;
        })();
    }

    checkConsole();
    //如果是ie8
    if(checkIeVersion()){
        //  如果不是chrome那么就需要下载插件
        if(navigator.userAgent.indexOf("chromeframe")<0){
            window.location.href='../../plugin/downloadPlugin.html';
        }
    }

    //  js 的路径=>所有模块的查找根路径
    //  var  baseUrl='../js/';
    var  baseUrl='../js/';
    // 防止浏览器缓存main.js，所用用时间戳加载 version.js
    require([baseUrl+'version.js'+'?'+new Date().getTime()],function (version) {
        var  _commonUrl=version.commonUrl ;
        //  require 配置文件
        require.config({
            urlArgs:'version='+version.version,
            baseUrl:baseUrl,
            paths:{
                /**
                 * config
                 */
                config:'config',
                /**
                 * lib
                 */
                //  dom 操作库=>jquery
                jquery:_commonUrl+'lib/jquery/jQuery.v1.11.1.min', //  jquery采用的amd 模块命名， jquery这个名字不可更改
                swiper:_commonUrl+'lib/swiper/swiper.min',
                //  mvvm 库  => vue
                vue:_commonUrl+'lib/vue/vue',
                // scrollbar 滚动条
                scrollbar:_commonUrl+'lib/plugin/scrollbar',
                //提示控件
                addTipsMethod:_commonUrl+'/lib/plugin/addTipsMethod.min',

                // alert,插件
                alert:_commonUrl+'lib/plugin/alert',
                // addTipsMethod,插件
                addTipsMethod:_commonUrl+'lib/plugin/addTipsMethod',
                // ui module
                uiModel:baseUrl+'/lib/uiModel/uiModel',
                //  日期控件
                layDate: _commonUrl+'lib/laydate/laydate',
                /**
                 * app
                 */
                // 公用的数据表
                fdDataTable:'app/dataTable/fdDataTable',
                // 公用组件
                fdComponent:baseUrl+'/app/component/fdComponent',
                // 公用global
                fdGlobal:baseUrl+'/app/common/global',
                addSelect:_commonUrl+'lib/plugin/addSelect',//模拟下拉框

                //四个模块的控制器
                jsAppControllerCcgl:'app/index/jsAppControllerCcgl',
                jsAppControllerClgl:'app/index/jsAppControllerClgl',
                jsAppControllerDhkgl:'app/index/jsAppControllerDhkgl',
                jsAppControllerFwgl:'app/index/jsAppControllerFwgl',

            },
            //为那些没有使用define()来声明依赖关系
            shim:{
                'addTipsMethod' : {
                    deps : ['jquery'],
                    exports : 'addTipsMethod'
                },
                'scrollbar' : {
                    deps : ['jquery'],
                    exports : 'scrollbar'
                },
                'alert' : {
                    deps : ['jquery'],
                    exports : 'alert'
                },
                //  日期控件
                'datetimepicker' : {
                    deps : ['jquery']
                }

            },
            waitSeconds:0  //加载超时问题的一个解决方法0表示不设置超时，默认是7s
        });
        // 模块的入口
        require(['jquery','fdGlobal','config','vue'], function (jquery,fdGlobal,config,vue) {
            // 设置一个全局对象 global+ fd
            window.globalFd={
                // ajax超时加载
                ajaxTimer:null,
                // 超时时间
                ajaxTimeout:5000
            };
            // 正在加载数据
            // fdGlobal.loading();
            // 获取js路径
            var url = config.dirJsPath,jsurl = $('body').data('js');
            //禁用浏览器的backspace默认回退事件
            document.onkeypress=function (e){
                var ev = e || window.event;//获取event对象
                var obj = ev.target || ev.srcElement;//获取事件源
                var t = obj.type || obj.getAttribute('type');//获取事件源类型
                if(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number"){
                    return false;
                }
            }
            document.onkeydown=function (e){
                var ev = e || window.event;//获取event对象
                var obj = ev.target || ev.srcElement;//获取事件源
                var t = obj.type || obj.getAttribute('type');//获取事件源类型
                if(ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number"){
                    return false;
                }
            }
            //如果存在js路径，那么就加载该js
            if (jsurl) {
                require([url+jsurl], function () {
                    fdGlobal.removeLoading();
                });
            }
        });

    });
})();

