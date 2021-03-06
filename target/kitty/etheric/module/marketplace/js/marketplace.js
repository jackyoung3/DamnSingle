/**
 * 交易所
 */
var marketInit = function () {
    fadeInOutLoad(marketPageLoad, null);
};

/**
 * 交易所页面初始加载内容
 */
var marketPageLoad = function (params) {
    headerInit();
    var obj = {
        "page": "marketInit",
        "paramJson": null
    };
    leftToRightArray.push(obj);
    $("#all-container").append(marketText);

    slectCheck(1); //页面跳转时，默认排序

    //点击类型筛选
    $(".marketplace-filter").click(function () {
        $(".filterArea-background").show();
        $(".marketplace-container").css("position", "fixed");

        $(document).unbind("click").bind("click", function (event1) {
            if ($(event1.target).hasClass("filterArea-background")) {
                $(".filterArea-background").hide();
                $(".marketplace-container").css("position", "absolute");
                $(".filter-group-content .filter-group-item").removeClass("filter-group-item-addclass");
            }
        })

        $(".filter-group-content .filter-group-item").unbind("click").bind("click", function () {
            if ($(this).hasClass("filter-group-item-addclass")) {
                $(this).removeClass("filter-group-item-addclass");
                waitModel();
                slectCheck(1);
                return;
            }
            $(this).addClass('filter-group-item-addclass').siblings().removeClass('filter-group-item-addclass');
            waitModel();
            slectCheck(1);
        })
    })

    //点击for sale
    $(".marketplace-classify .for-sale").click(function () {
        if ($(this).hasClass("classify-title-active")) {
            return;
        }
        console.log("222");
        $(this).addClass('classify-title-active').siblings().removeClass('classify-title-active');       
        showMarketHeaderLine();//导航栏的选中market显示下划线
        waitModel();
        slectCheck(1);
    })

    //点击siring
    $(".marketplace-classify .for-siring").click(function () {
        if ($(this).hasClass("classify-title-active")) {
            return;
        }
        console.log("222");
        //请求交配的猫数据 data
        $(this).addClass('classify-title-active').siblings().removeClass('classify-title-active');
        removeHeaderLine(); //移除header的导航栏选中下划线
        waitModel();
        slectCheck(1);
    })
    //点击Gen 0
    $(".marketplace-classify .for-Generation-0").click(function () {
        if ($(this).hasClass("classify-title-active")) {
            return;
        }
        console.log("222");
            $(this).addClass('classify-title-active').siblings().removeClass('classify-title-active');
            removeHeaderLine();//移除header的导航栏选中下划线
            waitModel();
            slectCheck(1);
        })
        //点击All kitties
        $(".marketplace-classify .for-all").click(function () {
            if ($(this).hasClass("classify-title-active")) {
                return;
            }
            console.log("222");
            $(this).addClass('classify-title-active').siblings().removeClass('classify-title-active');
            removeHeaderLine();//移除header的导航栏选中下划线
            waitModel();
            slectCheck(1);
        });

    $('.search-input-content').focus(function() {
        $('.marketplace-search-filter .marketplace-search').css("flex","100%");
        $('.marketplace-search-toSearch').show();
        $('.marketplace-search-toCancle').show();
        // $('.search-dog-attr').show();      //查询更多狗属性按钮，暂时不用，勿删！
        $('.marketplace-search-dog').show();
        // $('.marketplace-search-filter').css("height", "15.2vw");   //暂时不用，勿删！
        // $('.marketplace-search-dog').css("height", "15.2vw");
    });
    $('.marketplace-search-toSearch').bind("click", function () {
        waitModel();
        searchByInput(1);
    });

    $('.marketplace-search-toCancle').click(function () {
        clearInput();
    });
    $('.filter-select').bind("change", function () {
        waitModel();
        slectCheck(1);
    });

    $('.market-gen-toSearch').bind("click", function () {
        waitModel();
        slectCheck(1);
    });

    $('.market-gen-toCancle').bind("click", function () {
        $('#13').val("");
        waitModel();
        slectCheck(1);
    });

    //点击查询更多狗属性 （暂时不用，勿删）
    // $('.search-dog-attr').bind("click", function() {
    //     attributesInit();
    // });
}



