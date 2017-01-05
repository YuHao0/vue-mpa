define(function (require) {
    var Vue = require('vue'),
        $api = require('config'),
        ajax = require('ajax'),
        IGrow = {},
        utilities = require('utilities');
    var app = new Vue({
        el: '#receiver',
        data: {
            mailType: 'classMail',
            searchName: '',
            mailSearch: {
                data:[],
                teachers: {},
                students: {},
                status: 0,
                tip: '请查询',
                checkAll: false,
                choose: function (item) {
                    item.searchCheck = !item.searchCheck;
                    $this.mailSearch.checkStatus();
                    var ctx = this;
                    switch ($this.mailType) {
                        case 'classMail':
                            $this.receiver.click('students', item);
                            break;
                        case 'teaMail':
                            ctx.teachers[item.id]
                                ?
                                Vue.delete(ctx.teachers, item.id)
                                :
                                Vue.set(ctx.teachers, item.id, item);
                            break;
                        case 'stuMail':
                            ctx.students[item.id]
                                ?
                                Vue.delete(ctx.students, item.id)
                                :
                                Vue.set(ctx.students, item.id, item);
                            break;
                    }
                },
                ini: function () {
                    $this.searchName = '';
                    Vue.delete($this.mailSearch,'data') ;
                    this.tip = '请点击查询按钮查询';
                    this.status = 0;
                },
                checkStatus: function () {
                    $this.mailSearch.checkAll = true;
                    $this.searchClassResult.forEach(function (item) {
                        !item.searchCheck && ($this.mailSearch.checkAll = false);
                    });
                    $this.mailSearch.checkAll && $this.mailSearch.data.forEach(function (item) {
                        !item.searchCheck && ($this.mailSearch.checkAll = false);
                    });
                },
                selectAll: function () {
                    $this.mailSearch.checkAll = !$this.mailSearch.checkAll;
                    if ($this.mailSearch.checkAll) {
                        $this.searchClassResult.forEach(function (item) {
                            !item.searchCheck && $this.receiver.click('searchClasses', item);
                        });
                        $this.mailSearch.data.forEach(function (item) {
                            !item.searchCheck && $this.mailSearch.choose(item);
                        });
                    } else {
                        $this.searchClassResult.forEach(function (item) {
                            item.searchCheck && $this.receiver.click('searchClasses', item);
                        });
                        $this.mailSearch.data.forEach(function (item) {
                            item.searchCheck && $this.mailSearch.choose(item);
                        });
                    }
                }
            },
            stuGroupChecked: {
                all: false,
                studentGroup: false,
                club: false,
                elective: false,
                seventhress: false
            },
            receiver: {
                schoolsClass: {},  //班级通讯录中已选校区
                schoolsTeacher: {},//教师通讯录中已选校区
                classStudent: {},  //班级通讯录中已选学生
                classes: {},       //已选班级
                teachers: {},      //已选教师
                students: {},      //已选学生
                groups: {},        //教师组
                studentGroup: {},  //学生组
                club: {},          //社团
                elective: {},      //选修课
                seventhress: {},   //七选三
                friend: {},
                save: function () {
                    //根据勾选状态，保存接收人，用于发送消息（信息接收者）
                    //接收人类型：11-学生 12-教师 13-家长 14-好友 21-班级学生 22-班级教师 23-学生组 24-教师组 25-学校学生 26-学校教师 27-年级学生 28-年级教师
                    var ctx = this, json = {schoolIds: [],name:[]}, receiverData = {};
                    $this.schoolData.forEach(function (item) {
                        receiverData[item.id] = {
                            name: [],
                            receiverData: [],
                            teacherName: [],
                            studentName: [],
                            teacherIds: [],
                            classIds: [],
                            studentIds: [],
                            teacherGroupIds: []
                        }
                    });
                    ctx.teachers = utilities.copy($this.mailSearch.teachers);
                    ctx.students = utilities.copy($this.mailSearch.students);
                    //提取选中学生
                    $.each(ctx.classStudent,function (key,item) {
                        ctx.students[item.id] = item;
                    });
                    ['studentGroup', 'club', 'elective', 'seventhress'].forEach(function (key) {
                        !$this.stuGroupChecked[key] && $this[key + 'Data'].forEach(function (groupItem) {
                            !ctx[key][groupItem.id] && $.each(groupItem.checkedStudents, function (key, stuItem) {
                                ctx.students[stuItem.id] = stuItem;
                            });
                        });
                    });
                    //过滤学生
                    $.each(utilities.copy(ctx.students),function (key,stuItem) {
                        stuItem.classid && $.each(ctx.classes, function (key, classItem) {
                            stuItem.classid == classItem.id && delete ctx.students[stuItem.id];
                        });
                    });
                    //提取选中教师
                    $this.schoolData.forEach(function (school) {
                        $.each(school.checkedTeachers,function (key,teaItem) {
                            ctx.teachers[teaItem.id] = teaItem;
                        });
                        if (!school.checkAllTeacher) {
                            $.each(school.teaGroupData,function (key,teaGroup) {
                                $.each(teaGroup.checkedTeachers, function (key,teaItem) {
                                    ctx.teachers[teaItem.id] = teaItem;
                                });
                            });
                        }
                    });
                    //过滤教师
                    var ctxTemp = utilities.copy(ctx);
                    $this.schoolData.forEach(function (school) {
                        if (school.checkAllTeacher) {
                            var id = [];
                            $.each(school.teaGroupData, function (key, group) {
                                id.push(group.id);
                                delete ctxTemp.groups[group.id];
                            });
                            $.each(ctx.teachers,function (key,teaItem) {
                                delete ctxTemp.teachers[teaItem.id];
                            });
                            ctxTemp.groups[id[0]] = {name: '全部教师'};
                        } else {
                            $.each(ctx.teachers, function (key, teaItem) {
                                teaItem.groupid && teaItem.schoolid == school.id && $.each(ctx.groups, function (key,teaGroup) {
                                    teaItem.groupid == teaGroup.id && delete ctxTemp.teachers[teaItem.id];
                                });
                            });
                        }
                    });
                    //获取对应角色ids
                    var stuGroupIds = [], friendIds = [];
                    $.each(ctx.teachers, function (key, teaItem) {
                        receiverData[teaItem.schoolid].teacherIds.push(teaItem.id);
                    });
                    $.each(ctx.students, function (key, stuItem) {
                        receiverData[stuItem.schoolid].studentIds.push(stuItem.id);
                    });
                    $.each(ctx.groups, function (key, teacherGroupItem) {
                        receiverData[teacherGroupItem.schoolid].teacherGroupIds.push(teacherGroupItem.id);
                    });
                    $.each(ctx.classes,function (key,classItem) {
                        receiverData[classItem.schoolid].classIds.push(classItem.id);
                    });
                    ['studentGroup', 'club', 'elective', 'seventhress'].forEach(function (key) {
                        $.each(ctx[key], function (key,groupItem) {
                            stuGroupIds.push(groupItem.id);
                        });
                    });
                    $.each(ctx.friend, function (key, teaItem) {
                        friendIds.push(teaItem.id);
                    });
                    $.each(receiverData, function (key, item) {
                        item.studentIds.length && item.receiverData.push({type: 11, id: item.studentIds.toString()});
                        item.teacherIds.length && item.receiverData.push({type: 12, id: item.teacherIds.toString()});
                        item.classIds.length && item.receiverData.push({type: 21, id: item.classIds.toString()});
                        item.teacherGroupIds.length && item.receiverData.push({type: 24, id: item.teacherGroupIds.toString()});
                        if (key == IGrow.school.id) {
                            stuGroupIds.length && item.receiverData.push({type: 23, id: stuGroupIds.toString()});
                            friendIds.length && item.receiverData.push({type: 14, id: friendIds.toString()});
                        }
                    });
                    json.school = receiverData;
                    //获取统计接收人schoolid参数
                    ['classes', 'students', 'teahcers', 'studentGroup', 'club', 'elective', 'seventhress', 'friend'].forEach(function (key) {
                        $.each(ctx[key], function (key, item) {
                            item.schoolid && !~json.schoolIds.indexOf(item.schoolid) && json.schoolIds.push(item.schoolid);
                        });
                    });
                    //统计
                    ['classes', 'club', 'studentGroup', 'elective', 'seventhress', 'groups', 'students', 'teachers','friend'].forEach(function (key) {
                        $.each(ctxTemp[key], function (index, item) {
                            if(item.name){
                                json.name.push(item.name);
                                json.school[item.schoolid].name.push(item.name);
                                (key == 'groups' || key == 'teachers') ? json.school[item.schoolid].teacherName.push(item.name) : json.school[item.schoolid].studentName.push(item.name);
                            }
                        });
                    });
                    sessionStorage.SMS_Receiver = JSON.stringify(json);
                    window.history.back();

                    /*$this.getReceiverCount(json).then(function () {

                    });*/
                },
                //点击事件，用于勾选 教师/教师组/班级/学生
                click: function (key, item) {
                    var ctx = this,
                    //班级级联父级校区选中状态
                        classToSchool = function (item) {
                            $this.schoolData.forEach(function (school) {
                                if (item.schoolid == school.id) {
                                    Vue.set(ctx['schoolsClass'], school.id , school);
                                    school.classData.forEach(function (classItem) {
                                        if (!ctx['classes'][classItem.id]) {
                                            Vue.delete(ctx['schoolsClass'],school.id);
                                        }
                                    });
                                }
                            });
                        },
                    //教师组级联父级校区选中状态
                        teaGroupToSchool = function (item) {
                            $this.schoolData.forEach(function (school) {
                                if (item.schoolid == school.id) {
                                    Vue.set(ctx['schoolsTeacher'],school.id,school);
                                    $.each(school.teaGroupData, function (key,teaGroupItem) {
                                        if (!ctx['groups'][teaGroupItem.id]) {
                                            Vue.delete(ctx['schoolsTeacher'],school.id);
                                        }
                                    });
                                    !school.checkAllTeacher && delete Vue.delete(ctx['schoolsTeacher'],school.id);
                                }
                            });
                        };
                    /*班级通讯录*/
                    if (key == 'schoolsClass') {
                        ctx[key][item.id] ? Vue.delete(ctx[key],item.id) : Vue.set(ctx[key], item.id , item);
                        load.class(item).then(function (result) {
                            Vue.set(item, 'classData', result);
                            if (ctx[key][item.id]) {
                                item.classData.forEach(function (classItem) {
                                    Vue.set(ctx.classes,classItem.id,classItem);
                                    (classItem.studentData || []).forEach(function (studentItem) {
                                        Vue.set(ctx.classStudent,studentItem.id,studentItem);
                                    });
                                });
                            } else {
                                item.classData.forEach(function (classItem) {
                                    Vue.delete(ctx.classes,classItem.id);
                                    (classItem.studentData || []).forEach(function (studentItem) {
                                        Vue.delete(ctx.classStudent,studentItem.id)
                                    });
                                });
                            }
                        });
                    }
                    if (key == 'classes') {
                        ctx[key][item.id] ? Vue.delete(ctx[key],item.id) : Vue.set(ctx[key], item.id , item);
                        if (item.studentData) {
                            if (ctx[key][item.id]) {
                                item.studentData.forEach(function (studentItem) {
                                    Vue.set(ctx.classStudent,studentItem.id,studentItem);
                                });
                            } else {
                                item.studentData.forEach(function (studentItem) {
                                    Vue.delete(ctx.classStudent,studentItem.id)
                                });
                            }
                        }
                        classToSchool(item);
                    }
                    if (key == 'searchClasses') {
                        item.searchCheck = !item.searchCheck;
                        $this.mailSearch.checkStatus();
                        $this.schoolData.forEach(function (school) {
                            if (item.schoolid == school.id) {
                                $this.load.class(school).then(function (classData) {
                                    Vue.set(school, 'classData', classData);
                                    school.classData.forEach(function (classItem) {
                                        classItem.id == item.id && $this.receiver.click('classes', classItem);
                                    });
                                });
                            }
                        });
                    }
                    if (key == 'students') {
                        ctx['classStudent'][item.id] ? Vue.delete(ctx['classStudent'],item.id) : Vue.set(ctx['classStudent'], item.id , item);
                        $this.schoolData.forEach(function (school) {
                            if (item.schoolid == school.id) {
                                school.classData.forEach(function (classItem) {
                                    if (item.classid == classItem.id && classItem.studentData) {
                                        Vue.set(ctx['classes'],classItem.id,classItem);
                                        classItem.studentData.forEach(function (studentItem) {
                                            if (!ctx['classStudent'][studentItem.id]) {
                                                Vue.delete(ctx['classes'],classItem.id);
                                            }
                                        });
                                        classToSchool(classItem);
                                    }
                                });
                            }
                        });
                    }
                    /*教师通讯录*/
                    if (key == 'schoolsTeacher') {
                        ctx[key][item.id] ? Vue.delete(ctx[key],item.id) : Vue.set(ctx[key], item.id , item);
                        $this.load.teacher(item).then(function () {
                            if (ctx[key][item.id]) {
                                item.checkAllTeacher = true;
                                $.each(item.teaGroupData,function (key,teacherGroupItem) {
                                    Vue.set(ctx.groups,teacherGroupItem.id,teacherGroupItem);
                                    (teacherGroupItem.teacherData || []).forEach(function (teacherItem) {
                                        Vue.set(teacherGroupItem.checkedTeachers,teacherItem.id,teacherItem);
                                    });
                                });
                                item.teacherData.forEach(function (teacherItem) {
                                    Vue.set(item.checkedTeachers,teacherItem.id,teacherItem);
                                });
                            } else {
                                item.checkAllTeacher = false;
                                $.each(item.teaGroupData,function (key,teacherGroupItem) {
                                    Vue.delete(ctx.groups,teacherGroupItem.id);
                                    (teacherGroupItem.teacherData || []).forEach(function (teacherItem) {
                                        Vue.delete(teacherGroupItem.checkedTeachers,teacherItem.id);
                                    });
                                });
                                item.teacherData.forEach(function (teacherItem) {
                                    Vue.delete(item.checkedTeachers,teacherItem.id);
                                });
                            }
                        });
                    }
                    if (key == 'teachersAll') {
                        item.checkAllTeacher = !item.checkAllTeacher;
                        if (item.checkAllTeacher) {
                            item.teacherData.forEach(function (teacherItem) {
                                Vue.set(item.checkedTeachers,teacherItem.id,teacherItem);
                            });
                        } else {
                            item.teacherData.forEach(function (teacherItem) {
                                Vue.delete(item.checkedTeachers,teacherItem.id);
                            });
                        }
                        item.schoolid = item.id;
                        teaGroupToSchool(item);
                    }
                    if (key == 'groups') {
                        ctx[key][item.id] ? Vue.delete(ctx[key],item.id) : Vue.set(ctx[key], item.id , item);
                        if (item.teacherData) {
                            if (ctx[key][item.id]) {
                                (item.teacherData || []).forEach(function (teacherItem) {
                                    Vue.set(item.checkedTeachers,teacherItem.id,teacherItem);
                                });
                            } else {
                                (item.teacherData || []).forEach(function (teacherItem) {
                                    Vue.delete(item.checkedTeachers,teacherItem.id);
                                });
                            }
                        }
                        teaGroupToSchool(item);
                    }
                    if (key == 'teachers') {
                        $this.schoolData.forEach(function (school) {
                            if (school.id == item.schoolid) {
                                if (item.attachedSchool) {
                                    school.checkedTeachers[item.id] ? Vue.delete(school.checkedTeachers, item.id) : Vue.set(school.checkedTeachers, item.id, item);
                                    //教师级联全部教师组选中状态
                                    school.checkAllTeacher = true;
                                    school.teacherData.forEach(function (teacherItem) {
                                        if (!school.checkedTeachers[teacherItem.id]) {
                                            school.checkAllTeacher = false;
                                        }
                                    });
                                } else {
                                    $.each(school.teaGroupData, function (key, teaGroupItem) {
                                        if (teaGroupItem.id == item.groupid) {
                                            teaGroupItem.checkedTeachers[item.id] ? Vue.delete(teaGroupItem.checkedTeachers, item.id) : Vue.set(teaGroupItem.checkedTeachers, item.id, item);
                                            //教师级联对应教师组选中状态
                                            Vue.set(ctx['groups'], teaGroupItem.id, teaGroupItem);
                                            teaGroupItem.teacherData.forEach(function (teacherItem) {
                                                if (!teaGroupItem.checkedTeachers[teacherItem.id]) {
                                                    Vue.delete(ctx['groups'], teaGroupItem.id);
                                                }
                                            });
                                        }
                                    });
                                }
                                teaGroupToSchool(item);
                            }
                        });
                    }
                    /*学生组通讯录*/
                    if (key == 'studentGroupAll') {
                        $this.stuGroupChecked[item] = !$this.stuGroupChecked[item];
                        $this[item + 'Data'].forEach(function (groupItem) {
                            if ($this.stuGroupChecked[item]) {
                                Vue.set(ctx[item],groupItem.id,groupItem);
                                (groupItem.studentData || []).forEach(function (stuItem) {
                                    Vue.set(groupItem.checkedStudents,stuItem.id,stuItem)
                                });
                            } else {
                                Vue.delete(ctx[item],groupItem.id);
                                (groupItem.studentData || []).forEach(function (stuItem) {
                                    Vue.delete(groupItem.checkedStudents,stuItem.id);
                                });
                            }
                        });
                    }
                    //点击具体的学生组/社团/选修/七选三
                    if (key == 'studentGroup' || key == 'club' || key == 'elective' || key == 'seventhress') {
                        ctx[key][item.id] ? Vue.delete(ctx[key], item.id) : Vue.set(ctx[key], item.id, item);
                        if (ctx[key][item.id]) {
                            (item.studentData || []).forEach(function (stuItem) {
                                Vue.set(item.checkedStudents, stuItem.id, stuItem);
                            });
                        } else {
                            (item.studentData || []).forEach(function (stuItem) {
                                Vue.delete(item.checkedStudents, stuItem.id);
                            });
                        }
                        $this.stuGroupChecked[key] = true;
                        ($this[key + 'Data']).forEach(function (group) {
                            if (!ctx[key][group.id]) {
                                $this.stuGroupChecked[key] = false;
                            }
                        });
                    }
                    //学生组/社团/选修/七选三下的学生
                    if (key == 'studentGroupStudents' || key == 'clubStudents' || key == 'electiveStudents' || key == 'seventhressStudents') {
                        var tempKey = key.split("Students")[0];
                        ($this[tempKey + 'Data']).forEach(function (group) {
                            if (group.id == item.groupid) {
                                group.checkedStudents[item.id] ? Vue.delete(group.checkedStudents, item.id) : Vue.set(group.checkedStudents, item.id, item);
                                Vue.set(ctx[tempKey], group.id, group);
                                (group.studentData).forEach(function (student) {
                                    if (!group.checkedStudents[student.id]) {
                                        Vue.delete(ctx[tempKey], group.id);
                                    }
                                });
                            }
                        });
                        //点击学生级联对应学生组类型选中状态
                        $this.stuGroupChecked[tempKey] = true;
                        $this[tempKey + 'Data'].forEach(function (group) {
                            if (!ctx[tempKey][group.id]) {
                                $this.stuGroupChecked[tempKey] = false;
                            }
                        });
                    }

                    if (key == 'friendAll') {
                        $this.friendData.all = !$this.friendData.all;
                        if ($this.friendData.all) {
                            $.each($this.friendData, function (index,item) {
                                Vue.set(ctx['friend'],item.id,item);
                            });
                        } else {
                            $.each($this.friendData, function (index,item) {
                                Vue.delete(ctx['friend'],item.id);
                            });
                        }
                    }
                    if (key == 'friend') {
                        ctx[key][item.id] ? Vue.delete(ctx[key], item.id) : Vue.set(ctx[key], item.id, item);
                        $this.friendData.all = true;
                        $.each($this.friendData, function (index,friItem) {
                            !ctx[key][friItem.id] && ($this.friendData.all = false);
                        });
                    }
                    return this;
                },
                search: function () {
                    if (!$this.searchName) {
                        utilities.tip('请输入姓名' + ($this.mailType == 'classMail' ? '班级、' : '' ) + '或手机号');
                        return;
                    }
                    if (!isNaN($this.searchName) && !/^1[3|4|5|8]\d{2}(\d{4}|\*{4})\d{3}$/.test($this.searchName)) {
                        utilities.tip('请输正确的手机号');
                        return;
                    }
                    var data = {
                        _fields: 'id,name,classid,schoolid,mobile',
                        _relatedfields: 'group.name,class.name',
                        _pagesize: 1000,
                        schoolid: ' ',
                        status: 0
                    }, schoolids = [];
                    $this.schoolData.forEach(function (item) {
                        schoolids.push(item.id);
                    });
                    isNaN($this.searchName)
                        ?
                        data.name = $this.searchName
                        :
                        data.mobile = $this.searchName;
                    data.schoolids = schoolids.toString();
                    $this.mailType == 'stuMail' && (data.groupids = (function () {
                        var ids = [];
                        $this.studentGroupData.forEach(function (item) {
                            ids.push(item.id);
                        });
                        $this.clubData.forEach(function (item) {
                            ids.push(item.id);
                        });
                        return ids.toString() || 0;
                    })());
                    if (!$this.isAdmin) {
                        $this.mailType == 'classMail' && (data.classids = $this.UserClassIds.toString());
                    }
                    $this.mailSearch.checkAll = false;
                    var searchPromise = [];
                    if ($this.mailType == 'classMail') {
                        var tempData = {
                            schoolid: ' ',
                            schoolids: schoolids.toString(),
                            name: $this.searchName,
                            _pagesize: 1000,
                            _fields: 'id,name,schoolid',
                            _orderby: 'displayorder asc,number asc,id asc'
                        };
                        searchPromise.push(new Promise(function (resolve) {
                            ajax($api.schoolClass.search,tempData, function (result) {
                                (result.data || []).forEach(function (item) {
                                    $this.schoolData.forEach(function (line) {
                                        line.id == item.schoolid && (item.schoolname = line.name);
                                    });
                                    item.searchCheck = !!$this.receiver.classes[item.id];
                                });
                                $this.searchClassResult = result.data || [];
                                resolve('ok');
                            })
                        }));
                    }
                    searchPromise.push(new Promise(function (resolve) {
                        ajax($api[$this.mailType == 'teaMail' ? 'schoolTeacher' : 'schoolStudent'].search, data, function (result) {
                            (result.data || []).forEach(function (item) {
                                item.searchCheck = $this.mailType == 'classMail' && !!$this.receiver.classStudent[item.id];
                            });
                            Vue.set($this.mailSearch,'data',result.data || []);
                            resolve('ok');
                        })
                    }));
                    Promise.all(searchPromise).then(function () {
                        $this.mailSearch.status = 1;
                        $this.mailSearch.tip = $this.mailSearch.data.length || ($this.mailType == 'classMail' && $this.searchClassResult.length) ? 'ok' : '没有您要找的' + ($this.mailType == 'teaMail' ? '教师' : '内容') + '，请核实';
                        $this.mailSearch.checkStatus();
                    });
                }
            },
            contacts: {
                classMail: function () {
                    $this.mailType = 'classMail';
                    $this.mailSearch.ini();
                    $this.toggleCtrl($this.schoolData[$this.schoolData.length - 1], 'class','classExtend',true);
                },
                studentGroup: function () {
                    $this.mailType = 'stuMail';
                    $this.mailSearch.ini();
                    !$this.loaded.studentGroup && $this.load.initStudentGroup();
                },
                teacher: function () {
                    $this.mailType = 'teaMail';
                    $this.mailSearch.ini();
                    $this.toggleCtrl($this.schoolData[$this.schoolData.length - 1], 'teacher','teacherExtend',true);
                },
                friend: function () {
                    $this.mailType = 'friMail';
                    $this.mailSearch.ini();
                    $this.load.friend().then(function (data) {
                        $this.friendData = data;
                        $this.loaded.friend = true;
                        Vue.set($this.friendData, 'extend', true);
                        Vue.set($this.friendData, 'all', false);
                    });
                }
            },
            UserClassIds: [],
            schoolData:[],
            studentGroupData:[],
            clubData:[],
            electiveData:[],
            seventhressData:[],
            searchClassResult:[],
            friendData:[],
            isAdmin: false,
            schoolgroupadmin: false,
            loaded:{
                init: false,
                studentGroup: false,
                friend:false
            },
            load: {
                teacher: function (school) {
                    return new Promise(function (resolve) {
                        school.teacherData ? resolve(school.teacherData) : ajax($api.schoolTeacher.list, {
                            schoolid: school.id,
                            _pagesize: 9999,
                            _fields: 'id,name,schoolid,displayorder,mobile',
                            _relatedfields: 'group.id,group.name,user.avatar',
                            status: 0,
                            _orderby: 'displayorder asc,number asc,id asc'
                        }, function (result) {
                            if (result.data.length) {
                                result.data.forEach(function (item) {
                                    item.attachedSchool = true;
                                });
                                ajax($api.schoolTeacherGroup.list, {
                                    schoolid: school.id,
                                    _fields: 'id,name,displayorder,schoolid',
                                    _orderby: 'displayorder asc,id desc',
                                    _pagesize: 100,
                                }, function (groupResult) {
                                    var tempGroupData = groupResult.data || [];
                                    school.teaGroupData = {};
                                    tempGroupData.forEach(function (group) {
                                        group.extend = false;
                                        group.checkedTeachers = {};
                                        Vue.set(school.teaGroupData, group.id, group);
                                    });
                                    resolve(result.data);
                                });
                                ajax($api.wxBindNotice.getunbindteacher, {
                                    schoolid: school.id,
                                    _pagesize: 9999,
                                }, function (ret) {
                                    var unbinIds = [];
                                    $this.unbindTeacher = ret.data || [];
                                    (ret.data || []).forEach(function (line) {
                                        unbinIds.push(line.id);
                                    });
                                    result.data.forEach(function (teacher) {
                                        teacher.unBind = !!~unbinIds.indexOf(teacher.id);
                                    });
                                });
                            }
                        })
                    });
                },
                'class': function (school) {
                    return new Promise(function (resolve) {
                        school.classData ? resolve(school.classData) : ajax($api.schoolClass.list, {
                            schoolid: school.id,
                            _pagesize: 1000,
                            _fields: 'id,name,schoolid',
                            _orderby: 'displayorder asc,number asc,id asc'
                        }, function (result) {
                            (result.data || []).forEach(function (loadItem) {
                                loadItem.extend = false;
                            });
                            resolve(result.data || []);
                        });
                    });
                },
                school: function () {
                    !$this.schoolgroupadmin && !$this.schoolData.length && ($this.schoolData.push(utilities.copy(IGrow.school)));
                    return new Promise(function (resolve) {
                        $this.schoolData.length ? resolve($this.schoolData) : ajax($api.school.list, {
                            groupid: IGrow.school.groupid,
                            _pagesize: 1000,
                            _fields: 'id,name,groupid,typeid'
                        }, function (result) {
                            $this.schoolData = result.data;
                            resolve(result.data);
                        });
                    });
                },
                student: function (item) {
                    return new Promise(function (resolve) {
                        item.studentData ? resolve(item.studentData) : ajax($api.classStudent.list, {
                            schoolid: item.schoolid,
                            classid: item.id,
                            _pagesize: 1000,
                            status: 0,
                            _fields: 'id,name,classid,schoolid,mobile',
                            _orderby: 'displayorder asc,number asc,id asc,name asc'
                        }, function (result) {
                            ajax($api.wxBindNotice.getunbindstudent, {
                                schoolid: item.schoolid,
                                classid: item.id
                            }, function (ret) {
                                var unbinIds = [];
                                (ret.data || []).forEach(function (line) {
                                    unbinIds.push(line.id);
                                });
                                result.data.forEach(function (student) {
                                    student.unBind = !!~unbinIds.indexOf(student.id);
                                });
                                resolve(result.data || []);
                            })
                        });
                    });
                },
                groupTeacher: function (item) {
                    var callBack = function (item) {
                        item.extend = !item.extend;
                        if ($this.receiver.groups[item.id]) {
                            item.teacherData.forEach(function (teacherItem) {
                                item.checkedTeachers[teacherItem.id] = teacherItem;
                            });
                        }
                    };
                    item.teacherData ? callBack(item) : ajax($api.schoolTeacherGroup.teacherlist, {
                        groupid: item.id,
                        _pagesize: 1000,
                        _fields: 'schoolid',
                        _relatedfields: 'teacher.id,teacher.name,teacher.user.*,teacher.status,teacher.mobile',
                        _orderby: 'teacher.displayorder asc,teacher.number asc,teacher.id asc'
                    }, function (result) {
                        var temp = [], unbinIds = [];
                        result.data.forEach(function (item) {
                            item.teacher.status == 0 && temp.push(item);
                        });
                        $this.unbindTeacher.forEach(function (line) {
                            unbinIds.push(line.id);
                        });
                        temp.forEach(function (data) {
                            data.id = data.teacher.id;
                            data.name = data.teacher.name;
                            data.groupid = item.id;
                            data.mobile = data.teacher.mobile;
                            data.unBind = !!~unbinIds.indexOf(data.id);
                        });
                        Vue.set(item, 'teacherData', temp);
                        callBack(item);
                    });
                },
                groupStudent: function (item, groupType) {
                    var callBack = function (item,groupType) {
                        item.extend = !item.extend;
                        $this[groupType + 'Data'].forEach(function (line) {
                            if ($this.receiver[groupType][line.id] && line.id == item.id) {
                                line.studentData.forEach(function (child) {
                                    Vue.set($this.receiver.students, child.id, child);
                                    Vue.set(line.checkedStudents, child.id, child);
                                });
                            }
                        });
                    };
                    item.studentData ? callBack(item,groupType) : ajax($api.studentGroup.studentlist, {
                        groupid: item.id,
                        _pagesize: 1000,
                        _fields: 'studentid,schoolid',
                        _relatedfields: 'student.id,student.name,student.user.*,student.status',
                    }, function (result) {
                        var temp = [];
                        result.data.forEach(function (item) {
                            item.student.status == 0 && temp.push(item);
                        });
                        temp.forEach(function (data) {
                            data.id = data.studentid;
                            data.name = data.student.name;
                            data.groupid = item.id;
                        });
                        Vue.set(item, 'checkedStudents', {});
                        Vue.set(item, 'studentData', temp);
                        callBack(item,groupType);
                    });
                },
                initStudentGroup: function () {
                    //管理员取全校学生组数据，非管理员取其所带学生组
                    if ($this.isAdmin) {
                        var promise = [];
                        promise.push($this.load.studentGroup());
                        IGrow.school.typeid != 4 && promise.push($this.load.clubGroup());
                        if ([4, 5, 6, 8].indexOf(IGrow.school.typeid) != -1) {
                            promise.push($this.load.elective());
                            promise.push($this.load.seventhress());
                        }
                        Promise.all(promise).then(function () {
                            $this.loaded.studentGroup = true;
                            ['studentGroupData', 'clubData', 'electiveData', 'seventhressData'].forEach(function (item) {
                                Vue.set($this[item], 'extend', false);
                            });
                        });
                    }
                    else {
                        ajax($api.schoolTeacher.studentgrouplist, {
                            teacherid: IGrow.user.school.people.teacherid,
                            semesterid: ' ',
                            _relatedfields: 'group.*,type.*',
                            _orderby: 'groupid desc'
                        }, function (result) {
                            var type = {
                                0: 'studentGroupData',
                                3: 'clubData',
                                4: 'seventhressData',
                                5: 'electiveData'
                            };
                            result.data.forEach(function (item) {
                                item.group && $this[type[item.group.typeid]].push({
                                    id: groupitem.groupid,
                                    name: groupitem.group.name,
                                    displayorder: groupitem.displayorder,
                                    schoolid: groupitem.schoolid,
                                    extend:false
                                })
                            });
                            $this.loaded.studentGroup = true;
                            ['studentGroupData', 'clubData', 'electiveData', 'seventhressData'].forEach(function (item) {
                                Vue.set($this[item], 'extend', false);
                            });
                        });
                    }
                },
                studentGroup: function () {
                    return new Promise(function (resolve) {
                        ajax($api.studentGroup.list,{
                            _pagesize: 1000,
                            semesterid: ' ',
                            typeid: 0,
                            _fields: 'id,name,displayorder,schoolid',
                            _orderby: 'displayorder asc,id desc'
                        }, function (result) {
                            result.data.forEach(function (item) {
                                item.extend = false;
                            });
                            $this.studentGroupData = result.data || [];
                            resolve(result.data || []);
                        });
                    });
                },
                clubGroup: function () {
                    return new Promise(function (resolve) {
                        ajax($api.studentGroup.list, {
                            _pagesize: 1000,
                            semesterid: ' ',
                            year: IGrow.semester.year,
                            typeid: 3,
                            _fields: 'id,name,displayorder,schoolid',
                            _orderby: 'id desc'
                        }, function (result) {
                            result.data.forEach(function (item) {
                                item.extend = false;
                            });
                            $this.clubData = result.data || [];
                            resolve(result.data || []);
                        });
                    });
                },
                elective: function () {
                    return new Promise(function (resolve) {
                        ajax($api.studentGroup.list,{
                            _pagesize: 1000,
                            semesterid: ' ',
                            year: IGrow.semester.year,
                            typeid: 5,
                            _fields: 'id,name,displayorder,schoolid',
                            _orderby: 'id desc'
                        }, function (result) {
                            result.data.forEach(function (item) {
                                item.extend = false;
                            });
                            $this.electiveData = result.data || [];
                            resolve(result.data || []);
                        });
                    });
                },
                seventhress: function () {
                    return new Promise(function (resolve) {
                        $api.studentGroup.list({
                            _pagesize: 1000,
                            semesterid: ' ',
                            year: IGrow.semester.year,
                            typeid: 4,
                            _fields: 'id,name,displayorder,schoolid',
                            _orderby: 'id desc'
                        }, function (result) {
                            result.data.forEach(function (item) {
                                item.extend = false;
                            });
                            $this.seventhressData = result.data || [];
                            resolve(result.data || []);
                        });
                    });
                },
                friend: function () {
                    return new Promise(function (resolve) {
                        $this.friendData.length ? resolve($this.friendData) : ajax($api.friend.list, {
                            _page: 1,
                            _pagesize: 500,
                            teacherid: IGrow.user.school.people.teacherid
                        }, function (result) {
                            resolve(result.data || [])
                        });
                    });
                }
            },
            serviceType: JSON.parse(sessionStorage.serviceType).servicetype
        },
        methods: {
            init: function () {
                delete sessionStorage.SMS_Receiver;
                $this.isAdmin = false;
                //集团管理员
                $this.schoolgroupadmin = IGrow.user.role['schoolgroup.admin'];
                ['school.sysadmin', 'school.admin', 'school.master', 'school.vice_master', 'school.moral.master', 'schoolgroup.admin'].forEach(function (code) {
                    IGrow.user.role[code] && !$this.isAdmin && ($this.isAdmin = true);
                });
                $this.loaded.init = true;
                $this.load.school().then(function () {
                    $this.schoolData.forEach(function (item) {
                        Vue.set(item, 'classExtend', false);
                        Vue.set(item, 'teacherExtend', false);
                        Vue.set(item, 'checkAllTeacher', false);
                        Vue.set(item, 'allTeacherExtend', false);
                        Vue.set(item,'checkedTeachers',{});
                        Vue.set(item,'teaGroupData',{});
                    });
                    $this.contacts.classMail();
                });
                !$this.isAdmin && $this.load.class(IGrow.school).then(function (result) {
                    result.forEach(function (item) {
                        $this.UserClassIds.push(item.id);
                    });
                });
            },
            getReceiverCount: function (json) {
                var config = [], data, tempConfig = {
                    studentid: [],
                    teacherid: [],
                    classid: [],
                    studentgroupid: [],
                    teachergroupid: []
                };
                $.each(json.school, function (key, temp) {
                    temp.receiverData.length && temp.receiverData.forEach(function (item) {
                        switch (item.type) {
                            case 11:
                                tempConfig.studentid = tempConfig.studentid.concat(item.id.split(','));
                                break;
                            case 12:
                                tempConfig.teacherid = tempConfig.teacherid.concat(item.id.split(','));
                                break;
                            case 21:
                                tempConfig.classid = tempConfig.classid.concat(item.id.split(','));
                                break;
                            case 23:
                                tempConfig.studentgroupid = tempConfig.studentgroupid.concat(item.id.split(','));
                                break;
                            case 24:
                                tempConfig.teachergroupid = tempConfig.teachergroupid.concat(item.id.split(','));
                                break;
                        }
                    });
                });
                $.each(tempConfig, function (index, item) {
                    if(item.length){
                        var temp = {};
                        temp[index] = item.toString();
                        config.push(temp);
                    }
                });
                data = {
                    config: JSON.stringify(config),
                    schoolid: json.schoolIds.toString()
                };
                return new Promise(function (resolve) {
                    ajax($api.receiverCount.count, data, function (result) {
                        resolve(result.data || []);
                    });
                });
            },
            toggleCtrl: function (item,loadType,extend,extendValue) {
                extend = extend || 'extend';
                $this.load[loadType](item).then(function (data) {
                    Vue.set(item, loadType + 'Data', data);
                    item[extend] = extendValue == undefined ? !item[extend] : extendValue;
                    if ($this.mailType == 'classMail' && loadType == 'student') {
                        var temp = !!item.studentData.length;
                        item.studentData.forEach(function (stuItem) {
                            if ($this.receiver.students[stuItem.id]) {
                                Vue.set($this.receiver.classStudent,stuItem.id,stuItem);
                            } else {
                                temp = false;
                            }
                        });
                        temp && Vue.set($this.receiver.classes,item.id,item);
                        if (!temp && $this.receiver.classes[item.id]) {
                            item.studentData.forEach(function (stuItem) {
                                Vue.set($this.receiver.students,stuItem.id,stuItem);
                                Vue.set($this.receiver.classStudent,stuItem.id,stuItem);
                            });
                        }
                    }
                });
            },
            stuGroupToggleCtrl: function (type) {
                Vue.set($this[type], 'extend', !$this[type].extend);
            }
        }
    });

    var $this = app;

    utilities.basicData().then(function () {
        IGrow = window.IGrow;
        ajax($api.semester.valid,{
           schoolid:IGrow.school.id
        }, function (result) {
            IGrow.semester = result.data;
        });
        $this.init();
    }).catch(function () {
        $this.init();
    });

});