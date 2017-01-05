define(function (require) {
    var Vue = require('vue'),
        $api = require('config'),
        ajax = require('ajax'),
        IGrow = {},
        utilities = require('utilities');
    var app = new Vue({
        el: '#readCount',
        data: {
            replyed: true,
            isread: true,
            tabType: utilities.routeParams.action,
            detailItem: JSON.parse(sessionStorage.item),
            replyCount : {
                replyed:'',
                noReply:''
            },
            readCount : {
                read:'',
                noRead:''
            },
            loaded:{
                //判断是否进行过初始化
                read:false,
                noRead:false,
                reply:false,
                noReply:false
            },
            loading : true,
            list:{
                replyed: function (page) {
                    $this.loading = true;
                    page = $this.replyData.page || 1;
                    ajax($api.wxReply.list,{
                        _page: page,
                        _pagesize: 20,
                        messageid: utilities.routeParams.messageid,
                        _relatedfields: 'user.realname,user.mobile'
                    }, function (result) {
                        $this.loading = false;
                        $this.replyData = $this.replyData ? $this.replyData.concat(result.data || []) : result.data || [];
                        $this.replyData.page = page;
                        $this.replyData.flag = result.extra.total > page * 20;
                        $this.replyCount.replyed = result.extra.total;
                        $this.flag = result.extra.total > page * 20;
                        $this.loaded.reply = true;
                    });
                },
                noReply: function (page) {
                    $this.loading = true;
                    page = $this.noReplyData.page || 1;
                    ajax($api.wxDetail.list,{
                        _page: page,
                        _pagesize: 20,
                        pushstarttime: parseInt(new Date(utilities.getTime(+new Date - 30 * 24 * 60 * 60 * 1000, 'yyyy/MM/dd')) / 1000),
                        pushendtime: parseInt((+new Date(utilities.getTime(+new Date, 'yyyy/MM/dd')) + (24 * 60 * 60 - 1) * 1000) / 1000),
                        messageid: utilities.routeParams.messageid,
                        _relatedfields: "user.realname,objectuser.mobile,"
                    }, function (result) {
                        $this.loading = false;
                        var temp = [];
                        (result.data || []).forEach(function (item) {
                            !item.reply.length && temp.push(item);
                        });
                        $this.noReplyData = $this.noReplyData ? $this.noReplyData.concat(temp) : temp;
                        $this.noReplyData.page = page;
                        $this.noReplyData.flag = result.extra.total > page * 20;
                        $this.flag = result.extra.total > page * 20;
                        $this.loaded.noReply = true;
                    });
                },
                read: function (page) {
                    $this.loading = true;
                    page = ($this.isread ? $this.readData.page : $this.noReadData.page) || 1;
                    ajax($api.wxDetail.list,{
                        _page: page,
                        _pagesize: 20,
                        isread: $this.isread ? 1 : 0,
                        pushstarttime: parseInt(new Date(utilities.getTime(+new Date - 30 * 24 * 60 * 60 * 1000, 'yyyy/MM/dd')) / 1000),
                        pushendtime: parseInt((+new Date(utilities.getTime(+new Date, 'yyyy/MM/dd')) + (24 * 60 * 60 - 1) * 1000) / 1000),
                        messageid: utilities.routeParams.messageid,
                        _relatedfields: "user.realname,objectuser.mobile"
                    }, function (result) {
                        $this.loading = false;
                        if ($this.isread) {
                            $this.readData = $this.readData ? $this.readData.concat(result.data || []) : result.data || [];
                            $this.readData.flag = result.extra.total > page * 20;
                            $this.readData.page = page;
                        } else {
                            $this.noReadData = $this.noReadData ? $this.noReadData.concat(result.data || []) : result.data || [];
                            $this.noReadData.flag = result.extra.total > page * 20;
                            $this.noReadData.page = page;
                        }
                        $this.readCount[$this.isread ? 'read' : 'noRead'] = result.extra.total;
                        $this.flag = result.extra.total > page * 20;
                        $this.loaded[$this.isread ? 'read' : 'noRead'] = true;
                    });
                }
            },
            replyData: [],
            noReplyData: [],
            readData: [],
            noReadData: []
        },
        methods: {
            init: function () {
                $this.replyCount.replyed = $this.detailItem.replynumber;
                $this.replyCount.noReply = $this.detailItem.pushall - $this.detailItem.replynumber;
                $this.readCount.read = $this.detailItem.readnumber;
                $this.readCount.noRead = $this.detailItem.pushall - $this.detailItem.readnumber;
                ajax($api.wxMessage.update, {
                    id: utilities.routeParams.messageid,
                    ischeckreply: 0
                });
                if ($this.tabType == 'reply') {
                    $this.list.replyed();
                    $this.scrollLoad('.list', $this.list.replyed);
                } else {
                    $this.list.read();
                    $this.scrollLoad('.list', $this.list.read);
                }
            },
            tab: function (type, active) {
                $this.tabType = type;
                if (type == 'reply') {
                    $this.replyed = !!active;
                    if ($this.replyed) {
                        !$this.loaded.reply && $this.list.replyed();
                        $this.flag = $this.replyData.flag || false;
                    } else {
                        !$this.loaded.noReply && $this.list.noReply();
                        $this.flag = $this.noReplyData.flag || false;
                    }
                    $this.scrollLoad('.list', $this.replyed ? $this.list.replyed : $this.list.noReply);
                } else if (type == 'read') {
                    $this.isread = !!active;
                    if ($this.isread) {
                        !$this.loaded.read && $this.list.read();
                        $this.flag = $this.readData.flag || false;
                    } else {
                        !$this.loaded.noRead && $this.list.read();
                        $this.flag = $this.noReadData.flag || false;
                    }
                    $this.scrollLoad('.list', $this.list.read);
                }
            },
            scrollLoad: function (wrap, listFn) {
                var $this = this;
                setTimeout(function () {
                    $this.page = 1;
                    $(wrap).off().on('scroll', function () {
                        if (this.scrollTop, this.clientHeight, this.scrollHeight) {
                            if ($this.loading && $this.flag) {
                                $this.loading = true;
                                var page = (++$this.page);
                                $.isFunction(listFn) && listFn(page);
                            }
                        }
                    });
                });
            }
        }
    });

    var $this = app;

    utilities.basicData().then(function () {
        IGrow = window.IGrow;
        $this.init();
    }).catch(function () {
        $this.init();
    });

});