//分页组件的使用
var pagePart = function (data) {
    var totalDataNum = data.kitties_count;
    if (totalDataNum <= data.limitNum) {
        $('#page').hide();
        return;
    }
    $('#page').show();
    $('#page').pagination({
        totalData: totalDataNum,
        showData: data.limitNum,
        coping: true,

        callback: function (api) {
            var index = api.getCurrent();
            waitModel();
            if(!isNull(data.search)) {       //区分筛选排序与搜索的分页
                slectCheck(index, 1);
            } else {
                searchByInput(index, 1);
            }
            $('body,marketplace-container').animate(
                {scrollTop: 0},
                100);  //点击分页按钮，将页面返回到顶端
        }
    });
}

//价格单位转换
var priceConversion = function (price) {
    var conversedPrice = parseInt(price) * ethRate;
    return conversedPrice.toFixed(3);
}

//添加页面数据
var fillMarketPageData = function (data) {
    var kittyName = "";
    if (!isNull(data) || !isNull(data.kitties)) {     //判断筛选查询是否有数据
        $('.no-kitty-show').remove();
        $(".marketplace-content-library .library-container").append(showNoKitty);
        return;
    }
    $('.no-kitty-show').remove();          //将没有查询结果的提示去掉，防重复
    for (var i = 0; i < data.kitties.length; i++) {
        if (isNaN(data.kitties[i].kitty.name)) {         //判断狗的名子,若没有则赋一个名子
            kittyName = decodeURIComponent(data.kitties[i].kitty.name);
        } else {
            kittyName = LText.Kitty;
        }
        var text =
            '<div class="kitty-library-item" id="kitty-' + data.kitties[i].kitty.id + '">' +

            '<a href=""></a>' +
            '<div class="kitty-item-container" >' +
            '<div class="kitty-item" id="kittyIndex' + i + '" >' +
            '<image class="kitty-item-photo" src="' + data.kitties[i].kitty.image_url + '" id="index' + i + '">' +
            '</div>' +
            '<div class="kitty-bottom">' +
            '<div class="kitty-item-details">' +
            '<span class="kitty-item-details-item">' + kittyName + "&nbsp" + data.kitties[i].kitty.id + '</span>' +
            '<span class="kitty-item-details-item">' + ' · ' + LText.Generation + data.kitties[i].kitty.generation + '</span>' +
            '<span class="kitty-item-details-item">' + ' · ' + cooldown[data.kitties[i].status.cooldown_index] + '</span>' +
            '</div>' +
            '<div class="kitty-item-actions">' +
            '<div class="kitty-item-actions-action">' +
            '<span class="kitty-item-actions-icon"></span>' +
            '<span class="kitty-item-actions-number">' + data.kitties[i].purrs.count + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        var status_text = null;
        var status_icon = null;
        switch(data.kitties[i].type) {     //判断狗的状态,根据狗的状态选择状态名称、图标
            case "sale": 
                status_text = LText.ForSale;
                status_icon = "tag";
                break;
            case "sire": 
                status_text = LText.WantsToSire;
                status_icon = "eggplant";
                break;
        }

        var newKitties =                 //添加狗的"新"的标签
            '<div class="kitty-item-newBadge">' +
            '<div class="triangle-newBadge">' +
            '<div class="triangle-text" style="color:red">' + LText.New + '</div>' +
            '</div>' +
            '</div>';

        $(".marketplace-content-library .library-container .kitty-library").append(text);    //拼接狗的信息
        if ((new Date()).valueOf() - data.kitties[i].created_at <= Config.limitNew) {     //判断狗的状态是否为新
            $('#index' + i + '.kitty-item-photo').after(newKitties);              //添加“新”的标记
            if(localStorage.getItem(HTML_LANGUAGE) == "zh") {                    //根据语言，对“新”的位置做调整
                $('.triangle-text').css("bottom","8.7vw");
            } else {
                $('.triangle-text').css("bottom", "6.7vw");
            }
        }
        $('#kittyIndex' + i + '' ).css("background-color", data.kitties[i].kitty.color);  //添加狗的背景

        if (!data.kitties[i].status.is_ready) {       //判断、展示狗状态， ready--sire、sale; noReady--reste、gestate
            if (data.kitties[i].status.is_gestating) {
                var restText = '<div class="kitty-item-status">' +
                    '<div class="status-item">' +
                    '<i class="status-itemIcon"></i>' +
                    '<span class="status-itemText">' + LText.Gestating + "≡" + '</span>' +
                    '<span class="status-itemprice">' + MillisecondToDate_text(data.kitties[i].left_cooldown) + '</span>' +
                    '</div>' +
                    '</div>';

                $(".kitty-library-item:last .kitty-item-container .kitty-item").append(restText);
                $(".kitty-library-item:last .status-item .status-itemIcon").css("background-image", "url(./module/detail/img/oven.svg)");
            } else {
                var restText = '<div class="kitty-item-status">' +
                    '<div class="status-item">' +
                    '<i class="status-itemIcon"></i>' +
                    '<span class="status-itemText">' + LText.Resting + "≡" + '</span>' +
                    '<span class="status-itemprice">' + MillisecondToDate_text(data.kitties[i].left_cooldown) + '</span>' +
                    '</div>' +
                    '</div>';

                $(".kitty-library-item:last .kitty-item-container .kitty-item").append(restText);
                $(".kitty-library-item:last .status-item .status-itemIcon").css("background-image", "url(./module/detail/img/timer.svg)");
            }
        } else if (isNaN(data.kitties[i].type)) {
            var childText = '<div class="kitty-item-status">' +
                '<div class="status-item">' +
                '<i class="status-itemIcon"></i>' +
                '<span class="status-itemText">' + status_text + ' ≡ ' + '</span>' +
                '<span class="status-itemprice">' + priceConversion(data.kitties[i].current_price) + '</span>' +
                '</div>' +
                '</div>';

            $(".kitty-library-item:last .kitty-item-container .kitty-item").append(childText);
            $(".kitty-library-item:last .status-item .status-itemIcon").css("backgroundImage", "url(./module/detail/img/" + status_icon + ".svg)"); //交配照片or出售照片
        }
        var newBadgeText = ''
        //绑定进入详情页面的点击事件
        $("#kittyIndex" + i).bind("click", {
            indexData: data.kitties[i]
        }, jumpNextPage);

        //绑定点赞的点击事件
        $("#kitty-" + data.kitties[i].kitty.id + " .kitty-item-actions-icon").bind("click", {
            indexData: data.kitties[i]
        }, clickKittyPraise);

    }
};

