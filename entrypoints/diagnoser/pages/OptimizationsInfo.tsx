import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  ChevronDown,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { DiagnoserData } from '@/entrypoints/devtoolsContentScript.content';
import { getRealOptionName } from '@/lib/optionNamesMap.util';
import NothingToShow from '@/components/app/devtools/NothingToShow';
import { OptimizationsInfoItem } from '../components/OptimizationInfoItem';

const jsonData = {
  options: {
    remove_unused_css: {
      filters: {
        rocket_rucss_safelist: [],
        rocket_rucss_external_exclusions: [
          '/wp-content/something.css',
          '/wp-content/something2.css'
        ],
        rocket_rucss_preserve_google_font: false,
        rocket_rucss_skip_styles_with_attr: ['skip-rucss']
      },
      get_rocket_option: {
        remove_unused_css: 1,
        remove_unused_css_safelist: []
      }
    },
    delay_js: {
      filters: {
        rocket_delay_js_exclusions: [
          '/jquery(-migrate)?-?([0-9.]+)?(.min|.slim|.slim.min)?.js(\\?(.*))?( |\'|"|>)',
          '/wp-content/plugins/booking/(.*)',
          'wpbc_init__head',
          'wpbc_url_ajax',
          'booking_max_monthes_in_calendar',
          'wpbc_define_tippy_popover',
          'flex_tl_table_loading',
          '(.*)_wpbc.(.*)',
          'moveOptionalElementsToGarbage',
          ' wpbc_(.*)'
        ]
      },
      get_rocket_option: {
        delay_js: 1,
        delay_js_exclusions: [],
        delay_js_exclusions_selected_exclusions: []
      }
    },
    defer_all_js: {
      filters: {
        rocket_exclude_defer_js: []
      },
      get_rocket_option: {
        defer_all_js: 1,
        exclude_defer_js: []
      }
    },
    async_css: {
      filters: [],
      get_rocket_option: {
        async_css: 0,
        critical_css: ''
      }
    },
    lazyload: {
      filters: {
        rocket_lazyload_threshold: 300,
        rocket_use_native_lazyload: false,
        rocket_use_native_lazyload_images: false,
        rocket_lazyload_background_images: true,
        do_rocket_lazyload: true,
        do_rocket_lazyload_iframes: true
      },
      get_rocket_option: {
        lazyload: 1,
        exclude_lazyload: []
      }
    },
    minify_css: {
      filters: [],
      get_rocket_option: {
        minify_css: 1,
        exclude_css: []
      }
    },
    minify_js: {
      filters: [],
      get_rocket_option: {
        minify_js: 1,
        exclude_js: [],
        exclude_inline_js: []
      }
    },
    cdn: {
      filters: [],
      get_rocket_option: {
        cdn: 0,
        cdn_reject_files: []
      }
    },
    cache_webp: {
      filters: [],
      get_rocket_option: {
        cache_webp: false
      }
    },
    cache_ssl: {
      filters: [],
      get_rocket_option: {
        cache_ssl: 1
      }
    }
  }
};

let runAnimations = true;
export default function OptimizationsInfoPage(props: { diagnoser: DiagnoserData['diagnoser'] }) {
  const options = props?.diagnoser?.rocketData?.options;
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [expandedArrays, setExpandedArrays] = useState<string[]>([]);

  const toggleCard = (key: string) => {
    setExpandedCards((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleArray = (key: string) => {
    setExpandedArrays((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  useEffect(() => {
    runAnimations = false;
  }, []);
  if (!options) {
    return (
      <NothingToShow
        title="WP Rocket seems to be inactive"
        description="Activate WP Rocket if you want to see the information about optimizations."
      />
    );
  }
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100">
        <main className="container mx-auto px-4 py-6">
          {/* <h1 className="text-3xl font-bold mb-6 text-blue-400">WP Rocket Options</h1> */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: runAnimations ? 0.5 : 0 }}
          >
            {/* TODO: Fix [any, any] type when types for diagnoser data are created */}
            {Object.entries(options).map(([key, value]: [any, any], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: runAnimations ? 0.5 : 0,
                  delay: runAnimations ? index * 0.1 : 0
                }}
              >
                <OptimizationsInfoItem optimizationName={key} optimizationInfo={value} />
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </TooltipProvider>
  );
}
