/**
 * @version:                2017.11.06
 * @createTime:            2017.11.06
 * @updateTime:            2017.11.06
 * @author:                    zhoubin
 * @description            民事框架页
 */

var params = {};
var aj = {};
var ajStr = "";

define(['fdGlobal', 'config'],
    /**
     *
     * @param fdGlobal
     * @param config
     * @param Vue
     * @param fdDataTable
     */
    function (fdGlobal, config) {
        var _config = JSON.parse(JSON.stringify(config));
        // 弹框关闭
        function close() {
           $(".fd-tab1-close").on("click", function () {
               $(this).parent().parent().hide();
           })
        }
        close();
        // 左侧tab切换
        function clickTab() {
            $(".fd-left-tab-top li").on("click", function () {
                var index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                $(".fd-left-tab-bottom").children(".fd-left-common-tab").eq(index).show().siblings().hide();
            })
        }

        clickTab();
        // 右侧顶部进度条
        function processLine() {
            $(".fd-right-tabtop-list").on("click",function () {
                var index = $(this).index();
                $(this).addClass("active");
                if(index!=0){
                    $(this).prev().children(".fd-right-tabtop-line").addClass("actives")
                }

                // $(this).children(".fd-right-tabtop-line").addClass("actives");
            })
        }
        processLine();
        // 右侧信息切换
        function changeCarousel() {
            var tabBtn = $(".fd-right-content-tabtitle li");
            var tabBtnLength = tabBtn.length;
            var tabChildren = $(".fd-right-childtab-wrap .fd-right-content-childtab");
            var arrow = $(".fd-right-content-toptab .fd-right-common-arrow");
            var index = 0;
            tabBtn.on("click", function () {
                index = $(this).index();
                message = [];
                $(this).addClass("active").siblings().removeClass("active");
                tabChildren.eq(index).show().siblings().hide();
            })
            arrow.on("click", function () {
                var directions = $(this).attr("id");
                doMove(directions);
            })
            function doMove(direction) {
                if (direction === "fd-right-toleft") {
                    if (index === 0) {
                        index = 0;
                        return;
                    }
                    index--;
                    tabChildren.eq(index).show().siblings().hide();
                    tabBtn.eq(index).addClass("active").siblings().removeClass("active");
                } else {
                    if (index === tabBtnLength - 1) {
                        index = tabBtnLength - 1;
                        return;
                    }
                    index++;
                    tabChildren.eq(index).show(500).siblings().hide(500);
                    tabBtn.eq(index).addClass("active").siblings().removeClass("active");
                }
            }
        }
        changeCarousel();
        //    显示提示信息
        function showMessage() {
            $(".fd-right-content-childtab1 .fd-right-jbxx-warn").hover(function () {
                    $(".fd-right-jbxx-warn .fd-right-warn-detail").show();
                }, function () {
                    $(".fd-right-jbxx-warn .fd-right-warn-detail").hide();
                }
            )
            $(".fd-right-warn-btn").on("click", function () {
                var updateMessage = $(this).siblings(".fd-right-warn-update").html();
                $(this).parents(".fd-right-jbxx-warn").next().children().val(updateMessage);
                console.log($(this).parents(".fd-right-jbxx-warn").next().children().val(updateMessage));
                $(this).parents(".fd-right-warn-detail").css("display", "none");
                console.log($(this).parents(".fd-right-warn-detail").length);
            })
        }

        showMessage();
        //    点击编辑
        function edit(tab) {
            var flag = 1;
            $("." + tab + " .fd-right-jbxx-edit").on("click", function () {
                if(flag === 1) {
                    $("." + tab + " .fd-right-jbxx input[type='text']").removeAttr("readonly");
                    $("." + tab + " .fd-right-jbxx input[type='text']").eq(0).focus();
                    $("." + tab + " .fd-right-jbxx input[type='text']").addClass("active");
                    flag = 0;
                } else {
                    $("." + tab + " .fd-right-jbxx input[type='text']").attr("readonly","readonly");
                    $("." + tab + " .fd-right-jbxx input[type='text']").removeClass("active");
                    flag = 1;
                }
            })
        }
        edit("fd-right-content-childtab1");
        edit("fd-right-content-childtab2");
        //  前科劣迹：选中
        function checkSelect(tab1, tab2, tab3) {
            var message = [];
            var iconLi = $("." + tab1 + ">." + tab2 + " .fd-right-qklj-li");
            for (var i = 0; i < iconLi.length; i++) {
                if (iconLi.eq(i).attr("class").indexOf("active") != -1) {
                    var iconActive = {
                        type: i,
                        detail: iconLi.eq(i).children(".fd-right-qklj-detail").html()
                    }
                    message.push(iconActive);
                }
            }
            var newMessage = "";
            for (var i = 0; i < message.length; i++) {
                newMessage += message[i].detail
            }
            $("." + tab1 + ">." + tab2 + " .fd-right-commit-detail").html(newMessage);
            iconLi.on("click", function () {
                var active = $(this).attr("class");
                console.log(tab3);
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    for (var j = 0; j < message.length; j++) {
                        var indexLi = $(this).index();
                        if (message[j].type === indexLi) {
                            message.splice(j, 1);
                        }
                    }
                } else {
                    $(this).addClass("active");
                    message.push({type: $(this).index(), detail: $(this).children(".fd-right-qklj-detail").html()});
                }
            })
            $("." + tab1 + ">." + tab2 + " .fd-right-qklj-btn").on("click", function () {
                var finishMessage = "";
                message.sort(compare("type"));
                for (var i = 0; i < message.length; i++) {
                    finishMessage += message[i].detail
                }
                $(this).next().html(finishMessage);
            })
            function compare(types) {
                return function (firstObj,secondObj) {
                    var firstValue = firstObj[types];
                    var secondValue = secondObj[types];
                    return firstValue - secondValue;
                }
            }
        };
        checkSelect("fd-right-content-childtab1", "fd-right-qklj");
        checkSelect("fd-right-content-childtab1", "fd-right-qzcs");
        checkSelect("fd-right-content-childtab2", "fd-right-qklj");
        checkSelect("fd-right-content-childtab2", "fd-right-qzcs");
    });