//点击不同类型kitty 跳转至不同的页面
function jumpNextPage(e) {
    var chooseData = e.data.indexData;
    var params = {
        "kitty_id": chooseData.kitty.id
    }
    kittyInit(params);
}
//点赞
var clickKittyPraise = function (e) {
    waitModel();

    var chooseData = e.data.indexData;
    //userId(operate_id), kitty_id, owner_id, type = 3(点赞专用)
    clickPraise(chooseData.kitty.id, "marketplace");
}

//筛选的点击事件
var slectCheck = function (index, type) {
    $('.out-select-main').hide();
    $('.out-select-main').attr("id", "true");
    var x = $('.classify-title-active').attr("id");
    var y = $('.filter-select option:selected').attr("id");
    var w = $('#kittyType .filter-group-item-addclass').attr("id");
    var q = $('#kittyCooldown .filter-group-item-addclass').attr("id");
    var t = $('#13').val();
    var z = $('.search-dog-attr-chose-item').attr("id");
    var searchKitty = $('.search-input-content ').val();
    if (!isNull(searchKitty)) {   //无搜索条件
        searchKitty = 0;
    }
    var index = index;
    if (isNaN(w)) {      //无珍稀、普通、极品筛选条件
        w = 0;
    }
    if(!isNull(q)) {      //无冷却条件
        q = -1;
    }
    if(!isNull(t)) {     //无代数条件
        t = -1;
    } else {
        try {            //有代数条件，判断代数是否是数字
            t = parseInt(t);
        } catch (e) {
            $('#13').val("");
            destory();
            return;
        }
    }
    if (x == 3 && t != -1) { //已有初代的筛选条件
        $('#13').val("");
        destory();
        return;
    }
    if(!isNull(z)) {      //无属性条件
        z = 0;
    }
    $.ajax({
        url: Config.address + "homePageSelectKittyByType",
        data: {
            pageType: x,
            choseType: y,
            fileType: w,
            index: index,
            userId: 0,
            searchKitty: searchKitty,
            choseGen: t,
            choseCooldown: q,
            attr: z,
        },
        type: "POST",
        success: function (data) {
            console.log(data);
            destory();
            $(".kitty-item-container").empty();
            fillMarketPageData(data);
            if (type != 1) {     //防止分页回调函数重置分页
                pagePart(data);
            }
            $('.cats-number').html(data.kitties_count);
            setTimeout(function () {
                if (data.kitties.length) { //当前页面没有数据时，不发请求
                    sendRequest(parseArray(data), "marketplace");
                }
            }, 10);
        },
        error: function (xhr) {
            var text = nextJson(LText.Title, LText.SystemTitle, 1, [LText.Ok], [OK]);
            promptText(text);
            destory();
        }
    });
}

