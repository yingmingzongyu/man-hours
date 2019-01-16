<!--
 * @Author: yincheng
 * @Date: 2019-01-10 11:35:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-01-15 11:41:18
 -->
<template>
  <Layout style="height: 100%" class="main">
    <Sider
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      :style="{overflow: 'hidden'}"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo">
          <img v-show="collapsed" :src="minLogo" key="min-logo">
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avator="userAvator"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import ABackTop from "./components/a-back-top";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import ErrorStore from "./components/error-store";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { getNewTagList, routeEqual, formatMenuList } from "@/libs/util";
import { getSlideMenu } from "@/api/routers.js";
import routers from "@/router/routers";
import minLogo from "@/assets/images/logo-min.jpg";
import maxLogo from "@/assets/images/logo.jpg";
import router from "@/router/routers.js";
import "./main.less";
export default {
  name: "Main",
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      menuList: []
    };
  },
  computed: {
    ...mapGetters(["errorCount"]),
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return this.$store.state.user.imagePath;
    },
    cacheList() {
      const list = [
        "ParentView",
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ];
      return list;
    },
    local() {
      return this.$store.state.app.local;
    },
    hasReadErrorPage() {
      return this.$store.state.app.hasReadErrorPage;
    },
    unreadCount() {
      return this.$store.state.user.unreadCount;
    }
  },
  methods: {
    ...mapMutations([
      "setBreadCrumb",
      "setTagNavList",
      "addTag",
      "setLocal",
      "setHomeRoute",
      "closeTag"
    ]),
    ...mapActions(["handleLogin"]),
    getMenu() {
      this.menuList = [
          {
            icon: "ios-construct",
            name: "system",
            meta: {
              title: "系统管理"
            },
            children:[
              {
                icon: "ios-construct",
                name: "department",
                meta: {
                  icon: "ios-construct",
                  title: "部门管理"
                },
              },
              {
                icon: "ios-construct",
                name: "role",
                meta: {
                  icon: "ios-construct",
                  title: "角色管理"
                },
              },
              {
                icon: "ios-construct",
                name: "user",
                meta: {
                  icon: "ios-construct",
                  title: "用户管理"
                },
              },
              {
                icon: "ios-construct",
                name: "menu",
                meta: {
                  icon: "ios-construct",
                  title: "菜单管理"
                },
              },
            ]
          },
          { 
            icon: "ios-construct",
            name: "project",
            meta: {
              title: "项目管理"
            },
            children: [
              {
                icon: "ios-construct",
                name: "software-development",
                meta: {
                  icon: "ios-construct",
                  title: "软件开发"
                },
                children: [
                  {
                    icon: "ios-construct",
                    name: "product-manage",
                    meta: {
                      icon: "ios-construct",
                      title: "软件产品管理"
                    }
                  },
                  {
                    icon: "ios-construct",
                    name: "project-manage",
                    meta: {
                      icon: "ios-construct",
                      title: "软件项目管理"
                    }
                  }
                ]
              },
              {
                icon: "ios-construct",
                name: "project-construction",
                meta: {
                  icon: "ios-construct",
                  title: "项目施工"
                },
                children: [
                  {
                    icon: "ios-construct",
                    name: "intelligentize",
                    meta: {
                      icon: "ios-construct",
                      title: "智能化项目管理"
                    }
                  },
                  {
                    icon: "ios-construct",
                    name: "integration",
                    meta: {
                      icon: "ios-construct",
                      title: "系统集成项目管理"
                    }
                  },
                  {
                    icon: "ios-construct",
                    name: "multimedia",
                    meta: {
                      icon: "ios-construct",
                      title: "多媒体项目管理"
                    }
                  },
                  {
                    icon: "ios-construct",
                    name: "ops",
                    meta: {
                      icon: "ios-construct",
                      title: "运维服务项目管理"
                    }
                  }
                ]
              },
              {
                icon: "ios-construct",
                name: "train-study",
                meta: {
                  icon: "ios-construct",
                  title: "学习培训"
                },
                children: [
                  {
                    icon: "ios-construct",
                    name: "internal",
                    meta: {
                      icon: "ios-construct",
                      title: "内部培训"
                    }
                  },
                  {
                    icon: "ios-construct",
                    name: "external",
                    meta: {
                      icon: "ios-construct",
                      title: "外部培训"
                    }
                  }
                ]
              },
              {
                icon: "ios-construct",
                name: "label-manage",
                meta: {
                  icon: "ios-construct",
                  title: "标签管理"
                }
              }
            ]
          }
        ];
      // getSlideMenu().then(res => {
      //   // 格式化返回数据
      //   // const data = res.data.data.top;

      //   // this.menuList = formatMenuList(data);
        
      // });
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type !== "others") {
        if (type === "all") {
          this.turnToPage(this.$config.homeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.setHomeRoute(routers);
    this.addTag({
      route: this.$store.state.app.homeRoute
    });
    this.setBreadCrumb(this.$route);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   });
    // }
    //获取菜单
    this.getMenu();
  }
};
</script>
