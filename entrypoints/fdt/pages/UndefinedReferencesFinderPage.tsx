import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, FileCode, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { FDTData } from '@/entrypoints/devtoolsContentScript.content';
import NothingToShow from '@/components/app/devtools/NothingToShow';

type ScriptContent = { url: string; content: string };
type ScriptDefinition = { id: number; word: string; possibleDefinitions: string[] };

let runAnimations = true;
// TODO: Syncronize Undefined References between page and DevToos extension page
// TODO: noConflicts and external scripts (CDN),
export default function UndefinedReferencesPage(props: {
  fdtData: FDTData;
  undefinedReferencesOnPage: string[];
  areScriptsLoaded: boolean;
}) {
  const { fdtData } = props;
  const delayJSPresent = fdtData.wprDetections.delay_js.present;
  const { areScriptsLoaded, undefinedReferencesOnPage } = props;
  const [referencesDefinitions, setReferencesDefinitions] = useState<ScriptDefinition[]>([]);
  const [areResourcesLoaded, setAreResourcesLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  // Contains array of scripts loaded in the page (the same that can be found in the Network tab in DevTools)
  const [allScriptAssets, setAllScriptAssets] = useState<ScriptContent[]>([]);
  useEffect(() => {
    if (areScriptsLoaded || !delayJSPresent) {
      loadJSResourcesContent(fdtData).then((scriptAssets) => {
        setAllScriptAssets(scriptAssets);
        setAreResourcesLoaded(true);
        findDefinitions(allScriptAssets, undefinedReferencesOnPage, setReferencesDefinitions);
        setTimeout(() => {
          setReady(true);
        }, 1000);
      });
    }
  }, [areScriptsLoaded]);

  useEffect(() => {
    if (!areResourcesLoaded) return;
    findDefinitions(allScriptAssets, undefinedReferencesOnPage, setReferencesDefinitions);
  }, [undefinedReferencesOnPage, areResourcesLoaded]);

  if (delayJSPresent && !ready) {
    return (
      <NothingToShow
        title="Nothing to show yet"
        description="Delay JS has not been executed yet. Try interacting to the page first.."
      />
    );
  }
  if (referencesDefinitions.length === 0) {
    return (
      <NothingToShow
        title="Nothing to show"
        description="The extension couldn't find undefined references.."
      />
    );
  }
  return (
    <TooltipProvider>
      <main className="container mx-auto px-4 py-8">
        <motion.ul
          className="mx-auto grid gap-4 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: runAnimations ? 0.5 : 0 }}
        >
          {referencesDefinitions.map((undefinedReference, index) => (
            <motion.li
              key={undefinedReference.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: runAnimations ? 0.5 : 0,
                delay: runAnimations ? index * 0.02 : 0
              }}
            >
              <Card className="bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-750 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-red-500/20 text-red-400 border-red-500/50"
                    >
                      Undefined
                    </Badge>
                    <CardTitle className="text-lg font-semibold">
                      <span className="text-blue-400">{undefinedReference.word}</span>
                    </CardTitle>
                  </div>
                  {undefinedReference.possibleDefinitions.length > 0 ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="bg-emerald-500/20 text-emerald-400 rounded-full p-1">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-700 text-gray-100">
                        <p>Possible definitions found</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="bg-rose-500/20 text-rose-400 rounded-full p-1">
                          <XCircle className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-700 text-gray-100">
                        <p>No definitions found</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardHeader>
                <CardContent className="pt-4 bg-gray-800">
                  {undefinedReference.possibleDefinitions.length > 0 ? (
                    <>
                      <h4 className="text-xs font-semibold text-gray-400 mb-2">
                        Possible definitions:
                      </h4>
                      <ul className="space-y-2">
                        {undefinedReference.possibleDefinitions.map((def, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            {def === 'Inline Script' ? (
                              <>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                  <FileCode className="h-4 w-4 text-yellow-400" />
                                </div>
                                <span className="text-sm text-yellow-400">{def}</span>
                              </>
                            ) : (
                              <>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <Globe className="h-4 w-4 text-blue-400" />
                                </div>
                                <a
                                  href={def}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:underline"
                                >
                                  {def}
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm text-rose-400 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Couldn't find any possible definition
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </main>
    </TooltipProvider>
  );
}

function loadJSResourcesContent(fdtData: FDTData): Promise<ScriptContent[]> {
  return new Promise((resolve, reject) => {
    try {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        const scriptResources = resources.filter((resource: any) => {
          return (
            resource.type &&
            resource.type === 'script' &&
            resource.url &&
            resource.url.startsWith('http')
          );
        });
        const scriptsContent: ScriptContent[] = [];
        for (const [index, scriptResource] of Object.entries(scriptResources)) {
          scriptResource.getContent((content) => {
            scriptsContent.push({ url: scriptResource.url, content });
            if (Number(index) === scriptResources.length - 1) {
              const inlineScriptsContent = fdtData.wprDetections.delay_js.scripts
                .filter((s) => {
                  return typeof s.content === 'string';
                })
                .reduce<ScriptContent>(
                  (acc, s) => {
                    return { url: acc.url, content: acc.content + '\n\n' + s.content };
                  },
                  { url: 'In an Inline Script.', content: '' }
                );
              scriptsContent.push(inlineScriptsContent);
              resolve(scriptsContent);
              // setAllScriptAssets(scriptsContent);
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
function findDefinitions(
  allScriptAssets: ScriptContent[],
  undefinedReferencesOnPage: string[],
  setReferencesDefinitions: React.Dispatch<React.SetStateAction<ScriptDefinition[]>>
) {
  const scriptDefinitions: ScriptDefinition[] = undefinedReferencesOnPage.map((word, index) => {
    return {
      id: index,
      word,
      possibleDefinitions: findDefinition(word, allScriptAssets)
    };
  });
  setReferencesDefinitions(scriptDefinitions);
}
function findDefinition(word: string, allScriptAssets: ScriptContent[]) {
  const definitions: string[] = [];
  const regExp = new RegExp(
    `(((var|let|const|function) +)${word}(([^a-zA-Z0-9_$#])|$))|((^|([^a-zA-Z0-9_$#]))${word}( *(=|:)))`,
    'gm'
  );
  for (const { url, content } of allScriptAssets) {
    const match = content.match(regExp);
    if (match) {
      definitions.push(url);
    }
  }
  return definitions;
}
