define(function (require) {
    var Vue = require('vue'),
        $api = require('config'),
        ajax = require('ajax'),
        IGrow = {},
        utilities = require('utilities');
    var app = new Vue({
        el: '#detail',
        data: {
            reply: {
                send: function () {
                    if (!$this.reply.data.content) {
                        utilities.tip('请输入回复内容');
                        return;
                    }
                    ajax($api.wxReply.create, {
                        uid: IGrow.user.uid,
                        detailid: utilities.routeParams.id,
                        content: $this.reply.data.content
                    }, function () {
                        $this.reply.replyed = true;
                        $this.textarea.attr('disabled', $this.reply.replyed);
                        sessionStorage.action = "inbox";
                        ajax($api.wxMessage.update, {
                            id: $this.detailData.messageid,
                            ischeckreply: 1
                        }, function () {
                            window.history.back();
                        });
                    });
                },
                list: function () {
                    ajax($api.wxReply.list, {
                        uid: IGrow.user.uid,
                        detailid: utilities.routeParams.id
                    }, function (result) {
                        $this.reply.data = result.data && result.data[0] || [];
                        $this.reply.replyed = !!$this.reply.data.content;
                        setTimeout(function () {
                            $this.textarea = $('textarea');
                            $this.textarea.attr('disabled', $this.reply.replyed);
                        });
                    });
                },
                data: {
                    content: ""
                },
                replyed: false
            },
            detailData: {},
            content: {},
            editorPlayer: [],
            loaded: false
        },
        methods: {
            init: function () {
                var callBack = function (data) {
                    !data.teacherSend && !data.isread && ajax($api.wxDetail.update, {
                        id: utilities.routeParams.id,
                        'isread': 1
                    });
                    if (data.pushtime) {
                        data.messageTime = utilities.getTime(data.pushtime * 1000, 'MM月dd日 ') + new Date(data.pushtime * 1000).toString().split(" ")[4].substring(0, 5);
                    }
                    if (data.message && data.message.config) {
                        if (typeof data.message.config == 'string') {
                            $this.content = JSON.parse(data.message.config);
                        }
                        if (typeof data.message.config == 'object') {
                            $this.content = data.message.config;
                        }
                    } else {
                        $this.content = {message: data.message.message};
                    }
                    if ($this.teacherSend) {
                        data.receivename = data.receivename.split('...')[0].split(',').join('，');
                    } else {
                        data.user && (data.user.avatar = data.user.avatar || 'img/default-avatar.png');
                        $this.reply.replyed = !!data.reply.length;
                        $this.reply.data.content = data.reply.toString();
                        setTimeout(function () {
                            $this.textarea = $('textarea');
                            $this.textarea.attr('disabled', $this.reply.replyed);
                        });
                    }
                    $this.detailData = data;
                    Vue.set($this.detailData, 'receiveShow', false);
                    $this.loaded = true;
                    setTimeout(function () {
                        utilities.imgPreview('#sms-content','.detail-con');
                        var wrap = $('#sms-content');
                        $.each(wrap.find('a'), function (index, item) {
                            if ($(item)[0].href.split(".").pop().toLowerCase() == 'mp3') {
                                $this.editorPlayer.push({
                                    name: $(item)[0].title,
                                    url: $(item)[0].href,
                                    playing: false,
                                    type: 'editor',
                                    img:'img/stop.png',
                                    id: $(item)[0].href.split("school_file/")[1] ? $(item)[0].href.split("school_file/")[1].split(".mp3")[0].slice(9) : $(item)[0].href.split(".com/")[1].split(".mp3")[0].slice(11) + index
                                });
                                $(item).parent().children("img").remove();
                                $(item).parent().css("display", 'none');
                            }
                        });
                    },10);
                };
                $this.teacherSend = sessionStorage.teacherSend == 'true';
                $this.detailAction = sessionStorage.action == 'list';
                $this.teacherSend ? ajax($api['wxMessage'].get, {
                    id: utilities.routeParams.id,
                    _relatedfields: 'user.avatar'
                }, function (result) {
                    var data = result.data || {};
                    data.teacherSend = true;
                    data.messageid = data.id;
                    data.message = utilities.copy(data);
                    callBack(data);
                }) : ajax($api['wxDetail'].get, {
                    id: utilities.routeParams.id,
                    _relatedfields: 'message.*,user.avatar'
                }, function (result) {
                    callBack(result.data || {});
                });
            },
            playAudio: function (data) {
                var player = document.getElementById(data.type == 'editor' ? data.id : data.url);
                !player.src && (player.src = data.url);
                Vue.set(data, 'playing', !data.playing);
                data.playing ? player.play() : player.pause();
                !data.addEnded && player.addEventListener('ended', function () {
                    Vue.set(data, 'playing', false);
                });
                data.img = data.playing ? 'img/playing.png' : 'img/stop.png';
                data.addEnded = true;
                $this.editorPlayer.length && $this.editorPlayer.forEach(function (line) {
                    if (line.playing && line.url != data.url) {
                        document.getElementById(line.id).pause();
                        Vue.set(line,'playing',false);
                        line.img = 'img/stop.png';
                    }
                });
                $this.content.voiceRecord && $this.content.voiceRecord.length && $this.content.voiceRecord.forEach(function (line) {
                    if (line.playing && line.url != data.url) {
                        document.getElementById(line.url).pause();
                        Vue.set(line,'playing',false);
                    }
                });
            },
            showReceiver : function(){
                $this.detailData.receivename.length > 20 && ($this.detailData.receiveShow = !$this.detailData.receiveShow);
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