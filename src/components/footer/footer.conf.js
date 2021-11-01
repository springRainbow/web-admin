const BASE_URL = process.env.VUE_APP_PRFIEX; // 公共路径(//test- || //beta- || //)

/**
 * footer组件数据
 * -------------
 * title: 显示内容
 * subTitle: 显示副内容
 * list: 子列表数据
 * href: 链接地址
 * target: 跳转方式
 * qrCode: 二维码标识
 * qrMsg: 二维码描述
 * noEvent: 不可点击
 * msg: 描述信息
 * label: 安全信息标记
*/
export default {
    // 导航数据
    navLists: [
        {
            title: '覆盖考试',
            list: [
                {
                    title: 'TOEFL®',
                    href: `${BASE_URL}toefl.kmf.com`
                },
                {
                    title: 'GRE®',
                    href: `${BASE_URL}gre.kmf.com`
                },
                {
                    title: 'IELTS',
                    href: `${BASE_URL}ielts.kmf.com`
                },
                {
                    title: 'GMAT',
                    href: `${BASE_URL}gmat.kmf.com`
                }
            ]
        },
        {
            title: '我们的课程',
            list: [
                {
                    title: 'TOEFL课程',
                    href: `${BASE_URL}course.kmf.com/?from=toefl`
                },
                {
                    title: 'IELTS课程',
                    href: `${BASE_URL}course.kmf.com/?from=ielts`
                },
                {
                    title: 'GRE课程',
                    href: `${BASE_URL}course.kmf.com/?from=gre`
                },
                {
                    title: 'GMAT课程',
                    href: `${BASE_URL}course.kmf.com/?from=gmat`
                },
            ]
        },
        {
            title: '我们的App',
            list: [
                {
                    title: '托福考满分',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=toefl`,
                    target: '_self',
                    qrCode: 'toefl',
                    qrMsg: '托福考满分'
                },
                {
                    title: 'GRE考满分',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=grekmf`,
                    target: '_self',
                    qrCode: 'gre',
                    qrMsg: 'GRE考满分'
                },
                {
                    title: 'GRE3000词',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=gre`,
                    target: '_self',
                    qrCode: 'greword',
                    qrMsg: 'GRE3000词'
                },
                {
                    title: '雅思考满分',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=gre`,
                    target: '_self',
                    qrCode: 'ielts',
                    qrMsg: '雅思考满分'
                },
                {
                    title: 'GMAT考满分',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=gre`,
                    target: '_self',
                    qrCode: 'gmat',
                    qrMsg: 'GMAT考满分'
                },
                {
                    title: '考满分词汇',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=toeflwords`,
                    target: '_self',
                    qrCode: 'words',
                    qrMsg: '考满分词汇'
                },
                {
                    title: '考满分课程',
                    href: `${BASE_URL}www.kmf.com/static/appcenter?website=gre`,
                    target: '_self',
                    qrCode: 'course',
                    qrMsg: '考满分课程'
                },
            ]
        },
        {
            title: '关注我们',
            list: [
                {
                    title: '微信',
                    qrCode: 'wx',
                    qrMsg: '留学备考'
                },
                {
                    title: '微博',
                    href: `http://weibo.com/u/5190253085`
                }
            ]
        },
        {
            title: '联系我们',
            list: [
                {
                    title: '反馈建议',
                    href: `${BASE_URL}feedback.kmf.com/help/feedback?channel=3001`
                },
                {
                    title: '投诉举报',
                    href: `${BASE_URL}www.kmf.com/ke/complaint`
                },
                {
                    title: '4000-500-390',
                    noEvent: true
                },
                {
                    title: 'kmf-fb@100tal.com',
                    href: 'mailto:kmf-fb@100tal.com'
                }
            ]
        }
    ],
    // 科目导航数据数据
    subjectLists: [
        {
            title: '考满分线上备考：',
            noEvent: true
        },
        {
            title: 'TOEFL®',
            href: `${BASE_URL}toefl.kmf.com`
        },
        {
            title: 'GRE®',
            href: `${BASE_URL}gre.kmf.com`
        },
        {
            title: 'IELTS',
            href: `${BASE_URL}ielts.kmf.com`
        },
        {
            title: 'GMAT',
            href: `${BASE_URL}gmat.kmf.com`
        },
        {
            title: '课程',
            href: `${BASE_URL}course.kmf.com`
        }
    ],
    // 网站描述信息(版权信息)
    copyright: [
        {
            msg: 'ETS, TOEFL iBT and GRE are registered trademarks of Educational Testing Service (ETS) throughout the world.'
        },
        // {
        //     msg: 'SpeechRater & E-rater are the trademarks of Educational Testing Service (ETS) and used by TAL under license.'
        // },
        {
            msg: '©2012-2016 kmf.com，盈禾优仕 京ICP备12012942号 京ICP证160944号'
        },
        {
            msg: 'Copyright©2017 考满分 kmf.com 北京盈禾优仕科技有限责任公司 版权所有'
        }
    ],
    // 安全信息
    security: [
        {
            label: 'credit', // 诚信网站
            href: 'https://credit.cecdc.com/CX20161012026812050156.html'
        },
        {
            label: 'credible', // 可信网站
            href: 'https://ss.knet.cn/verifyseal.dll?sn=e16101411010564884x4pt000000&ct=df&a=1&pa=0.5596133682399824'
        },
        {
            label: 'secured', // 网上交易保障中心
            href: 'http://www.315online.com.cn/member/315160008.html'
        },
        {
            label: 'niap', // 安全联盟
            href: 'https://v.pinpaibao.com.cn/cert/site/?site=www.kmf.com&at=business'
        }
    ],
    // 帮助导航
    navHepls: [
        {
            title: '漏洞提交',
            href: '//src.100tal.com/'
        },
        {
            title: '帮助中心',
            href: `${BASE_URL}help.kmf.com/`
        },
        {
            title: '关于我们',
            href: `${BASE_URL}www.kmf.com/service/aboutus/`
        },
        {
            title: '加入我们',
            href: `https://www.lagou.com/gongsi/1824.html`
        },
        {
            title: '版权声明',
            href: `${BASE_URL}www.kmf.com/service/copyright/`
        },
        {
            title: '反盗链声明',
            href: `${BASE_URL}www.kmf.com/service/link/`
        },
        {
            title: '免责声明',
            href: `${BASE_URL}www.kmf.com/service/disclaimer/`
        }
    ],
    // 标语
    slogan: {
        msg: '考满分是专注于出国考试在线科学备考的留学生品牌。已经服务了超过100万学生，累积学员备考记录超过10亿条，是出国留学考试领域新锐培训机构。',
        show: false
    }
}