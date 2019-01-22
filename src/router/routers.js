/*
 * @Author: yincheng
 * @Date: 2019-01-10 10:12:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-01-22 11:00:24
 */
import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      },
    ]
  },
  {
    path: '/project',
    name: 'project',
    component: Main,
    meta: {
      title: '项目管理'
    },
    children: [
      {
        path: 'software-development',
        name: 'software-development',
        meta: {
          title: '软件开发'
        },
        component: parentView,
        children: [
          {
            path: 'product-manage',
            name: 'product-manage',
            meta: {
              title: '软件产品管理'
            },
            component: () => import('@/view/project/software-development/product-manage.vue')
          },
          {
            path: 'project-manage',
            name: 'project-manage',
            meta: {
              title: '软件项目管理'
            },
            component: () => import('@/view/project/software-development/project-manage.vue')
          },
        ]
      },
      {
        path: 'project-construction',
        name: 'project-construction',
        component: parentView,
        meta: {
          title: '项目施工'
        },
        children: [
          {
            path: 'intelligentize',
            name: 'intelligentize',
            meta: {
              title: '智能化项目管理'
            },
            component: () => import('@/view/project/project-construction/intelligentize.vue')
          },
          {
            path: 'integration',
            name: 'integration',
            meta: {
              title: '系统集成项目管理'
            },
            component: () => import('@/view/project/project-construction/integration.vue')
          },
          {
            path: 'multimedia',
            name: 'multimedia',
            meta: {
              title: '多媒体项目管理'
            },
            component: () => import('@/view/project/project-construction/multimedia.vue')
          },
          {
            path: 'ops',
            name: 'ops',
            meta: {
              title: '运维服务项目管理'
            },
            component: () => import('@/view/project/project-construction/ops.vue')
          }
        ]
      },
      {
        path: 'train-study',
        name: 'train-study',
        component: parentView,
        meta: {
          title: '学习培训'
        },
        children: [
          {
            path: 'internal',
            name: 'internal',
            meta: {
              title: '内部培训'
            },
            component: () => import('@/view/project/train-study/internal.vue')
          },
          {
            path: 'external',
            name: 'external',
            meta: {
              title: '外部培训'
            },
            component: () => import('@/view/project/train-study/external.vue')
          }
        ]
      },
      {
        path: 'label-manage',
        name: 'label-manage',
        meta: {
          title: '标签管理'
        },
        component: () => import('@/view/project/label-manage/index.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '系统管理'
    },
    children:[
      {
        path: 'menu',
        name: 'menu',
        meta: {
          title: '菜单管理'
        },
        component: () => import('@/view/system/menu-manage/index.vue'),
      },
      {
        path: 'department',
        name: 'department',
        meta: {
          title: '部门管理'
        },
        component: () => import('@/view/system/department-manage/index.vue'),
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/view/system/role-manage/index.vue'),
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/view/system/user-manage/index.vue'),
      },
    ]
  },{
    path: '/statistic',
    name: 'statistic',
    component: Main,
    meta: {
      icon: 'logo-buffer',
      title: '统计分析'
    },
    children:[
      {
        path: "project-statistic",
        name: "project-statistic",
        meta: {
          title: '项目工时统计'
        },
        component: () => import('@/view/statistic/project-statistic')
      },
      {
        path: "man-statistic",
        name: "man-statistic",
        meta: {
          title: '人员工时统计'
        },
        component: () => import('@/view/statistic/man-statistic')
      },
      {
        path: 'detail',
        name: 'detail',
        meta: {
          title: '项目工时详情'
        },
        component: () => import('@/view/statistic/components/statistic-detail.vue'),
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/403',
    name: 'error_403',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/403.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