//解析并返回的数据中的kitty_id数组
var parseArray = function (data) {
    var arr = new Array();
    for (var item in data.kitties) {
        arr.push(data.kitties[item].id);
    }
    return arr;
};

//查询此页面的猫，该userId点赞的情况
var sendRequest = function (dataArray, typePage) {
    $.ajax({
        url: Config.address + "isPraiseKitty",
        data: {
            kittyIdArray: dataArray,
            operate_id: userId,
        },
        type: "POST",
        success: function (data) {
            console.log(data);
            if (data.state == 2) {
                if (typePage == "marketplace") {
                    console.log("marketplace.js return success"); //对此提示进行显示
                    for (var index in data.praisedIdList) {
                        var kitty_id = data.praisedIdList[index];
                        $("#kitty-" + kitty_id + " .kitty-item-actions-icon").unbind("click");
                        $("#kitty-" + kitty_id + " .kitty-item-actions-icon").css("background-image", "url(./module/detail/img/praised.png)");
                        $("#kitty-" + kitty_id + " .kitty-item-actions-icon").attr("isPraise", true);
                    }
                } else if (typePage == "myKitty") {
                    console.log("myKitty.js return success"); //对此提示进行显示
                    for (var index in data.praisedIdList) {
                        var kitty_id = data.praisedIdList[index];
                        $("#myKitty-" + kitty_id + " .list-item-actions-icon").unbind("click");
                        $("#myKitty-" + kitty_id + " .list-item-actions-icon").css("background-image", "url(./module/detail/img/praised.png)");
                        $("#myKitty-" + kitty_id + " .list-item-actions-icon").attr("isPraise", true);
                    }
                } else if (typePage == "detail") {
                    console.log("detail.js return success"); //对此提示进行显示
                    if (data.praisedIdList.length) { //即对此猫存在点赞行为
                        $(".kitty-message-zan").unbind("click");
                        $(".kitty-message-zan .zan-heart").css("background-image", "url(./module/detail/img/praised.png)");
                    }
                }
            }
        },
        error: function (xhr) {
            console.log("error: " + xhr.status);
            var text = nextJson(LText.Title, LText.SystemTitle, 1, [LText.Ok], [OK]);
            promptText(text);
            destory();
        }
    });
};

