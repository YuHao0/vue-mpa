define(function () {
    //var server_host = location.origin + '/api/1.1b/', api_host = location.origin + '/api/';
    var server_host = 'http://m.igrow.cn/api/1.1b/', api_host = 'http://m.igrow.cn/api/';
    return {
        server_host: server_host,
        schoolClass: {
            list: server_host + 'school/class/list',
            'get': server_host + 'school/class/get',
            'search': server_host + 'school/class/search'
        },
        school: {
            'get': server_host + 'school/get',
            'list': server_host + 'school/list'
        },
        schoolTeacher: {
            'list': server_host + 'school/teacher/list',
            'search': server_host + 'school/teacher/search',
            'studentgrouplist': server_host + 'school/teacher/studentgroup/list'
        },
        schoolStudent: {
            'list': server_host + 'school/student/list',
            'search': server_host + 'school/student/search'
        },
        user: {
            'get': server_host + 'user/get'
        },
        classStudent: {
            list: server_host + 'school/class/student/list',
            'get': server_host + 'school/class/student/get'
        },
        role: {
            'check': server_host + 'auth/user/role/check'
        },
        wxInfo: {
            'get': server_host + 'yo/wx/userinfo/get'
        },
        schoolType: {
            list: server_host + 'business/school/transferstate/list'
        },
        wxJSSDK: {
            sdkencrypt: api_host + 'sdkencrypt',
            mediaauthget: api_host + 'mediaauthget'
        },
        mediaUpload: {
            'get': server_host + 'file/upload/media/get'
        },
        wxMessage: {
            'get': server_host + 'business/wx/message/get',
            'list': server_host + 'business/wx/message/list',
            'update': server_host + 'business/wx/message/update'
        },
        wxDetail: {
            'get': server_host + 'business/wx/message/detail/get',
            'list': server_host + 'business/wx/message/detail/list',
            update: server_host + 'business/wx/message/detail/update'
        },
        schoolTeacherGroup: {
            'get': server_host + 'school/teachergroup/get',
            'list': server_host + 'school/teachergroup/list',
            'teacherlist': server_host + 'school/teachergroup/teacher/list'
        },
        wxBindNotice: {
            'get': server_host + 'yo/support/wxbind/notice/get',
            'list': server_host + 'yo/support/wxbind/notice/list',
            getunbindstudent: server_host + 'yo/support/wxbind/notice/getunbindstudent',
            getunbindteacher: server_host + 'yo/support/wxbind/notice/getunbindteacher'
        },
        studentGroup: {
            'get': server_host + 'school/studentgroup/get',
            'list': server_host + 'school/studentgroup/list',
            'studentlist': server_host + 'school/studentgroup/student/list'
        },
        semester: {
            'get': server_host + 'school/semester/get',
            'list': server_host + 'school/semester/list',
            'valid': server_host + 'school/semester/valid/get'
        },
        receiverCount: {
            count: server_host + 'yo/support/sms/receiver/count'
        },
        wxReply: {
            create: server_host + 'business/wx/message/reply/create',
            list: server_host + 'business/wx/message/reply/list'
        },
        friend: {
            list: server_host + 'yo/uc/teacher/friendlist/list'
        },
        wx: {
            msgpush: api_host + 'msgpush'
        },
        sms: {
            send: server_host + 'sms/send'
        },
        platform: {
            'get': server_host + 'yo/wx/platform/get',
        }
    }
});
