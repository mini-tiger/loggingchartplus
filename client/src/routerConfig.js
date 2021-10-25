import BlankLayout from '@/layouts/BlankLayout';
import BasicLayout from '@/layouts/BasicLayout';
import NotFound from '@/pages/NotFound';
import v5 from '@/pages/V5';
import GeneralTable from './pages/GeneralTable';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Dashboard from './pages/Dashboard';
import Document from './pages/Document';
import Services from './pages/Services';
import Member from './pages/Member';
import Setting from './pages/Setting';
import AddDocument from './pages/AddDocument';
import AddMember from './pages/AddMember';
import DataCollection from './pages/DataCollection';
import DataSource from './pages/DataSource';
import DataSourceEdit from './pages/DataSourceEdit';
import Channel from './pages/Channel';
import TaskPlan from './pages/TaskPlan';
import AnalyticalMonitor from './pages/AnalyticalMonitor';
import Activities from './pages/Activities';
import DataResource from './pages/DataResource';
import DataSecurity from './pages/DataSecurity';
import DataServiceHome from './pages/DataServiceHome';
import DataMain from './pages/DataMain';
import ActionOnLine from './pages/ActionOnLine';
import ActivityAudit from './pages/ActivityAudit';
import Home from './pages/Home';
import Steptask from './pages/Steptask';
import Steptask2 from './pages/Steptask2';
import DataSourceConf from './pages/DataSourceConf';
import TemplateTable from './pages/TemplateTable';
import Dashboard2 from './pages/Dashboard2';
import DataQuality from './pages/DataQuality';
import Model_configGeneralTable from './pages/model_config';
import WellData from './pages/WellData';
import SyncData from './pages/SyncData';
import config from '../config'


const routerConfig = [
  {
    path: '/' +config.urlSuffix+'/DataCollection/AnalyticalMonitor',
    component: AnalyticalMonitor,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/DataSourceEdit',
    component: DataSourceEdit,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/DataSource',
    component: DataSource,
  },
  {
    path: '/' +config.urlSuffix+'/dashboard',
    component: Dashboard,
  },
  {
    path: '/' +config.urlSuffix+'/document',
    component: Document,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/services',
    component: Services,
  },
  {
    path: '/' +config.urlSuffix+'/user/register',
    component: UserRegister,
  },
  {
    path: '/' +config.urlSuffix+'/activities',
    component: Activities,
  },
  {
    path: '/user/login',
    component: UserLogin,
  },
  {
    path: '/' +config.urlSuffix+'/member',
    component: Member,
  },
  {
    path: '/' +config.urlSuffix+'/add/document',
    component: AddDocument,
  },
  {
    path: '/' +config.urlSuffix+'/add/member',
    component: AddMember,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/home',
    component: DataCollection,
  },
  {
    path: '/' +config.urlSuffix+'/setting',
    component: Setting,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/Channel',
    component: Channel,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/v5',
    component: v5,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/TaskPlan',
    component: TaskPlan,
  },
  {
    path: '/' +config.urlSuffix+'/DataTools/DataQuality',
    component: DataQuality,
  },
  {
    path: '/' +config.urlSuffix+'/DataTools/DataResource',
    component: DataResource,
  },
  {
    path: '/' +config.urlSuffix+'/DataTools/DataSecurity',
    component: DataSecurity,
  },
  {
    path: '/' +config.urlSuffix+'/DataService/Home',
    component: DataServiceHome,
  },
  {
    path: '/' +config.urlSuffix+'/DataTools/DataMain',
    component: DataMain,
  },
  {
    path: '/' +config.urlSuffix+'/student/ActionOnLine',
    component: ActionOnLine,
  },
  {
    path: '/' +config.urlSuffix+'/student/ActivityAudit',
    component: ActivityAudit,
  },
  {
    path: '/' +config.urlSuffix+'/home',
    component: Home,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/Steptask',
    component: Steptask,
  },
  {
    path: '/' +config.urlSuffix+'/DataCollection/Steptask2',
    component: Steptask2,
  },
  {
    path: '/' +config.urlSuffix+'/System/DataSourceConf',
    component: DataSourceConf,
  },
  {
    path: '/' +config.urlSuffix+'/System/table_general',
    component: GeneralTable,
  },
  {
    path: '/' +config.urlSuffix+'/Model/table_general/model_config',
    component: Model_configGeneralTable,
  },
  {
    path: '/' +config.urlSuffix+'/Model/table_general',
    component: GeneralTable,
  },
  {
    path: '/' +config.urlSuffix+'/Model/templateTable',
    component: TemplateTable,
  },
  {
    path: '/' +config.urlSuffix+'/dashboard2',
    component: Dashboard2,
  },
  {
    path: '/' +config.urlSuffix+'/WellData',
    component: WellData,
  },
  {
    path: '/' +config.urlSuffix+'/SyncData',
    component: SyncData,
  },
];

export default routerConfig;
