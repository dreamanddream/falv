/**
 * @version:	 		    2017.13.16
 * @createTime: 	 		2017.03.16
 * @updateTime: 			2017.08.02
 * @author:				    wuwg
 * @description             global.js ,这里放的是全局的方法，禁止写其他代码
 ***/
define(['jquery','alert','fdDataTable'], function ($,alert,fdDataTable) {
    "user strict";
    var queryParam={
        ajbh:"",
        ajlb:"",
        ah:"",
        fydm:"",
        ajlbmc:"",
        ajmc:"",
        sfzs:"",
        nywlx:"",
        ywlx:"",
        slType:"",
        clbh:"",
        wslx:"",
        gotopage:"",
        wsid:"",
        slType:"",
        aycode:"",
        rootAyCode:""
    };
    var  _global= {
        getUuid:function() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid.replace(/-/g, "");
        },
        //根据n值 获取 c值（用来前端渲染的）
        getString : function(srapNum,conNum){
            var list='table'+srapNum,
                str="";
            $.each(fdDataTable[list],function(key,value){
                var _key=key.slice(5,key.length);
                if(parseInt(_key) == conNum){
                    str=value;
                }
            });
            return str;
        },
        // 获取请求路径？后面的参数
        getLocalParams:function(){
            var topWindow = this.getWindow(window);
            var params = topWindow.location.search.substring(1);
            //var params = window.top.location.search.substring(1);
            return params;
        },
        //弹窗可以拖拽
        dragUpWindow: function(){
            return {
                //初始化
                initialize: function(drag, options) {
                    this.drag = this.$(drag);
                    this._x = this._y = 0;
                    this._moveDrag = this.bind(this, this.moveDrag);
                    this._stopDrag = this.bind(this, this.stopDrag);
                    this.setOptions(options);
                    this.handle = this.$(this.options.handle);
                    this.maxContainer = this.$(this.options.maxContainer);
                    this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight;
                    this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth;
                    this.limit = this.options.limit;
                    this.lockX = this.options.lockX;
                    this.lockY = this.options.lockY;
                    this.lock = this.options.lock;
                    this.onStart = this.options.onStart;
                    this.onMove = this.options.onMove;
                    this.onStop = this.options.onStop;
                    this.handle.style.cursor = "move";
                    this.changeLayout();
                    this.addHandler(this.handle, "mousedown", this.bind(this, this.startDrag))
                },
                changeLayout: function() {
                    this.drag.style.top = (this.drag.offsetTop +this.options.mTop)+ "px";
                    this.drag.style.left = (this.drag.offsetLeft +this.options.mLeft) +"px";
                    this.drag.style.position = "absolute";
                    this.drag.style.margin = "0"
                },
                startDrag: function(event) {
                    var event = event || window.event;
                    this._x = event.clientX - this.drag.offsetLeft;
                    this._y = event.clientY - this.drag.offsetTop;
                    this.addHandler(document, "mousemove", this._moveDrag);
                    this.addHandler(document, "mouseup", this._stopDrag);
                    event.preventDefault && event.preventDefault();
                    this.handle.setCapture && this.handle.setCapture();
                    this.onStart()
                },
                moveDrag: function(event) {
                    var event = event || window.event;

                    var iTop = event.clientY - this._y;
                    var iLeft = event.clientX - this._x;

                    if(this.lock) return;

                    this.limit && (iTop < 0 && (iTop = 0), iLeft < 0 && (iLeft = 0), iTop > this.maxTop && (iTop = this.maxTop), iLeft > this.maxLeft && (iLeft = this.maxLeft));

                    this.lockY || (this.drag.style.top = iTop + "px");
                    this.lockX || (this.drag.style.left = iLeft + "px");

                    event.preventDefault && event.preventDefault();

                    this.onMove()
                },
                stopDrag: function() {
                    this.removeHandler(document, "mousemove", this._moveDrag);
                    this.removeHandler(document, "mouseup", this._stopDrag);

                    this.handle.releaseCapture && this.handle.releaseCapture();

                    this.onStop()
                },
                //参数设置
                setOptions: function(options) {
                    this.options = {
                        handle: this.drag, //事件对象
                        limit: true, //锁定范围
                        lock: false, //锁定位置
                        lockX: false, //锁定水平位置
                        lockY: false, //锁定垂直位置
                        maxContainer: document.documentElement || document.body, //指定限制容器
                        onStart: function() {}, //开始时回调函数
                        onMove: function() {}, //拖拽时回调函数
                        onStop: function() {} ,//停止时回调函数
                        mTop:0,//默认位置left值
                        mLeft:0//默认位置left值
                    };
                    for(var p in options) this.options[p] = options[p]
                },
                //获取id
                $: function(id) {
                    return typeof id === "string" ? document.getElementById(id) : id
                },
                //添加绑定事件
                addHandler: function(oElement, sEventType, fnHandler) {
                    return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
                },
                //删除绑定事件
                removeHandler: function(oElement, sEventType, fnHandler) {
                    return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
                },
                //绑定事件到对象
                bind: function(object, fnHandler) {
                    return function() {
                        return fnHandler.apply(object, arguments)
                    }
                }
            }
        },
        getAjQueryParam:function(config){
            if(queryParam.ajbh != ""){
                return queryParam;
            }
            var _scope=this;
            var _type=config.methodGet;
            var paramStr = config.localParams;
            var paramSplit = paramStr.split("&");
            for(var i = 0;i<paramSplit.length;i++){
                var param = paramSplit[i].split("=");
                if(param[0] == "ajbh"){
                    queryParam.ajbh = param[1];
                }
                if(param[0] == "ajlb"){
                    queryParam.ajlb = param[1];
                }
                if(param[0] == "ah"){
                    queryParam.ah = param[1];
                }
                if(param[0] == "fydm"){
                    queryParam.fydm = param[1];
                }
                if(param[0] == "ywlx"){
                    queryParam.nywlx = param[1];
                    queryParam.ywlx = param[1];
                }
                if(param[0] == "slType"){
                    queryParam.slType = param[1];
                }
                if(param[0] == "clbh"){
                    queryParam.clbh = param[1];
                }
                if(param[0] == "slType"){
                    queryParam.wslx = param[1] == "pjsl"?"判决书":"裁定书";
                    queryParam.slType = param[1];
                }
                if(param[0] == "gotopage"){
                    queryParam.gotopage = param[1];
                }
                if(param[0] == "wsid"){
                    queryParam.wsid = param[1];
                }
                if(param[0] == "aycode"){
                    queryParam.aycode = param[1];
                }
                if(param[0] == "rootAyCode"){
                    queryParam.rootAyCode = param[1];
                }
                if(param[0] == "callersystem"){
                    queryParam.callersystem = param[1];
                }
                if(param[0] == "view"){
                    queryParam.view = param[1];
                }

            }
            //保存页面操作
            return queryParam;
        },
        //uuid  随机生成32位id
        generateUUID : function (){
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return uuid.toUpperCase().split('-').join('');
        },
        //获取指定的window
        getWindow:function(_window){
            var  _window=_window;

            function  adjustWindow(_window){
                var  ___window=_window;
                var isTop = false;
                try{
                    isTop = ($(_window.document).find('#jsTop').size()>0
                        || _window.top.location.href == _window.self.location.href);
                }catch(e){
                    //如果报错 那么说明已经跨域 是别的系统在调用  返回当前的window
                    return  _window;
                }
                if(isTop){
                    return  ___window;
                }else {
                    // 重新赋值
                    ___window=___window.parent;
                    //  递归调用
                    return adjustWindow(___window)
                }
            }

            _window=adjustWindow(_window);

            return _window;

        },
        //复制对象
        cloneObj : function(obj) {
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
                newObj[key] = typeof val === 'object' ? this.cloneObj(val): val;
            }
            return newObj;
        },
        getLocalPath : function (isAbsUrl) {
            var curWwwPath = window.location.href;
            var pathName = window.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            var localhostPath = curWwwPath.substring(0, pos);
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return  isAbsUrl?(localhostPath + projectName + '/'):'';
        },
        /**
         * @time 2019-09-24  新增=> 为了统一管理日志
         * @param showLog   是否输出日志
         * @param name      名称
         * @param method  请求方式  post,get,
         * @param url   请求的url
         * @param requestData   请求的数据
         */
        consoleLogRequest:function(showLog,name,method,url,requestData){
            if(showLog){
                console.log(name?name:'');
                console.log('[[前台]]==>请求方式是');
                console.log(method?method:'');
                console.log('[[前台]]==>请求的url是');
                console.log(url?url:'');
                console.log('[[前台]]==>请求的数据是');
                console.log(requestData?requestData:'');
            }
        },
        /**
         * @time 2019-09-24  新增=> 为了统一管理日志
         * @param showLog    是否输出日志
         * @param name   名称
         * @param responseData 后台返回的数据
         */
        consoleLogResponse:function(showLog,name,responseData){
            if(showLog){
                console.log(name?name:'');
                console.log('(后台)==>返回的数据是');
                console.log(responseData?responseData:'');
            }
        },
        //  正在加载页面
        loading:function(){
            $('body').append('<div id="js-fd-loading-init"  class="fd-loading-init" ><span>数据加载中...</span></div>');
            //  文档加载完成后，那么添加一个ajax 方法
            _global.ajaxLoading();
        },
        // 移除正在加载页面
        removeLoading:function(){
            $('#js-page-init').css({
                opacity: 1,
                visibility:'visible'
            });
            if($('#js-fd-loading-init').length > 0) {
                $('#js-fd-loading-init').remove();
            }
        },
        //  ajax 加载
        ajaxLoading: function () {
            var topWindow = this.getWindow(window);
            //  判断当前的window是否是父级的window
            if( topWindow.location.href == window.self.location.href ){
                // 加载
                $(['<div class="fd-loading-contain fd-hide" id="js-loading" >',
                    ' <div class="fd-loading-mask"></div>',
                    ' <img  class="fd-log" src="../images/loading.gif" alt="正在加载的图片"/>',
                    '</div>'].join("")).appendTo('body');
            }
            $(document).ajaxStart(function() {

                _global.ajaxStartLoading();
                if(globalFd.ajaxTimer){
                    clearTimeout(globalFd.ajaxTimer);
                }
                globalFd.ajaxTimer =setTimeout(function(){
                    _global.removeLoading();
                },globalFd.ajaxTimeout);
            });

            $(document).ajaxStop(function() {
                //  防止有些图形没有完成绘制，所以数据加载完后1秒钟再移除
                setTimeout(function(){
                    _global.ajaxStopLoading();
                },0);
            });
        },
        // 显示转圈的小图片
        ajaxStartLoading:function(){
            var topWindow = this.getWindow(window);
            if($(topWindow.document).find('#js-loading').hasClass('fd-hide')){
                $(topWindow.document).find('#js-loading').removeClass('fd-hide');
            }
        },
        // 隐藏转圈的小图片
        ajaxStopLoading:function(){
            var topWindow = this.getWindow(window);
            if(!$(topWindow.document).find('#js-loading').hasClass('fd-hide')){
                $(topWindow.document).find('#js-loading').addClass('fd-hide');
            }
        },

        // 请求数据报错
        requestError:function(data, textStatus, errorThrown){
            // 2016-09-29 ，ie会直接弹窗报错，所用 try{}catch(e){}
            try{
                console.error('请求数据发生了错误');
                console.error(data);
            }catch(e){
                //console.log(e);
            }
        },

        // localStorage
        // 储存storage
        saveLocalStorage : function (name, value) {
            localStorage.setItem(name, value);
        },

        // 查找storage
        findLocalStorage : function (str) {
            var requestStr = localStorage.getItem(str);
            return requestStr;
        },

        // 删除storage
        deleteLocalStorage : function (str) {
            localStorage.removeItem(str);
        },

        //sessionStorage
        // 储存storage
        saveSessionStorage : function (name, value) {
            sessionStorage.setItem(name, value);
        },

        // 查找storage
        findSessionStorage : function (str) {
            var requestStr = sessionStorage.getItem(str);
            return requestStr;
        },

        // 删除storage
        deleteSessionStorage : function (str) {
            sessionStorage.removeItem(str);
        },
        //  获取url中的参数
        getUrlParams: function () {
            var  _url=window.location.href;
            // 问号的位置
            var _questionPlace=_url.indexOf('\?');
            var  _data=false;
            if(_questionPlace!=-1){
                //  截取字符串
                _data=_url.substr(_questionPlace+1);
                // 对字符串进行解密
                _data=decodeURIComponent(_data);
                //获取数据对象
                _data=JSON.parse(_data);
            }
            return  _data;
        },
        limit:10,
        //  保存文书
        saveWs: function (data,config,_vm) {
            var _type=config.isDebug?config.methodGet:config.methodPost;
            $.ajax({
                type :_type,
                url: config.url.frame.save,
                data:data,
                dataType : "json",
                success : function(data) {
                    // debugger
                    if(data.success){
                        //  保存成功
                        // 条件提示
                        $.alert({
                            type:'success'
                        });

                        //  是否已经编辑设置为false
                        _vm.sfybj=false;
                        //  是打印
                        if(_vm.isExport){
                            // 执行导出的方法
                            _vm.clickExport();
                            // 将值设置为false
                            _vm.isExport=false;
                        }else if(_vm.isPrint) {
                            // 执行打印的方法
                            _vm.clickPrint();
                            // 将值设置为false
                            _vm.isPrint=false;
                        }

                    }else {
                        // 条件提示
                        $.alert({
                            type:'fail'
                        });
                    }
                    //输出日志
                    _global.consoleLogResponse(config.showLog,'保存文书静态数据',data)
                },
                error : function(data, textStatus, errorThrown) {
                    //  报错信息
                    _global.requestError(data, textStatus, errorThrown);
                }
            });

            //输出日志
            _global.consoleLogRequest(config.showLog, '保存文书静态数据' , _type, config.url.frame.save, data);
        },
        // 判断文书是否存在
        adjustWs: function (_data,config) {
            var  _promise= $.Deferred();
            $.ajax({
                type :'get',
                url: config.url.frame.adjust,
                data:_data,
                dataType : "json",
                success : function(data) {
                    // debugger
                    if(data.success){
                        if(data.data){
                            // 存在数据
                            _promise.resolve()
                        }else {
                            // 请求数据
                            _promise.reject()
                        }
                    }
                    //输出日志
                    _global.consoleLogResponse(config.showLog,'判断文书是否存在文书静态数据',data)
                },
                error : function(data, textStatus, errorThrown) {
                    //  报错信息
                    _global.requestError(data, textStatus, errorThrown);
                }
            });
            //输出日志
            _global.consoleLogRequest(config.showLog, '判断文书是否存在文书静态数据' , 'get', config.url.frame.adjust,_data);

            return _promise;
        },
        //  操作文书
        operateWs: function (data,config) {
            var _type=config.methodGet;
            var _data=data;
            var  _serverData=[];
            $.each(_data, function (key,value) {
                //  id已经进行过一次编码，所以不需要再次编码
                if(key=='id'){
                    // 进行编码，防止中文乱码
                    _serverData.push(key+'='+value);
                }else{
                    // 进行编码，防止中文乱码
                    _serverData.push(key+'='+encodeURIComponent(value));
                }
            });
            //  用& 分隔
            _serverData='?'+_serverData.join('&');

            // data.operate=1是导出，data.operate=2 是打印pdf
            if(data.operate==1){
                //  导出
                window.open(config.url.frame.operate+_serverData,'_blank');
            }else if(data.operate==2){
                //   打印（pdf）
                window.open('pdf.html'+_serverData,'_blank');
            }

            //输出日志
            _global.consoleLogRequest(config.showLog, '操作文书静态数据' , _type, config.url.frame.operate, data);
        },

        /**
         * 绑定下拉框事件
         * click.dropMenuShow   显示下拉框
         * click.dropMenuHide   隐藏下拉框
         * 事件代理的处理方式
         *
         */
        bindDropMenuEvent: function () {
            /**
             * @description 下拉组件在页面上使用，需要下面需要以下几个class
             * js-drop-menu-contain  下拉组件的容器
             * js-drop-menu-trigger  下拉组件的触发器
             * js-drop-menu  下拉菜单
             * js-drop-item  下拉菜单条目
             *@author  wuwg
             *@time  2016-10-09
             */
            //下拉框鼠标悬浮移除事件

            //  给body绑定点击事件
            $('body').off('click.dropMenuShow').on('click.dropMenuShow','.js-drop-menu-trigger', function (event) {
                if(!$(event.target).parents('.fd-edit').hasClass('disabled')){
                    var  _this=$(this);
                    var  _dropMenu=_this.siblings('.js-drop-menu');
                    var  _dropComtain=_this.closest('.js-drop-menu-contain');
                    $('.js-drop-menu-contain').removeClass('extend');

                    //  隐藏其他的下拉框，显示当前点击的下拉框
                    $('.js-drop-menu').not(_dropMenu).addClass('fd-hide');
                    //  隐藏其他多选框
                    $('.js-dropdown-menu').addClass('hide');
                    var  _event=event||window.event;

                    var _target=$(event.target);

                    // 如果是点击的清除按钮，那么就不往下走了
                    if(_target.is('.js-fd-clear-icon')){
                        return;
                    }

                    // 如果当前的是显示的，那么就隐藏，反之一样
                    if(_dropMenu.hasClass('fd-hide')){
                        _dropMenu.removeClass('fd-hide');
                        _dropComtain.addClass('extend');
                        // 绑定下拉框的提示事件
                        //   _tipsObj.bindMouseTipsEvent(_tipsObj.dropMenuTips);
                        $('body').off('click.dropMenuHide').on('click.dropMenuHide', function (event) {
                            var  target=$(event.target);
                            if(target.parents().hasClass('js-drop-menu-contain')||target.hasClass('js-drop-menu-contain')){
                                // 如果点击的是条目的话，那么就应该隐藏，否则不隐藏
                                if(target.is('.js-drop-item') ||  target.is( '.tree-hd[canselected="true"] .tree-name') ){
                                    //  隐藏下拉框
                                    _dropMenu.addClass('fd-hide');
                                    // 去除展开类名
                                    _dropComtain.removeClass('extend');
                                    // 记得解除事件绑定
                                    $('body').off('click.dropMenuHide');
                                    // 记得解除下拉框的提示事件
                                    //    _tipsObj.unbindMouseTipsEvent();
                                }else {
                                    return false;
                                }
                            }else {
                                //  隐藏下拉框
                                _dropMenu.addClass('fd-hide');
                                // 去除展开类名
                                _dropComtain.removeClass('extend');
                                // 记得解除事件绑定
                                $('body').off('click.dropMenuHide');
                                // 记得解除下拉框的提示事件
                                //  _tipsObj.unbindMouseTipsEvent();
                            }
                        });
                    }else {
                        //  隐藏下拉框
                        _dropMenu.addClass('fd-hide');
                        // 去除展开类名
                        _dropComtain.removeClass('extend');
                        // 记得解除事件绑定
                        $('body').off('click.dropMenuHide');
                        // 解除下拉框的提示事件
                        // _tipsObj.unbindMouseTipsEvent();
                    }
                }
            });

            /*     /!**
             * @time  2016-10-09
             * @author wuwg
             * @description  为了解决下拉框出现...后数据看不全的问题，增加了一个提示框
             *!/
             var   _tipsObj={
             createTips:function(){
             $('<div class="fd-tips-contain"  id="jsDropMenuTips">这是提示框</div>')
             .css({
             'position':'absolute',
             'top':'0',
             'left':'0',
             'z-index':92,
             'background-color':'rgba(0,0,0,0.5)',
             'white-space':'nowrap',
             'font':'12px/20px "Microsoft YaHei"',
             'color':'#fff',
             'padding':'5px 10px',
             'border-radius':'5px',
             'display':'none'
             })
             .appendTo('body');

             return $('#jsDropMenuTips');
             },
             /!**
             * 操作tips
             *!/
             operateDropMenuTips:function(event,_dropMenuTips){
             var  _event=event||window.event,
             _top=_event.pageY,
             _left=_event.pageX,
             _text=$(_event.target).text();
             _dropMenuTips.text(_text)
             .css({
             top:_top,
             left:_left+15
             });
             },
             //  进行提示框绑定
             bindMouseTipsEvent:function(_dropMenuTips){
             // 这里的绑定事件都是先解除再绑定的
             $('body').off('mousemove.dropMenuTips').on('mousemove.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(event){

             if(_dropMenuTips.is(':visible')){
             // 操作tips
             _tipsObj.operateDropMenuTips(event,_dropMenuTips);
             }

             });
             $('body').off('mouseenter.dropMenuTips').on('mouseenter.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(event){
             if(!_dropMenuTips.is(':visible')){
             _dropMenuTips.css('display','block');
             // 操作tips
             _tipsObj.operateDropMenuTips(event,_dropMenuTips);
             }

             });
             //  隐藏提示框
             $('body').off('mouseleave.dropMenuTips').on('mouseleave.dropMenuTips','.js-drop-menu-contain .js-drop-item',function(){
             if(_dropMenuTips.is(':visible')){
             _dropMenuTips.css('display','none');
             }
             });
             },
             //  解除绑定
             unbindMouseTipsEvent : function (){
             $('body').off('mousemove.dropMenuTips');
             $('body').off('mouseenter.dropMenuTips');
             $('body').off('mouseleave.dropMenuTips');
             // 如果还有显示的一定要隐藏
             if(_tipsObj.dropMenuTips.is(':visible')){
             _tipsObj.dropMenuTips.css('display','none');
             }
             },
             // 元素
             dropMenuTips:$('#jsDropMenuTips'),
             // 初始化
             init:function(){
             // 创建下拉的提示框
             if(!_tipsObj.dropMenuTips.size()>0){
             _tipsObj.dropMenuTips=_tipsObj.createTips();
             }
             }
             };
             //  执行init方法
             _tipsObj.init();*/
        },
        //设置最大日期
        endDate:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
        //设置最小日期
        startDate:'1900-01-01',
        //判断 ie是否小于 ie9
        checkIeVersion:function  (){
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
        },
        //选择浏览器
        checkBrowser:function(){

            var userAgent = navigator.userAgent,
                rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
                rFirefox = /(firefox)\/([\w.]+)/,
                rOpera = /(opera).+version\/([\w.]+)/,
                rChrome = /(chrome)\/([\w.]+)/,
                rSafari = /version\/([\w.]+).*(safari)/;
            var browser;
            var version;
            var ua = userAgent.toLowerCase();
            function uaMatch(ua) {
                var match = rMsie.exec(ua);
                if (match != null) {
                    return { browser : "IE", version : match[2] || "0" };
                }
                var match = rFirefox.exec(ua);
                if (match != null) {
                    return { browser : match[1] || "", version : match[2] || "0" };
                }
                var match = rOpera.exec(ua);
                if (match != null) {
                    return { browser : match[1] || "", version : match[2] || "0" };
                }
                var match = rChrome.exec(ua);
                if (match != null) {
                    return { browser : match[1] || "", version : match[2] || "0" };
                }
                var match = rSafari.exec(ua);
                if (match != null) {
                    return { browser : match[2] || "", version : match[1] || "0" };
                }
                if (match != null) {
                    return { browser : "", version : "0" };
                }
            }
            var browserMatch = uaMatch(userAgent.toLowerCase());
            if (browserMatch.browser) {
                browser = browserMatch.browser;
                version = browserMatch.version;
            }
            return {
                browser:browser,
                version:version
            }

        },
        //2017年8月25日15:26:40新增，提示窗提到公用
        scTip: function (success,message,waitTime) {
            if(!waitTime){
                waitTime=400;
            }
            if(success){
                // 条件提示
                $.alert({
                    type:'success',
                    info :{
                        success:message
                    },
                    interval:waitTime
                });
            }else{
                // 条件提示
                $.alert({
                    type:'fail',
                    info :{
                        fail:message
                    },
                    interval:waitTime
                });
            }
        }

    };
    return  _global;
});