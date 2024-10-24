import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Code, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { FDTData } from '@/entrypoints/devtoolsContentScript.content';
import NothingToShow from '@/components/app/devtools/NothingToShow';
import { undefinedReferenceExternalError } from '@/Globals';
import FetchingComponent from '@/components/app/devtools/FetchingComponent';

type ScriptContent = { url: string; content: string };
type ScriptDefinition = { id: number; word: string; possibleDefinitions: string[] };

let runAnimations = true;
let allScriptAssets: ScriptContent[] = [];
let referencesDefinitions: ScriptDefinition[] = [];
let undefinedReferences: string[] = [];
let setReadyInterval: null | NodeJS.Timeout = null;
export default function UndefinedReferencesPage(props: {
  fdtData: FDTData;
  undefinedReferencesOnPage: string[];
  areScriptsLoaded: boolean;
}) {
  const { fdtData } = props;
  const delayJSPresent = fdtData.wprDetections.delay_js.present;
  const { areScriptsLoaded, undefinedReferencesOnPage } = props;
  undefinedReferences = undefinedReferencesOnPage;
  const [referencesDefinitionsState, setReferencesDefinitionsState] =
    useState(referencesDefinitions);
  const [ready, setReady] = useState(false);

  const init = (scriptAssets: ScriptContent[], undefinedReferences: string[]) => {
    const definitions = findDefinitions(scriptAssets, undefinedReferences);
    referencesDefinitions = definitions;
    setReferencesDefinitionsState(definitions);
    if (setReadyInterval) clearInterval(setReadyInterval);
    setReadyInterval = setTimeout(() => {
      setReady(true);
      if (setReadyInterval) clearInterval(setReadyInterval);
      setReadyInterval = null;
    }, 1000);
  };

  useEffect(() => {
    if (referencesDefinitionsState.length > 0) {
      setReady(true);
      return;
    }
    if (areScriptsLoaded || !delayJSPresent) {
      loadJSResourcesContent(fdtData).then((scriptAssets) => {
        allScriptAssets = scriptAssets;
        init(allScriptAssets, undefinedReferences);
      });
    }
  }, [areScriptsLoaded]);

  useEffect(() => {
    undefinedReferences = undefinedReferencesOnPage;
    if (allScriptAssets.length === 0) return;
    init(allScriptAssets, undefinedReferences);
  }, [undefinedReferencesOnPage]);
  useEffect(() => {
    if (referencesDefinitionsState.length > 0) {
      runAnimations = false;
    }
  }, []);
  if (delayJSPresent && areScriptsLoaded && !ready) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <FetchingComponent
          title="Processing JavaScript assets"
          description="The extension is looking for possible definitions of the undefined references in the page's scripts"
          footer="Working..."
        />
      </div>
    );
  }

  if (delayJSPresent && !areScriptsLoaded) {
    return (
      <NothingToShow
        title="Nothing to show yet"
        description="Delay JS has not been executed yet. Try interacting to the page first.."
      />
    );
  }
  if (referencesDefinitionsState.length === 0) {
    return (
      <NothingToShow
        title="Nothing to show"
        description="No undefined references were detected, but the app is actively monitoring for any that may still occur."
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
          {referencesDefinitionsState.map((undefinedReference, index) => (
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
                      <span className="text-blue-400">
                        {undefinedReference.word === undefinedReferenceExternalError
                          ? 'Script error.'
                          : undefinedReference.word}
                      </span>
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
                                  <Code className="min-h-4 min-w-4 h-4 w-4 text-yellow-400" />
                                </div>
                                <span className="text-sm text-yellow-400">{def}</span>
                              </>
                            ) : (
                              <>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <ExternalLink className="min-h-4 min-w-4 h-4 w-4 text-blue-400" />
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
                      <AlertTriangle className="min-h-4 min-w-4 h-4 w-4 mr-2" />
                      {undefinedReference.word === undefinedReferenceExternalError
                        ? `Since the error ocurred in a file loaded from an external server, the browser limited the information that can be read from it. Make sure to disable CDNs in there are any.`
                        : `Couldn't find any possible definition`}
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
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
function findDefinitions(allScriptAssets: ScriptContent[], undefinedReferencesOnPage: string[]) {
  const definitions: ScriptDefinition[] = undefinedReferencesOnPage.map(
    (undefinedReference, index) => {
      if (undefinedReference === undefinedReferenceExternalError) {
        return {
          id: index,
          word: undefinedReference,
          possibleDefinitions: []
        };
      }
      return {
        id: index,
        word: undefinedReference,
        possibleDefinitions: findDefinition(undefinedReference, allScriptAssets)
      };
    }
  );
  return definitions;
}
function findDefinition(undefinedReference: string, allScriptAssets: ScriptContent[]) {
  const definitions: string[] = [];
  const regExp = new RegExp(
    `(((var|let|const|function) +)${undefinedReference}(([^a-zA-Z0-9_$#])|$))|((^|([^a-zA-Z0-9_$#]))${undefinedReference}( *(=|:)))`,
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
