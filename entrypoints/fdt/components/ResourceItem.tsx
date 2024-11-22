import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useLazyLoad from '@/custom-hooks/useLazyLoad';

type Color = 'green' | 'red' | 'yellow';
const ColorSet = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  red: 'text-rose-400'
} as const;

export default function ResourceItem(props: {
  /**
   * The resource which info should be printed in the component
   */
  resource: {
    type: string | [string, Color];
    labels?: Map<string, boolean>;
    content: string;
  };
  /**
   * Whether the component should be expanded or not as the initial state. `false` by default (Code must have more than 3 lines to be expandable)
   */
  expanded?: boolean;
  /**
   * The language to be used for the syntax highlighting in the code block
   *
   * If language is provided, the content of the item will be shown in a code block with with syntax highlighting usig the language provided
   *
   * If the language is not provided, then the content will be shown as a link (anchor)
   */
  language?: string;
  /**
   * Allows the component to prevent Syntax Highlighting from firing before the element is close to be in the viewport
   *
   * Since Syntax Highlighting can be very heavy for long strings, reserving the rendering until the element is close to be in the viewport can allow pages containing this component to render faster
   *
   * @defaultValue `true`
   */
  lazyload?: boolean;
  // runAnimations: boolean;
}) {
  const { resource, language, lazyload = true } = props;
  let truncatedContent = useMemo(() => {
    return resource?.content?.slice(0, 300) ?? '';
  }, [resource.content]);
  const [expanded, setExpanded] = useState(!!props.expanded);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(!!props.expanded);
  const [expandable, setExpandable] = useState(true);
  const syntaxElement = useRef<HTMLDivElement>(null);
  const thisElement = useRef<HTMLDivElement>(null);
  const isIntersecting = useLazyLoad({ elementRef: thisElement, once: true });
  const labels = !resource.labels ? [] : Array.from(resource.labels.entries());
  const toggleExpand = () => {
    setExpanded((s) => !s);
    setHasBeenExpanded(true);
  };
  // const runAnimations = typeof props?.runAnimations === 'undefined' ? true : props.runAnimations;
  useEffect(() => {
    if (!syntaxElement.current || !isIntersecting) return;
    const pre = syntaxElement.current.querySelector<HTMLPreElement>('pre');
    if (pre?.clientHeight === pre?.scrollHeight) {
      setExpandable(false);
    }
  }, [isIntersecting]);
  return (
    <Card
      ref={thisElement}
      className="bg-gray-800 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`text-sm font-medium ${
                Array.isArray(resource.type) ? ColorSet[resource.type[1]] : 'text-green-400'
              }`}
            >
              {Array.isArray(resource.type) ? resource.type[0] : resource.type}
            </span>
            {labels.map(([name, value]) => {
              return (
                <div key={name} className="flex items-center space-x-1">
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400" />
                  )}
                  <span className="text-xs text-gray-400">{name}</span>
                </div>
              );
            })}
          </div>
          {language && expandable && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleExpand()}
                  className="text-gray-400 hover:text-gray-100"
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <>
                      <span className="flex flex-row justify-center">
                        <span className="text-[0.70rem]">
                          {!hasBeenExpanded && 'Trucated,'} {!hasBeenExpanded ? 'e' : 'E'}xpand to
                          see the full code{' '}
                        </span>
                        <ChevronDown className="h-4 w-4 inline-block" />
                      </span>
                    </>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-700 text-gray-100">
                <p>{expanded ? 'Contract' : 'Expand'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <AnimatePresence>
          {!language ? (
            <p className="mt-2 text-sm text-blue-400 break-all">
              <a
                href={resource.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="min-h-4 min-w-4 h-4 w-4 mr-1" />
                {resource.content}
              </a>
            </p>
          ) : (
            <motion.div
              initial={{
                height: 65,
                minHeight: 65
              }}
              animate={{
                height: expanded ? 'auto' : 65,
                minHeight: 65
              }}
              exit={{
                height: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="mt-2 overflow-hidden min-h-[65px]:"
              ref={syntaxElement}
            >
              {(lazyload || isIntersecting) && (
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    maxHeight: '100%'
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                >
                  {expanded || hasBeenExpanded ? resource.content : truncatedContent}
                </SyntaxHighlighter>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