//点赞后的数据库更新
var clickPraise = function (kitty_id, typePage) {
    if (!isNull(userId)) {
        return;
    }
    $.ajax({
        url: Config.address + "praiseKitty",
        data: {
            operate_id: userId, //需要重新设置
            kitty_id: kitty_id,
            type: 3,
        },
        type: "POST",
        success: function (data) {
            console.log(data);
            showClickedpraise(kitty_id, data.msg.state, typePage) //判断点赞后的返回数据，对页面进行修改
            destory();
        },
        error: function (xhr) {
            console.log("error: " + xhr.status);
            var text = nextJson(LText.Title, LText.SystemTitle, 1, [LText.Ok], [OK]);
            promptText(text);
            destory();
        }
    });
}
/**
 * 搜索栏查询
 */
var searchByInput = function (index, type) {
    var searchKitty = $('.search-input-content ').val();
    var index = index;
    if (!isNull(searchKitty)) {
        destory();
        return;
    }
    $.ajax({
        url: Config.address + "searchKittyByInput",
        type: "POST",
        data: {
            msg: searchKitty,
            index: index,
        },
        success: function (data) {
            console.log(data);
            destory();
            $(".kitty-item-container").empty();
            fillMarketPageData(data);
            if (type != 1) {      //防止分页回调函数重置分页
                pagePart(data);
            }
            $('.cats-number').html(data.kitties_count);
            setTimeout(function () {
                if (isNull(data)) { //当前页面没有数据时，不发请求
                    sendRequest(parseArray(data), "marketplace");
                }
            }, 10);
        },
        error: function (error) {
            var text = nextJson(LText.Title, LText.SystemTitle, 1, [LText.Ok], [OK]);
            promptText(text);
            destory();
        }
    });
}

//清空搜索栏
var clearInput = function() { 
     $('.search-input-content ').val("");
     marketInit();
}

//判断点赞后的返回数据，对页面进行修改
var showClickedpraise = function (kitty_id, returnState, typePage) {
    if (returnState == 6) {
        if (typePage == "marketplace") {
            console.log("marketplace.js,click praise success"); //对此提示进行显示
            var currentpPraiseNum = parseInt($("#kitty-" + kitty_id + " .kitty-item-actions-number").html());
            $("#kitty-" + kitty_id + " .kitty-item-actions-number").html(currentpPraiseNum + 1);
            $("#kitty-" + kitty_id + " .kitty-item-actions-icon").unbind("click");
            $("#kitty-" + kitty_id + " .kitty-item-actions-icon").css("background-image", "url(./module/detail/img/praised.png)");
            $("#kitty-" + kitty_id + " .kitty-item-actions-icon").attr("isPraise", true);
        } else if (typePage == "detail") {
            console.log("datail.js,click praise success"); //对此提示进行显示
            var currentpPraiseNum = parseInt($(".kitty-message-zan .zan-num").html());
            $(".kitty-message-zan .zan-num").html(currentpPraiseNum + 1);
            $("#kitty-detail-zan .zan-heart").unbind("click");
            $("#kitty-detail-zan .zan-heart").css("background-image", "url(./module/detail/img/praised.png)");
            $("#kitty-detail-zan .zan-heart").attr("isPraise", true);
        } else if (typePage == "myKitty") {
            console.log("myKitty.js,click praise success"); //对此提示进行显示
            var currentpPraiseNum = parseInt($("#myKitty-" + kitty_id + " .list-item-actions-number").html());
            $("#myKitty-" + kitty_id + " .list-item-actions-number").html(currentpPraiseNum + 1);
            $("#myKitty-" + kitty_id + " .list-item-actions-icon").unbind("click");
            $("#myKitty-" + kitty_id + " .list-item-actions-icon").css("background-image", "url(./module/detail/img/praised.png)");
            $("#myKitty-" + kitty_id + " .list-item-actions-icon").attr("isPraise", true);
        }
    }
    if (returnState == 8 || returnState == 1) {
        if (returnState == 1) {
            console.log("userId null"); //对此提示进行显示
        } else if (returnState == 8) {
            console.log("You praised the kitty"); //对此提示进行显示
        }
        if (typePage == "marketplace") {
            $("#kitty-" + kitty_id + " .kitty-item-actions-icon").attr("isPraise", true);
        } else if (typePage == "myKitty") {
            $("#myKitty-" + kitty_id + " .list-item-actions-icon").attr("isPraise", true);
        }
    }
};