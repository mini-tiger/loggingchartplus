// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置
import config from '../config'

const headerMenuConfig = [
  {
    name: '数据源管理',
    path: '/' +config.urlSuffix+'/DataCollection/DataSource',
    icon: 'copy',
  },
  {
    name: '通道管理',
    path: '/' +config.urlSuffix+'/DataCollection/Channel',
    icon: 'activity',
  },
  {
    name: '任务调度',
    path: '/' +config.urlSuffix+'/DataCollection/TaskPlan',
    icon: 'activity',
  },
  {
    name: '解析监控',
    path: '/' +config.urlSuffix+'/DataCollection/AnalyticalMonitor',
    icon: 'activity',
  },
  {
    name: '帮助',
    path: '',
    external: true,
    newWindow: true,
    icon: 'bangzhu',
  },
];
const asideMenuConfig = [
  {
    name: '首页',
    path: '/' +config.urlSuffix+'/dashboard2',
    icon: 'home2',
  },
  {
    name: '测井智能解释',
    path: '/' +config.urlSuffix+'/DataCollection/services',
    icon: 'message',
    children:[
      {
        name: '任务状态',
        path: '/' +config.urlSuffix+'/DataCollection/services',
        icon: 'home',
      },
      {
        name: '创建任务',
        path: '/' +config.urlSuffix+'/DataCollection/Steptask?id=',
        icon: 'home',
      },
      {
        name: '创建任务2',
        path: '/' +config.urlSuffix+'/DataCollection/Steptask2?id=',
        icon: 'home',
      }
    ]
  },
  {
    name: '模型管理',
    path: '/' +config.urlSuffix+'/Model/table_general/model_config',
    icon: 'home',
    children: [
      {
        name: '模型配置',
        path: '/' +config.urlSuffix+'/Model/table_general/model_config',
        icon: 'home',
      },
      {
        name: '测井图模板配置',
        path: '/' +config.urlSuffix+'/Model/templateTable',
        icon: 'home',
      },
    ],
  },
  {
    name: '图版管理',
    path: '/' +config.urlSuffix+'/Model/templateTable',
    icon: 'home',
  },

  {
    name: '井数据列表',
    path: '/' +config.urlSuffix+'/WellData',
    icon: 'home',
  },
  {
    name: '系统管理',
    path: '/' +config.urlSuffix+'/System/table_general/oil_field_config',
    icon: 'message',
    children: [
      {
        name: '数据源同步',
        path: '/' +config.urlSuffix+'/SyncData',
        icon: 'home',
      },
      {
        name: '任务配置',
        path: '/' +config.urlSuffix+'/System/table_general/task',
        icon: 'home',
      },
      {
        name: '数据库配置',
        path: '/' +config.urlSuffix+'/System/table_general/oil_field_config',
        icon: 'home',
      },
      {
        name: '用户管理',
        path: '/' +config.urlSuffix+'/System/table_general/crud_user',
        icon: 'home',
      },
      // {
      //   name: '支持',
      //   path: '/' +config.urlSuffix+'/student/ActionOnLine3',
      //   icon: 'home',
      // },
      {
        name: '帮助',
        path: '/' +config.urlSuffix+'/student/ActionOnLine4',
        icon: 'home',
      },

    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
