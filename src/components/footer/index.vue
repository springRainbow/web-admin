<template>
    <footer class="footer">
        <!-- footer容器 -->
        <div class="footer__content">
            <!-- 顶部导航内容 -->
            <div class="footer__top">
                <!-- 导航 -->
                <div 
                    class="footer__top-column"
                    v-for="(navData,index) in navLists"
                    :key="index">
                    <!-- 标题 -->
                    <h2 class="footer__top-title">
                        <span class="footer__top-title-msg">{{navData.title}}</span>
                        <span class="footer__top-title-sub" v-if="navData.subTitle">{{navData.subTitle}}</span>
                    </h2>
                    <!-- 导航列表 -->
                    <ul 
                        class="footer__top-nav"
                        v-if="navData.list.length">
                        <li 
                            class="footer__top-nav-list"
                            v-for="(listData,listIndex) in navData.list"
                            :key="listIndex">
                            <a 
                                class="footer__top-nav-link"
                                :class="noEvent(listData)"
                                :href="dataHref(listData)" 
                                :target="dataTarget(listData)">

                                <div class="footer__top-nav-link">{{listData.title}}</div>
                                <!-- 二维码 -->
                                <div 
                                    class="footer__top-nav-qrcode"
                                    v-if="listData.qrCode">
                                    <div 
                                        class="footer__top-nav-qrcode-img"
                                        :class="listData.qrCode">
                                    </div>
                                    <p class="footer__top-nav-qrcode-msg">{{listData.qrMsg}}</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 底部信息内容 -->
            <div class="footer__bottom">
                <!-- 左侧网站信息 -->
                <div class="footer__bottom-copyright">
                    <!-- 科目导航 -->
                    <ul 
                        class="footer__bottom-sites-nav"
                        v-if="subjectLists.length">
                        <li 
                            class="footer__bottom-sites-nav-list"
                            v-for="(listData,index) in subjectLists"
                            :key="index">
                            <a 
                                class="footer__bottom-sites-nav-link"
                                :class="noEvent(listData)"
                                :href="dataHref(listData)" 
                                :target="dataTarget(listData)">

                                <span class="footer__bottom-sites-nav-title">{{listData.title}}</span>
                                <span 
                                    class="footer__bottom-subtitle" 
                                    v-if="listData.subTitle">
                                    {{listData.subTitle}}
                                </span>
                            </a>
                        </li>
                    </ul>
                    <!-- 网站版权信息 -->
                    <ul 
                        class="footer__bottom-copyright-cont"
                        v-if="copyright.length">
                        <li 
                            class="footer__bottom-copyright-list"
                            v-for="(data,index) in copyright"
                            :key="index">
                            {{data.msg}}
                        </li>
                    </ul>
                    <!-- 安全信息 -->
                    <div 
                        class="footer__bottom-security"
                        v-if="security.length">
                        <a 
                            class="footer__bottom-security-item"
                            v-for="(securityData,index) in security"
                            :key='index'
                            :class="securityData.label ? securityData.label : ''"
                            :href="dataHref(securityData)"
                            :target="dataTarget(securityData)">
                        </a>
                    </div>
                    <!-- 帮助导航 -->
                    <ul 
                        class="footer__bottom-map"
                        v-if="navHepls.length">
                        <li 
                            class="footer__bottom-map-item"
                            v-for="(helpsData,index) in navHepls"
                            :key="index">
                            <a 
                                class="footer__bottom-map-link"
                                :href="dataHref(helpsData)"
                                :target="dataTarget(helpsData)">
                                {{helpsData.title}}
                            </a>
                        </li>
                    </ul>
                </div>
                <!-- 右侧logo信息 -->
                <div class="footer__bottom-slogan">
                    <div class="footer__bottom-logo"></div>
                    <p v-if="slogan.show">{{slogan.msg}}</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import footerDatas from './footer.conf.js'; // footer数据

/* 
 * footerData数据
 *——————————————————————
 * navLists: 导航数据
 * subjectLists: 科目导航数据数据
 * copyright: 网站描述信息(版权信息)
 * security: 安全信息
 * navHepls: 帮助导航
 * slogan: 标语
*/

export default {
    name:'TFooter',
    data() {
        return {
            ...footerDatas
        }
    },
    methods: {
        // 设置动态链接
        dataHref(param) {
            return param.href ? param.href : 'javascript:;'
        },
        // 设置动态跳转方式
        dataTarget(param) {
            return param.target ? param.target : '_blank'
        },
        // 设置动态设置是否可点击
        noEvent(param) {
            return param.noEvent ? 'no-event' : ''
        }
    }
}
</script>

