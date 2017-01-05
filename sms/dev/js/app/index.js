define(function (require) {
    var Vue = require('vue'),
        $api = require('config'),
        ajax = require('ajax'),
        IGrow = {},
        utilities = require('utilities'),
        sensitiveWords = ["新疆独立", "西藏独立", "藏独", "疆独", "台独", "反政府", "反国家", "法轮", "李洪志", "转法轮", "大法轮", "轮功", "共铲党", "九评共产党", "明慧网", "退党", "无网界浏览", "无网界", "美国之音", "自由亚洲", "毛泽东", "江泽民", "胡锦涛", "温家宝", "文化大革命", "六四", "陈良宇", "大纪元", "真善忍", "新唐人", "六四事件", "反华", "共匪", "政府软弱", "政府无能", "达赖", "警察殴打", "中央军委", "针对台湾", "中共走狗", "中共小丑", "共奴", "中共恶霸", "共产无赖", "流氓政府", "内斗退党", "江理论", "党内分裂", "新生网", "圆明网", "修炼之歌", "发正念", "和平修炼", "放下生死", "大法大福", "大硞弟子", "大纪元", "支联会", "共产专制", "共产极权", "专政机器", "共产王朝", "大法洪传", "毛派", "法网恢恢", "邓派", "五套功法", "宇宙最高法理", "法轮佛法", "谁是新中国", "法正人间", "法正乾坤", "正法时期", "海外护法", "洪发交流", "报禁", "党禁", "鸽派", "鹰派", "赣江学院暴动", "全国退党", "绝食抗暴", "维权抗暴", "活体器官", "中共暴政", "器官移植", "中共恶霸", "共产无赖", "中共当局", "胡温政府", "江罗集团", "师傅法身", "正派民运", "中华联邦政府", "亲共行动", "联邦政府", "流氓民运", "特务民运", "中共当局", "江贼民", "中共警察", "中共监狱", "中共政权", "中共迫害", "自由联邦", "中共独枭", "流氓无产者", "中共专制", "明慧周刊", "共狗", "性交易", "性服务", "特殊服务", "处女膜", "AV片", "AV女", "迷奸药", "三级片", "色情网站", "色情", "情色", "口交", "裸聊", "阴茎", "阴毛", "性虐待", "黄色网站", "成人用品", "成人网站", "成人小说", "成人文学", "成人电影", "成人影视", "成人漫画", "成人图片", "黄色电影", "黄色影视", "黄色小说", "黄色文学", "黄色图片", "黄色漫画", "坐台小姐", "应招妓女", "成人论坛", "性免费电影", "小电影", "阳萎", "迷药", "鸡巴", "日你", "摸奶", "小姐", "破鞋", "避孕套", "卫生巾", "艳照门", "男女公关", "感情陪护", "三陪先生", "三陪小姐", "阴部", "会阴", "挑逗", "强奸", "肉棍", "淫靡", "淫水", "湿身", "性交", "做爱", "性事", "性游戏", "性高潮", "性欲", "色欲", "情欲", "情色", "少女高潮", "X夜激情", "失身", "春宵", "轮奸", "叫床", "色诱", "情色", "波波", "骚", "两性狂情", "夜激情", "一夜情", "处女终结者", "干柴烈火", "咪咪", "小弟弟", "激情", "性爱", "隐私", "热辣", "禁区", "风骚", "高潮", "云雨", "销魂", "乳房", "赤裸", "裸体", "A片", "毛片", "黄片", "发情", "嘿咻", "双腿间的禁地", "命根", "老二", "阴毛", "思想开放", "我靠", "勾引", "他妈的", "江湖淫娘", "网络色情网址大全", "粗口歌", "激情电影", "AV", "十八禁", "女优", "18禁", "金瓶梅", "丝袜", "美腿", "三级片", "少儿不宜", "藏春阁", "玉蒲团", "SM", "3P", "偷拍", "台湾18DY电影", "H动漫", "H漫画", "买春", "隐私图片", "美腿写真", "丝袜写真", "陈冠希", "阿娇", "艳照", "CGX", "熟女", "美少妇", "换妻", "销售发票", "枪支", "弹药", "武器", "黑车", "套牌车", "走私车", "办证", "放账", "高利贷", "高利息贷款", "高息贷款", "放贷款", "敲诈", "勒索", "假证", "偷渡", "黑社会", "复仇", "抽奖", "卖车办证", "售卖武器", "假发票", "新货", "窃听", "窃取", "利息", "商会", "贷款", "走私", "监听", "售票", "抽奖", "刻章，地下钱庄", "窃听器", "代开普通发票", "代开商品发票", "代开国税发票", "代开地税发票", "代开广告发票", "代开运输发票", "代开租赁发票", "代开维修发票", "代开建筑发票", "代开安装发票", "代开餐饮发票", "代开服务发票", "代开发票", "仿真假钞", "全新假钞", "出售假钞", "隐形喷剂", "反雷达测速", "假币", "出售枪支", "出售手枪", "代开发票", "代办证件", "英语枪手", "假钞", "窃听", "窃听器", "电话拦截系统", "探测狗", "手机卡复制器", "监听王", "手机跟踪定位器", "监听器", "针孔摄像", "监听宝", "楼盘", "抢购", "现房", "买一送二", "大酬宾", "打折", "抽奖", "火热抢购", "买赠", "1折", "2折", "3折", "4折", "5折", "6折", "7折", "8折", "9折", "一折", "二折", "三折", "四折", "五折", "六折", "七折", "八折", "九折", "抓奖", "送电费", "特惠", "商品降价", "惠送", "积分中奖", "网站点播", "赠送", "www.r130-9.com", "火爆", "酬宾", "大奖", "www.12530.com", "东突", "薄熙来", "薄瓜瓜", "谷开来", "王立军", "群交", "暴力", "喇嘛", "达赖喇嘛", "台湾独立", "马英九", "陈水扁", "萧万长", "谢长廷", "公投", "入联公投", "返联公投", "法轮功", "DAFA", "HONGZHI", "ZHENSHANREN", "YUANMAN", "三去车仑", "李瑞环", "尉健行", "李岚清", "一党专制", "江泽民当局", "江核心", "江路线", "江泽民政权", "江老贼", "江神经", "弘法会", "灵修团体", "大法之声", "和平修念", "大法弟子", "天安门受难人", "真修弟子", "弟子正法", "大陆同修", "师父法身", "大法师傅", "法轮大法", "五套功法", "开周天秘法", "玄音大师", "中功小周天", "组场练功", "组场治病", "张宏宝尊师", "中功弟子", "金麒麟网", "吴官正", "海洛因", "摇头丸", "菩提法门", "台湾中华民国", "达赖十四", "打砸抢烧", "haozj88", "翼校通", "班班通", "nzjstv", "cnvzn.com", "单向收费", "联合通讯", "联合通信", "李登辉", "与政府抗衡", "和平演变", "一台一中", "一边一国", "拉登", "朱榕基", "自焚", "胡耀邦", "党派斗争", "法西斯", "四人帮", "颠覆", "刘少奇", "共祸", "共匪", "共祸", "共匪", "亲共行动", "共产小组", "共奴", "政治恶棍", "政治小丑", "大法洪传", "功友", "李洪志大师", "李洪志先生", "真善忍大法", "宇宙最高法理", "成人图片", "激情图片", "情色图片", "裸体写真", "少女写真", "成人电影", "无码电影", "性爱电影", "A片", "色情光碟", "级片", "学生妹", "成人文学", "性爱文学", "成人小说", "成人聊天室", "咸湿", "买春", "成人用品", "性用品", "情趣用品", "一夜情", "把马子", "钓凯子", "AV女郎", "做爱", "援交", "肛交", "SM虐待", "群交", "叫床", "鸡巴", "阴茎", "阴道", "性器", "阳具", "肉棒", "强暴", "性侵害", "猥亵", "偷窥狂", "冰毒", "甲基苯丙胺", "麻黄碱", "胡椒基甲基酮", "异黄樟脑", "布道", "自杀", "游行", "示威", "绝食", "两国论", "台湾国", "雪山狮子旗", "西藏国土图", "激情小电影", "六合彩", "非典型性肺炎", "李大师", "去死", "他妈的", "她妈的"],
        webUpload = function () {
            var element = $("#upLoader"),
                $this = app,
                config = {
                    accept: {
                        extensions: "bmp,gif,jpg,jpeg,png",
                        mimeTypes: "image/bmp,image/gif,image/jpeg,image/jpeg,image/png"
                    },
                    auto: true,
                    chunkRetry: 0,
                    chunked: true,
                    compress: {
                        allowMagnify: false,
                        compressSize: 204800,
                        crop: false,
                        height: 1600,
                        noCompressIfLarger: false,
                        preserveHeaders: true,
                        quality: 80,
                        width: 1600
                    },
                    disableGlobalDnd: true,
                    duplicate: true,
                    fileSingleSizeLimit: 10485760,
                    pick: {
                        capture: "camera",
                        configkey: "default_asset",
                        multiple: true,
                        id: element
                    },
                    prepareNextFile: true,
                    threads: 5,
                    thumb: {
                        allowMagnify: false,
                        crop: true,
                        height: 90,
                        quality: 80,
                        type: "image/jpeg",
                        width: 90
                    }
                },
                opts = {
                    //指令事件
                    events: {
                        startUpload: function () {
                            $this.imgIndex = 0;
                            $this.uploadNum = $this.imgList.length;
                            $this.photo.loadTip = '开始上传照片';
                            $('#imgUpload').show();
                        },
                        fileQueued: function (file) {
                            $this.chooseImg++;
                        },
                        uploadFinished: function (file) {
                            setTimeout(function () {
                                $this.photo.loadTip = '已完成上传';
                            }, 300);
                            setTimeout(function () {
                                $('#imgUpload').hide();
                            }, 1000);
                            $this.chooseImg = 0;
                            $this.needReset && this.reset();
                        },
                        uploadSuccess: function (file, result) {
                            var file = {
                                id: file.id,
                                url: file.url
                            };
                            $this.imgIndex++;
                            file.src = file.url;
                            $this.imgList.push(file);
                            $this.photo.list.push(file.id);
                            $this.photo.queued[file.id] = file;
                            $this.photo.loadTip = '已完成上传 ' + ($this.imgIndex + $this.uploadNum) + ' / ' + ($this.chooseImg + $this.uploadNum > 9 ? 9 : ($this.chooseImg + $this.uploadNum));
                            $this.photo.list.length >= 9 && this.reset();
                        },
                        error: function (type, file, result) {
                            $('#imgUpload').hide();
                            type != 'Q_EXCEED_NUM_LIMIT' && utilities.tip('上传失败：' + (!!result && result.message ? result.message : ''));
                            if ('ERROR_TOKEN_GET' === type || type == 'ERROR_RESUMESTATUS_GET') {
                                $this.needReset = true;
                            }
                        }
                    }
                };
            //调整file控件位置
            var resetInput = function () {
                setTimeout(function () {
                    var input = element.find('input[type=file]').first(),
                        parent = input.parent(),
                        keepclick = false;

                    element.append(input);
                    parent.remove();

                    //避免频繁点击操作
                    input.click(function (e) {
                        if (keepclick) {
                            e.stopPropagation();
                            return false;
                        }
                        keepclick = true;
                        setTimeout(function () {
                            keepclick = false;
                        }, 1000);
                    });
                });
            };
            //如果对象已存在，则添加按钮，不再重新初始化
            if (opts.WebUploader) {
                opts.WebUploader.addButton({id: element});
                resetInput();
                return;
            }
            opts.WebUploader = WebUploader.create(config);
            //遍历并绑定上传事件
            $.each(opts.events, function (key, value) {
                opts.WebUploader.on(key, function () {
                    var _this = this, _arguments = arguments;
                    setTimeout(function () {
                        value.apply(_this, _arguments)
                    });
                })
            });
            resetInput();
        },
        anyDate = function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);
            return {
                y: dd.getFullYear(),
                m: dd.getMonth() + 1,
                d: dd.getDate(),
                time: dd.getTime()
            };
        },
        compareDate = function (time, day) {
            //time:秒,day: 0=今天,-1=昨天
            day = day || 0;
            var dd = new Date(time * 1000),
                y = dd.getFullYear(),
                m = dd.getMonth() + 1,
                d = dd.getDate();
            if (y == anyDate(day).y && m == anyDate(day).m && d == anyDate(day).d) {
                return true
            }
            return false
        };
    var app = new Vue({
        el: '#index',
        data: {
            actionType: 'send',
            isTeacher: false,
            title: '通知',
            content: '',
            serviceType: {
                XXT: false,
                wxSms: false,
                pureWX: false,
                QXT: false
            },
            loaded: {
                flag: false,
                serviceType: false,
                sendList: false,
                inboxList: false
            },
            sendData: [],
            inboxData: [],
            inboxSearch: {
                name: '',
                init: true
            },
            page: 1,
            recordData: {
                recordVoice: [],
                loadTip: '点麦克风开始录音',
                start: false,
                duration: '',
                time: ''
            },
            receiver: {
                sendSms: false,
                count: {},
                teacherName: false,
                receivename: ''
            },
            wxName: 'unknown',
            photo: {
                queued: {},
                list: [],
                loadTip: '开始上传照片'
            },
            WXJSSDKAuth: false,
            imgList: [],
            imgListLocal: [],
            previewData: {},
            imgIndex: 0,
            chooseImg: 0,
            sender: ''
        },
        methods: {
            tabCheck: function (action) {
                var $this = this;
                $this.actionType = action;
                $('body').scrollTop(0);
                $this.page = 1;
                switch (action) {
                    case 'send':
                        $this.title = '通知';
                        $this.init();
                        break;
                    case 'list':
                        $this.sendList();
                        $this.scrollLoad(window, $this.sendList, 'sendList');
                        break;
                    case 'inbox':
                        $this.inboxSearch = {
                            name: '',
                            init: true
                        };
                        $this.inboxList();
                        $this.scrollLoad(window, $this.inboxList, 'inboxList');
                        setTimeout(function () {
                            $('.receive-tip').hide();
                            IGrow['receive-tip'] = true;
                        }, 7000);
                        break;
                }
            },
            init: function () {
                var $this = this;
                $this.isTeacher = !!IGrow.user.school.people.teacherid;
                if (sessionStorage.action) {
                    $this.actionType = sessionStorage.action;
                    delete sessionStorage.action;
                } else {
                    $this.actionType = $this.isTeacher ? 'send' : 'inbox';
                }
                switch ($this.actionType) {
                    case 'send':
                        if (sessionStorage.SMS_Receiver) {
                            var json = JSON.parse(sessionStorage.SMS_Receiver);
                            $this.receiver.receivename = json.name || '';
                            $this.receiver.school = json.school;
                        }
                        delete sessionStorage.SMS_Receiver;
                        $this.receiver.teacherName = !!$this.receiver.sendSms;
                        //获取学校服务类型
                        new Promise(function (resolve) {
                            sessionStorage.serviceType
                                ?
                                resolve('ok')
                                :
                                ajax($api.schoolType.list, {
                                    schoolid: IGrow.school.id
                                }, function (result) {
                                    sessionStorage.serviceType = JSON.stringify(result.data.length ? result.data[0] : {servicetype: 0});
                                    resolve('ok');
                                })
                        }).then(function () {
                            var type = JSON.parse(sessionStorage.serviceType);
                            $this.serviceType = {
                                XXT: type.servicetype == 0,
                                wxSms: type.servicetype == 1,
                                pureWX: type.servicetype == 2,
                                QXT: type.servicetype == 3,
                                JSDX: type.servicetype == 4
                            };
                            $this.serviceType.currentType = (function () {
                                var type = '';
                                ['XXT', 'wxSms', 'pureWX', 'QXT', 'JSDX'].forEach(function (item) {
                                    !!$this.serviceType[item] && (type = item);
                                });
                                return type;
                            })();
                            $this.receiver.sendSms = $this.serviceType.XXT;
                            $this.receiver.teacherName = $this.serviceType.XXT;
                        });
                        //获取微信绑定信息
                        new Promise(function (resolve) {
                            sessionStorage.wxName
                                ?
                                resolve('ok')
                                :
                                ajax($api.wxInfo.get, {
                                    schoolid: IGrow.school.id
                                }, function (result) {
                                    sessionStorage.wxName = result.data.length ? result.data[0].name : 'unknown';
                                })
                        }).then(function () {
                            $this.wxName = sessionStorage.wxName;
                        });
                        $this.sender = IGrow.user.realname;
                        //初始化上传图片
                        $this.wxInfo = {
                            openid: $this.getCookie('openid')
                        };
                        $this.getBindInfo($this.wxInfo.openid).then(function (res) {
                            $this.wxInfo.platformid = res.platformid;
                            var authCode = '';
                            Promise.all([
                                new Promise(function (resolve) {
                                    ajax($api.platform.get, {
                                        id: $this.wxInfo.platformid
                                    }, function (result) {
                                        IGrow.wxInfo = result.data;
                                        resolve('ok');
                                    }, function () {
                                        webUpload();
                                    });
                                }),
                                new Promise(function (resolve) {
                                    ajax($api.wxJSSDK.mediaauthget, {
                                        platformid: res.platformid
                                    }, function (result) {
                                        authCode = result.code;
                                        resolve('ok');
                                    }, function () {
                                        webUpload();
                                    });
                                })
                            ]).then(function () {
                                $this.WXJSSDKAuth = authCode == 0 && IGrow.wxInfo && IGrow.wxInfo.setjsapidomain == 1;  //(code==0,微信上传方式)
                                authCode == 0 && IGrow.wxInfo && IGrow.wxInfo.setjsapidomain == 1 ? $this.bindWXJSSDK() : webUpload();
                            })
                        });
                        break;
                    case 'inbox':
                        $this.tabCheck('inbox');
                        break;
                    case 'list':
                        $this.tabCheck('list');
                        break;
                }
            },
            textFocus: function () {
                //安卓机软键盘遮挡表单
                if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
                    setTimeout(function () {
                        $('.publish-content').scrollTop(300);
                    }, 600);
                }
            },
            sendList: function (page) {
                var $this = this,
                    reviewlist = [],
                    starttime = parseInt(new Date(utilities.getTime(+new Date - 30 * 24 * 60 * 60 * 1000, 'yyyy/MM/dd')) / 1000),
                    endtime = parseInt((+new Date(utilities.getTime(+new Date, 'yyyy/MM/dd')) + (24 * 60 * 60 - 1) * 1000) / 1000),
                    messageData = {
                        pushstarttime: starttime,
                        pushendtime: endtime,
                        _page: page || 1,
                        _pagesize: 10,
                        msgtype: "WX_SMS_NOTICE,WEB_SMS,WEB_SMS_SPCL",
                        _relatedfields: 'user.avatar',
                        _orderby: 'pushtime desc'
                    };
                page = page || 1;
                $this.isMaster = IGrow.user.role['school.sysadmin'] || IGrow.user.role['school.master'];
                !$this.isMaster && (messageData.uid = IGrow.user.uid);
                return new Promise(function (resolve) {
                    ajax($api.wxMessage.list, messageData, function (result) {
                        $this.loaded.sendList = true;
                        reviewlist = result.data || [];
                        reviewlist.forEach(function (item) {
                            item.teacherSend = true;
                            item.messageid = item.id;
                            item.message = utilities.copy(item);
                        });
                        $this.dealListTime(reviewlist);
                        $this.sendData = $this.sendData ? $this.sendData.concat(reviewlist) : reviewlist;
                        $this.loaded.flag = result.extra.total > page * 10;
                        resolve('ok');
                    });
                });
            },
            inboxList: function (page) {
                var $this = this,
                    reviewlist = [],
                    starttime = parseInt(new Date(utilities.getTime(+new Date - 30 * 24 * 60 * 60 * 1000, 'yyyy/MM/dd')) / 1000),
                    endtime = parseInt((+new Date(utilities.getTime(+new Date, 'yyyy/MM/dd')) + (24 * 60 * 60 - 1) * 1000) / 1000),
                    data = {
                        objectuid: IGrow.user.uid,
                        pushstarttime: starttime,
                        pushendtime: endtime,
                        isdelete: 0,
                        _page: page || 1,
                        _pagesize: 10,
                        msgtype: "WX_SMS_NOTICE,WEB_SMS,WEB_SMS_SPCL",
                        _relatedfields: 'message.*,user.avatar',
                        _orderby: 'pushtime desc'
                    };
                $this.inboxSearch.name && (data.sendname = $this.inboxSearch.name);
                page = page || 1;
                return new Promise(function (resolve) {
                    ajax($api.wxDetail.list, data, function (result) {
                        $this.loaded.inboxList = true;
                        reviewlist = result.data || [];
                        reviewlist.forEach(function (item) {
                            item.user.avatar = item.user.avatar || 'img/default-avatar.png';
                        });
                        $this.dealListTime(reviewlist);
                        $this.inboxData = $this.inboxData ? $this.inboxData.concat(reviewlist) : reviewlist;
                        $this.loaded.flag = result.extra.total > page * 10;
                        resolve('ok');
                    })
                })
            },
            dealListTime: function (array) {
                (array || []).forEach(function (item) {
                    if (compareDate(item.pushtime, 0)) {
                        item.smsTime = new Date(item.pushtime * 1000).toString().split(" ")[4].substring(0, 5);
                    } else if (compareDate(item.pushtime, -1)) {
                        item.smsTime = '昨天 ' + new Date(item.pushtime * 1000).toString().split(" ")[4].substring(0, 5);
                    } else {
                        item.smsTime = utilities.getTime(item.pushtime * 1000, 'MM月dd日 ') + new Date(item.pushtime * 1000).toString().split(" ")[4].substring(0, 5);
                    }
                });
            },
            scrollLoad: function (wrap, listFn, type) {
                var $this = this;
                setTimeout(function () {
                    $this.page = 1;
                    $(wrap).off().on('scroll', function () {
                        if ($('body').scrollTop() + $(window).height() >= $(document.body).height()) {
                            if ($this.loaded[type] && $this.loaded.flag) {
                                $this.loaded[type] = false;
                                var page = (++$this.page);
                                $.isFunction(listFn) && listFn(page);
                            }
                        }
                    });
                },10);
            },
            bindWXJSSDK: function () {
                function wxJssdkInit() {
                    ajax($api.wxJSSDK.sdkencrypt, {
                        openid: $this.wxInfo.openid,
                        url: location.href.split('#')[0]
                    }, function (result) {
                        wx.config({
                            debug: false,
                            appId: result.data.appId,
                            timestamp: result.data.timestamp,
                            nonceStr: result.data.nonceStr,
                            signature: result.data.signature,
                            jsApiList: ['chooseImage', 'uploadImage', 'startRecord', 'stopRecord', 'playVoice', 'uploadVoice', 'onVoiceRecordEnd']
                        })
                    })
                };
                if (typeof WeixinJSBridge == 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', wxJssdkInit, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', wxJssdkInit);
                        document.attachEvent('onWeixinJSBridgeReady', wxJssdkInit);
                    }
                } else {
                    wxJssdkInit();
                }
            },
            removePicture: function () {
                var $this = this, file = $this.previewData, imgIndex = 0;
                delete $this.photo.queued[file.id];
                $this.photo.list.splice($this.photo.list.indexOf(file.id), 1);
                $this.imgList.forEach(function (item, index) {
                    file.id == item.id && (imgIndex = index);
                });
                $this.imgList.splice(imgIndex, 1);
                $('#previewPictureModal').hide();
            },
            previewPicture: function (imgData) {
                var clientHeight = $(window).height() - 103,
                    clientWidth = $(window).width() - 50,
                    previewPictureModal = $('#previewPictureModal'),
                    cssObj = {
                        'max-width': clientWidth,
                        'max-height': clientHeight,
                        'margin': '0 auto'
                    }, $this = this;
                previewPictureModal.show();
                var img = document.createElement('img'),
                    wrap = previewPictureModal.find('.modal-body')[0];
                img.addEventListener('load', function () {
                    wrap.children[0].style.cssText = 'display:none;';
                    wrap.children[1].style.cssText = 'display:block;';
                    previewPictureModal.find('img').css(cssObj);
                });
                img.style.display = 'none';
                if (wrap.children[1]) {
                    wrap.replaceChild(img, wrap.children[1]);
                } else {
                    wrap.appendChild(img);
                }
                img.src = imgData.src;
                previewPictureModal.find('img').css(cssObj);
                $this.previewData = imgData;
                previewPictureModal.off().click(function () {
                    previewPictureModal.hide();
                });
            },
            imgChoose: function () {
                var $this = this;
                wx.chooseImage({
                    success: function (res) {
                        setTimeout(function () {
                            $this.imgListLocal = res.localIds || [];
                            $this.imgIndex = 0;
                            $this.uploadNum = $this.imgList.length;
                            if ($this.imgList.length < 9) {
                                $this.imgUpload($this.imgListLocal[$this.imgIndex]);
                                $this.photo.loadTip = '开始上传照片';
                                $('#imgUpload').show();
                            } else {
                                mNotice('最多只能上传9张图片！', 'error');
                            }
                        }, 100);
                    }
                })
            },
            imgUpload: function (localId) {
                var $this = this;
                $this.imgIndex++;
                wx.uploadImage({
                    localId: localId,
                    isShowProgressTips: 0,
                    success: function (res) {
                        ajax($api.mediaUpload.get, {
                            automask: 'false',
                            media_id: res.serverId,
                            configkey: 'default_asset',
                            platformid: $this.wxInfo.platformid
                        }, function (result) {
                            var file = result.data;
                            file.id = file.url;
                            file.src = file.url;
                            $this.imgList.push(file);
                            $this.photo.list.push(file.url);
                            $this.photo.queued[file.id] = file;
                            $this.photo.loadTip = '已完成上传 ' + ($this.imgIndex + $this.uploadNum) + ' / ' + ($this.imgListLocal.length + $this.uploadNum > 9 ? 9 : ($this.imgListLocal.length + $this.uploadNum));
                            if ($this.imgList.length < 9 && $this.imgListLocal.length > $this.imgIndex) {
                                $this.imgUpload($this.imgListLocal[$this.imgIndex]);
                            } else {
                                $this.photo.loadTip = '已完成上传';
                                $timeout(function () {
                                    $('#imgUpload').hide();
                                }, 800)
                            }
                        }, function () {
                            if ($this.imgListLocal.length - 1 >= $this.imgIndex && $this.imgList.length < 9) {
                                $this.imgUpload($this.imgListLocal[$this.imgIndex]);
                            }
                        });
                    }
                });
            },
            send: function () {
                var $this = this;
                if (!$this.receiver.receivename.length) {
                    utilities.tip('请选择接收人');
                    return
                }
                if (!$this.title) {
                    utilities.tip('请输入标题');
                    return
                }
                if (!$this.content) {
                    utilities.tip('请输入内容');
                    return
                }
                var hasSensitiveWords = [];
                $this.content && sensitiveWords.forEach(function (item) {
                    !!~$this.content.indexOf(item) && (hasSensitiveWords.push(item));
                });
                if (hasSensitiveWords.length) {
                    utilities.tip('消息内容中存在敏感文字【' + hasSensitiveWords.toString() + '】请修改短信后重新发送！');
                    return;
                }
                var send = function (receiver, schoolId) {
                    var smsData = {
                            msgtype: 'WX_SMS_NOTICE',
                            sendtype: 22,
                            title: $this.title || '',
                            content: $this.content || '',
                            btosuf: 1,
                            btoself: 1,
                            btoname: 1,
                            schoolid: schoolId,
                            receiver: receiver.receiverData,
                            receivename: receiver.name.toString(),
                            src: 'WEIXIN',
                            method: 'POST'
                        },
                        wxData = {
                            btosuf: 1,
                            btoname: 1,
                            btoself: 1,
                            sendtype: 22,
                            src: 'WEIXIN',
                            method: 'POST',
                            operator: $this.uid,
                            message: $this.content,
                            msgtype: 'WX_SMS_NOTICE',
                            template: 'SCHOOLNOTIFY',
                            title: $this.title || '',
                            sender: '-' + IGrow.user.realname,
                            schoolid: schoolId,
                            postdata: JSON.stringify({
                                "first": {//标题
                                    "value": $this.title || '',
                                    "color": "#3569B5"
                                },
                                "keyword1": {//学校
                                    "value": IGrow.school.shortname,
                                },
                                "keyword2": {//通知人
                                    "value": IGrow.user.realname,
                                    "color": "#FFB6BB"
                                },
                                "keyword3": {//时间
                                    "value": utilities.getTime(+new Date(), 'yyyy-MM-dd'),
                                },
                                "keyword4": {//通知内容
                                    "value": $this.content,
                                    "color": "#3569B5"
                                },
                                "remark": {//备注
                                    "value": "",
                                    "color": "#173177"
                                }
                            }),
                            receivename: receiver.name.toString(),
                            receiver: JSON.stringify(receiver.receiverData),
                            url: 'http://wx.igrow.cn/wxtom/v1/sms/detail.html?id=PUSHMESSAGEDETAILID'
                        },
                        sendPromise = [],
                        imgConfig = [];
                    $this.receiver.teacherName && (smsData.sender = '-' + $this.sender);
                    $this.imgList.forEach(function (item) {
                        imgConfig.push({
                            url: item.url,
                            urlhash: item.urlhash || ''
                        });
                    });
                    wxData.config = JSON.stringify({
                        config: imgConfig,
                        message: utilities.filterEmoji($this.content),
                        voiceRecord: $this.recordData.recordVoice
                    });
                    switch ($this.serviceType.currentType) {
                        case 'XXT':
                            sendPromise.push(new Promise(function (resolve) {
                                ajax($api.wx.msgpush, wxData, function () {
                                    resolve('ok');
                                })
                            }));
                            $this.receiver.sendSms && sendPromise.push(new Promise(function (resolve) {
                                ajax($api.sms.send, smsData, function () {
                                    resolve('ok');
                                })
                            }));
                            break;
                        case 'wxSms':
                            wxData.smscontent = $this.content;
                            sendPromise.push(new Promise(function (resolve) {
                                ajax($api.wx.msgpush, wxData, function () {
                                    resolve('ok');
                                })
                            }));
                            break;
                        case 'pureWX':
                            if ($this.wxName != 'unknown') {
                                wxData.smscontent = '您有一条新的消息未查看，请立即关注并绑定学校正在使用的微信公众号“' + $this.wxName + '”。';
                            }
                            sendPromise.push(new Promise(function (resolve) {
                                ajax($api.wx.msgpush, wxData, function () {
                                    resolve('ok');
                                })
                            }));
                            break;
                        case 'QXT':
                            wxData.smscontent = $this.content;
                            sendPromise.push(new Promise(function (resolve) {
                                ajax($api.wx.msgpush, wxData, function () {
                                    resolve('ok');
                                })
                            }));
                            break;
                        case 'JSDX':
                            var teacher = [], student = [];
                            console.log(receiver);
                            receiver.receiverData.forEach(function (item) {
                                (item.type == 12 || item.type == 24) ? teacher.push(item) : student.push(item);
                            });
                            if (teacher.length) {
                                var teaWxData = utilities.copy(wxData);
                                teaWxData.receiver = JSON.stringify(teacher);
                                teaWxData.receivename = receiver.teacherName.toString();
                                smsData.receivename = receiver.teacherName.toString();
                                smsData.receiver = teacher;
                                sendPromise.push(new Promise(function (resolve) {
                                    ajax($api.wx.msgpush, teaWxData, function () {
                                        resolve('ok');
                                    });
                                }));
                                sendPromise.push(new Promise(function (resolve) {
                                    ajax($api.sms.send, smsData, function () {
                                        resolve('ok');
                                    });
                                }));
                            }
                            if (student.length) {
                                wxData.smscontent = $this.content;
                                wxData.receiver = JSON.stringify(student);
                                wxData.receivename = receiver.studentName.toString();
                                sendPromise.push(new Promise(function (resolve) {
                                    ajax($api.wx.msgpush, wxData, function () {
                                        resolve('ok');
                                    });
                                }));
                            }
                            break;
                    }
                    return sendPromise;
                }, sendPromise = [], callback = function () {
                    $this.init();
                    $this.tabCheck('list');
                };

                $.each($this.receiver.school, function (index, item) {
                    item.receiverData.length && (sendPromise = sendPromise.concat(send(item, index)));
                });

                Promise.all(sendPromise).then(callback);
            },
            recordReady: function () {
                $('#record').show();
                setTimeout(function () {
                    $('.record-mask').css('cursor', 'pointer');
                    $('.record-mask').off().bind('click', function () {
                        $('#record').hide();
                    });
                });
                $this.recordData.loadTip = '点麦克风开始录音';
            },
            record: function () {
                if ($this.recordRate) {
                    utilities.tip('请不要频繁操作');
                    return;
                }
                $this.recordRate = true;
                setTimeout(function () {
                    $this.recordRate = false
                }, 1000);
                $this.recordData.start = !$this.recordData.start;
                if ($this.recordData.start) {
                    $this.recordData.time = 1;
                    $this.recordData.duration = '0';
                    var sec = 0;
                    $this.timeInterval = setInterval(function () {
                        $this.recordData.time++;
                        if ($this.recordData.time == 10) {
                            $this.recordData.time = 0;
                            sec++;
                            $this.recordData.duration = $this.returnFormattedToSeconds(sec);
                        }
                        if (sec == 59) {
                            $this.stopRecord();
                            $this.recordData.duration = '60';
                        }
                    }, 100);
                    wx.startRecord({
                        success: function () {
                            $this.recordData.loadTip = '点麦克风停止录音';
                        },
                        fail: function () {
                            $('#record').hide();
                            $this.recordData.start = false;
                        },
                        cancel: function () {
                            $('#record').hide();
                            $this.recordData.start = false;
                        }
                    });
                } else {
                    $this.stopRecord();
                }
            },
            playAudio: function (data) {
                var player = document.getElementById(data.url);
                !player.src && (player.src = data.url);
                data.playing = !data.playing;
                data.playing ? player.play() : player.pause();
                !data.addEnded && player.addEventListener('ended', function () {
                    data.playing = false;
                });
                data.addEnded = true;
            },
            removeVoice: function (data) {
                var line = 0;
                $this.recordData.recordVoice.forEach(function (item, index) {
                    if (data.url == item.url) {
                        line = index
                    }
                });
                $this.recordData.recordVoice.splice(line, 1);
            },
            stopRecord: function () {
                $('#record').hide();
                clearInterval($this.timeInterval);
                wx.stopRecord({
                    success: function (res) {
                        wx.uploadVoice({
                            localId: res.localId,
                            isShowProgressTips: 1,
                            success: function (res) {
                                $api.mediaUpload.get({
                                    automask: 'false',
                                    media_id: res.serverId,
                                    configkey: 'default_asset',
                                    platformid: $this.wxInfo.platformid
                                }, function (result) {
                                    var voice = result.data || [];
                                    voice.name = 'wxRecord';
                                    voice.duration = $this.recordData.duration;
                                    $this.recordData.recordVoice.push(voice);
                                });
                            }
                        });
                    },
                    fail: function () {
                        $('#record').hide();
                    }
                });
            },
            sendSmsCtrl: function () {
                var $this = this;
                $this.receiver.sendSms = !$this.receiver.sendSms;
                $this.receiver.teacherName = !!$this.receiver.sendSms;
            },
            getCookie: function (cookie_name) {
                var allcookies = document.cookie;
                var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度

                // 如果找到了索引，就代表cookie存在，
                // 反之，就说明不存在。
                if (cookie_pos != -1) {
                    // 把cookie_pos放在值的开始，只要给值加1即可。
                    cookie_pos += cookie_name.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
                    var cookie_end = allcookies.indexOf(";", cookie_pos);

                    if (cookie_end == -1) {
                        cookie_end = allcookies.length;
                    }

                    var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
                }
                return value;
            },
            getBindInfo: function (openId) {
                return new Promise(function (resolve) {
                    $.ajax({
                        type: "get",
                        url: location.origin + "/api/checkuserbind/" + openId,
                        dataType: "json",
                        success: function (data) {
                            resolve(data);
                        },
                        error: function () {
                            webUpload();
                        }
                    });
                })
            },
            returnFormattedToSeconds: function (time) {
                var minutes = Math.floor(time / 60),
                    seconds = Math.round(time - minutes * 60);
                return seconds;
            },
            jumpSession: function (key, value) {
                var $this = this;
                delete sessionStorage.teacherSend;
                delete sessionStorage.action;
                delete sessionStorage.item;
                sessionStorage[key] = JSON.stringify(value);
                sessionStorage.action = $this.actionType;
                sessionStorage.teacherSend = !!value.teacherSend;
            },
            objectSearch: function () {
                $this.sessionList = utilities.copy($this.inboxData);
                $this.inboxSearch.init = false;
                $this.inboxData = [];
                $this.inboxList();
                $this.loaded.inboxList = false;
            },
            resetSearch: function () {
                if (!$this.inboxSearch.name && $this.sessionList) {
                    $this.inboxData = $this.sessionList;
                }
            }
        }
    });

    var $this = app;

    utilities.basicData().then(function () {
        IGrow = window.IGrow;
        app.init();
    }).catch(function () {
        app.init();
    });

});