import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Server,
  Activity,
  Clock,
  Code,
  Filter,
  Zap
} from 'lucide-react';
import { DiagnoserData, FDTData } from '@/entrypoints/devtoolsContentScript.content';

import type { GeneralInfo } from '../types';
import { DisabledOptionsSpecificPageCard } from '../components/DisabledOptionsSpecificPageCard';
import { getGeneralInfo } from '../utils';
import { PluginInfoCard } from '../components/PluginInfoCard';
import { ServerInfoCard } from '../components/ServerInfoCard';
import { ConstantCard } from '../components/ConstantsCard';
import { PreloadRUCSSTasksStatusCard } from '../components/PreloadRUCSSTasksStatusCard';
import { PreloadRUCSSParameters } from '../components/PreloadRUCSSParametersCard';
import { SomeFiltersAndOptionsCard } from '../components/SomeFiltersAndOptionsCard';

const diagnosticsData = {
  wpr_diagnoser_version: '3.0.0',
  wpr_plugin: 'active',
  constants: {
    WP_CACHE: { defined: true, value: true },
    DONOTCACHEPAGE: { defined: false },
    DONOTROCKETOPTIMIZE: { defined: false },
    DONOTMINIFY: { defined: false },
    DONOTMINIFYCSS: { defined: false },
    DONOTMINIFYJS: { defined: false },
    SCRIPT_DEBUG: { defined: true, value: false }
  },
  preload_rucss_parameters: {
    rocket_preload_cache_pending_jobs_cron_rows_count: 45,
    rocket_preload_pending_jobs_cron_interval: 60,
    rocket_preload_delay_between_requests: 500000,
    rocket_rucss_pending_jobs_cron_rows_count: 100,
    rocket_rucss_pending_jobs_cron_interval: 60
  },
  user_agent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  server_info: {
    server_load: 23.419995772563936,
    web_server: 'Apache',
    php_memory_limit: '2048M',
    wp_memory_limit: '256M',
    wp_max_memory_limit: '2048M'
  },
  imagify: '2.2.2',
  preload_rucss_tasks: {
    rucss_all: '73',
    preload_all: '37',
    rucss_completed: '73',
    preload_completed: '0',
    rucss_pending: '0',
    preload_pending: '37',
    'rucss_in-progress': '0',
    'preload_in-progress': '0',
    'rucss_to-submit': '0',
    rucss_failed: '0',
    preload_failed: '0'
  },
  querystrings: [],
  filters: {
    do_rocket_generate_caching_files: true,
    rocket_override_donotcachepage: false,
    rocket_cache_ignored_parameters: {
      utm_source: 0,
      utm_medium: 1,
      utm_campaign: 2,
      utm_expid: 3,
      utm_term: 4,
      utm_content: 5,
      utm_id: 6,
      utm_source_platform: 7,
      utm_creative_format: 8,
      utm_marketing_tactic: 9,
      mtm_source: 10,
      mtm_medium: 11,
      mtm_campaign: 12,
      mtm_keyword: 13,
      mtm_cid: 14,
      mtm_content: 15,
      pk_source: 16,
      pk_medium: 17,
      pk_campaign: 18,
      pk_keyword: 19,
      pk_cid: 20,
      pk_content: 21,
      fb_action_ids: 22,
      fb_action_types: 23,
      fb_source: 24,
      fbclid: 25,
      campaignid: 26,
      adgroupid: 27,
      adid: 28,
      gclid: 29,
      'age-verified': 30,
      ao_noptimize: 31,
      usqp: 32,
      'cn-reloaded': 33,
      _ga: 34,
      sscid: 35,
      gclsrc: 36,
      _gl: 37,
      mc_cid: 38,
      mc_eid: 39,
      _bta_tid: 40,
      _bta_c: 41,
      trk_contact: 42,
      trk_msg: 43,
      trk_module: 44,
      trk_sid: 45,
      gdfms: 46,
      gdftrk: 47,
      gdffi: 48,
      _ke: 49,
      _kx: 50,
      redirect_log_mongo_id: 51,
      redirect_mongo_id: 52,
      sb_referer_host: 53,
      mkwid: 54,
      pcrid: 55,
      ef_id: 56,
      s_kwcid: 57,
      msclkid: 58,
      dm_i: 59,
      epik: 60,
      pp: 61,
      gbraid: 62,
      wbraid: 63,
      ssp_iabi: 64,
      ssp_iaba: 65,
      gad: 66,
      vgo_ee: 67,
      gad_source: 68,
      onlywprocket: 69,
      srsltid: 70
    },
    rocket_cache_query_strings: [
      'minify_css',
      'minify_js',
      'minify_concatenate_js',
      'remove_unused_css',
      'async_css',
      'delay_js',
      'defer_all_js',
      'lazyload',
      'lazyload_iframes',
      'lazyload_css_bg_img',
      'cdn',
      'wpr_new_cache',
      'wpr_cache',
      'wpr_deactivate_all',
      'wpr_activate_all'
    ]
  },
  get_rocket_option: {
    version: '3.17.1',
    cache_reject_uri: [],
    cache_reject_ua: [],
    cache_reject_cookies: [],
    cache_mobile: 1,
    do_caching_mobile_files: 1,
    manual_preload: 1,
    preload_excluded_uri: [],
    cache_logged_user: 0,
    cache_query_strings: [],
    cache_purge_pages: [],
    purge_cron_interval: '10 hours',
    dns_prefetch: [],
    preload_fonts: []
  }
};

export default function GeneralInfoPage(props: { diagnoser: DiagnoserData['diagnoser'] }) {
  const generalDiagnoserInfo = getGeneralInfo(props.diagnoser);
  const getStatusIcon = (value: boolean | number) => {
    if (value === true || value === 1) {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    } else if (value === false || value === 0) {
      return <XCircle className="h-5 w-5 text-rose-400" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8">
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">WP Rocket Diagnostics</h1> */}

      {generalDiagnoserInfo.postMetaDisabledOptions.length > 0 && (
        <DisabledOptionsSpecificPageCard
          disabledOptions={generalDiagnoserInfo.postMetaDisabledOptions}
        />
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <PluginInfoCard pluginInfo={generalDiagnoserInfo.pluginInfo} />

        <ServerInfoCard serverInfo={generalDiagnoserInfo.serverInfo} />
        <ConstantCard constants={generalDiagnoserInfo.constants} />
        <PreloadRUCSSTasksStatusCard tasksStatus={generalDiagnoserInfo.preloadRUCSSTaskStatus} />
        <PreloadRUCSSParameters parameters={generalDiagnoserInfo.preloadRUCSSParameters} />
        {/* <SomeOptionsCard someOptions={generalDiagnoserInfo.someOptions}/> */}
        {generalDiagnoserInfo.someOptions && (
          <SomeFiltersAndOptionsCard someData={generalDiagnoserInfo.someOptions} type="options" />
        )}

        {generalDiagnoserInfo.someFilters && (
          <SomeFiltersAndOptionsCard someData={generalDiagnoserInfo.someFilters} type="filters" />
        )}
      </div>
    </div>
  );
}
