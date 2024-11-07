import { DiagnoserData } from '../../content-scripts/devtoolsContentScript';
import type { GeneralInfo } from './types';

export function getGeneralInfo(diagnoser: DiagnoserData['diagnoser']): GeneralInfo {
  const { noRocketData, rocketData } = diagnoser;
  return {
    pluginInfo: getPluginInfo(noRocketData),
    serverInfo: getServerInfo(noRocketData),
    constants: noRocketData.constants,
    preloadRUCSSTaskStatus: noRocketData.preload_rucss_tasks,
    preloadRUCSSParameters: noRocketData.preload_rucss_parameters,
    someOptions: !noRocketData.get_rocket_option
      ? undefined
      : getOptions(noRocketData.get_rocket_option),
    someFilters: !noRocketData.filters ? undefined : getFilters(noRocketData.filters),
    postMetaDisabledOptions: !rocketData ? [] : rocketData.post_meta_excluded_options
  };
}
function getPluginInfo(
  noRocketData: DiagnoserData['diagnoser']['noRocketData']
): GeneralInfo['pluginInfo'] {
  return {
    wprStatus: noRocketData.wpr_plugin,
    wprInstalledVersion: noRocketData.get_rocket_option?.version,
    imagify: noRocketData.imagify,
    queryStringsInUrl: noRocketData.querystrings,
    userAgent: noRocketData.user_agent,
    diagnoserInstalledVersion: noRocketData.wpr_diagnoser_version
  };
}

function getServerInfo(
  noRocketData: DiagnoserData['diagnoser']['noRocketData']
): GeneralInfo['serverInfo'] {
  const serverInfo = noRocketData.server_info;
  return {
    serverLoad: serverInfo.server_load,
    webServer: serverInfo.web_server,
    phpMemoryLimit: serverInfo.php_memory_limit,
    wpMemoryLimit: serverInfo.wp_memory_limit,
    wpMaxMemoryLimit: serverInfo.wp_max_memory_limit
  };
}

export function getFilters(filters: DiagnoserData['diagnoser']['noRocketData']['filters']) {
  const newFilters = Object.entries(filters)
    .filter(([_, v]) => v !== null)
    .reduce((acc, [i, v]) => {
      acc[i] = v;
      return acc;
    }, {} as any);
  return newFilters;
}

function getOptions(options: DiagnoserData['diagnoser']['noRocketData']['get_rocket_option']) {
  const newOptions = Object.entries(options)
    .filter(([i, _]) => i !== 'version')
    .reduce((acc, [i, v]) => {
      acc[i] = v;
      return acc;
    }, {} as any);
  return newOptions;
}