<style scoped lang="scss">
.footer {
    /* margin-top: 40px; */
    width: 100%;
    background: #2d2e32;
    color: #fff;
    line-height: 24px;
    font-size: 14px;

    a {
        color: #999;

        &:hover {
            color: #fff;
            text-decoration: underline;
        }

        &.no-event {
            pointer-events: none;
        }
    }

    // footer容器
    .footer__content{
        max-width: 1180px;
        margin: 0 auto;
        padding: 40px 0;
    }

    // 顶部导航内容
    .footer__top{
        width: 100%;
        padding-bottom: 40px;
        border-bottom: 1px solid #38393E;

        &:after{
            content: "";
            display: block;
            width: 0;
            height: 0;
            clear: both;
            *zoom: 1;
        }
        
        .footer__top-column{
            float: left;
            width: 22%;

            &:last-child{
                width: 136px;
            }
        }

        // 标题
        .footer__top-title{
            font-size: 16px;
            line-height: 28px;
            margin-bottom: 20px;
            overflow: hidden;
            text-align: left;
        }

        // 导航列表
        .footer__top-nav {
            &:after {
                content: "";
                display: block;
                width: 0;
                height: 0;
                clear: both;
            }

            .footer__top-nav-list{
                margin-bottom: 12px;
                position: relative;
                float: left;
                clear: both;

                &:last-child{
                    margin-bottom: 0;
                }
            }
            // 链接信息
            .footer__top-nav-link{
                display: block;

                &:hover .footer__top-nav-qrcode{
                    display: block;
                }
            }

            // 二维码容器
            .footer__top-nav-qrcode {
                display: none;
                position: absolute;
                background: #fff;
                border-radius: 4px;
                padding: 12px;
                box-sizing: border-box;
                left: -150px;
                bottom: -64px;
                z-index: 1;
                transition: .3s all;

                &:after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 6px 0 6px 8px;
                    border-color: transparent transparent transparent #ffffff;
                    top: 50%;
                    margin-top: -5px;
                    right: -8px;
                }

                .footer__top-nav-qrcode-img{
                    width: 100px;
                    height: 100px;
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-size: 100px 100px;

                    // 托福app
                    &.toefl {
                        background-image: url('~@/assets/footer/toefl-qrcode.png');
                    }

                    // 词汇app
                    &.words{
                        background-image: url('~@/assets/footer/words-qrcode.png');
                    }

                    // 微信公众号
                    &.wx {
                        background-image: url('~@/assets/footer/wx-qrcode.png');
                    }
                    //gre考满分
                    &.gre {
                        background-image: url(~@/assets/footer/grekmf.png);
                    }
                    //gre3000词
                    &.greword {
                        background-image: url(~@/assets/footer/gre.png);
                    }
                    //雅思考满分
                    &.ielts {
                        background-image: url(~@/assets/footer/ielts.png);
                    }
                    //gmat考满分
                    &.gmat {
                    background-image: url(~@/assets/footer/gmat.png);
                    }
                    //考满分课程
                    &.course {
                        background-image: url(~@/assets/footer/class.png);
                    }
                }

                .footer__top-nav-qrcode-msg{
                    color: #333;
                    text-align: center;
                }
            }
        }
    }


    // 底部信息内容
    .footer__bottom{
        width: 100%;
        overflow: hidden;
        
        // 左侧网站信息
        .footer__bottom-copyright {
            float: left;
            width: 720px;

            .footer__bottom-copyright-cont {
                width: 100%;
                color: #7A7A7D;
                font-size: 12px;
                margin-bottom: 12px;
            }

            .footer__bottom-copyright-list {
                margin-bottom: 4px;

                &:last-child {
                    margin: 0;
                }
            }
        }

        // 科目导航
        .footer__bottom-sites-nav {
            width: 100%;
            overflow: hidden;
            padding: 12px 0;
            margin-bottom: 12px;
            border-bottom: 1px solid #38393E;

            .footer__bottom-sites-nav-list {
                float: left;
                margin-right: 20px;

                &:first-child {
                    margin-right: 12px;
                }
            }

            .footer__bottom-sites-nav-link {
                color: #B6B6BA !important;
            }
        }

        // 安全信息容器
        .footer__bottom-security {
            margin-bottom: 20px;
            overflow: hidden;

            // 安全信息列表
            .footer__bottom-security-item {
                float: left;
                margin-right: 20px;
                width: 90px;
                height: 32px;
                background-size: 90px 32px;
                background-position: center center;
                background-repeat: no-repeat;
                opacity: .4;

                &:hover {
                    opacity: 1;
                }

                // 诚信网站
                &.credit {
                    background-image: url("~@/assets/footer/credit-icon.png");
                }

                // 可信网站
                &.credible {
                    background-image: url("~@/assets/footer/credible-icon.png");
                }

                // 网上交易保障中心
                &.secured {
                    width: 74px;
                    background-image: url("~@/assets/footer/secured-icon.png");
                    background-size: 74px 32px;
                }

                // 安全联盟
                &.niap {
                    background-image: url("~@/assets/footer/niap-icon.png");
                }
            }
        }

        // 帮助导航
        .footer__bottom-map {
            overflow: hidden;

            .footer__bottom-map-item {
                float: left;
                margin-right: 20px;
            }

        }

        // 右侧logo信息
        .footer__bottom-slogan {
            float: right;
            width: 302px;
            height: 106px;
            margin-top: 40px;
            background: url("~@/assets/footer/logo.png") center center no-repeat;
            background-size: 302px 106px;
        }
    }
}



</style>