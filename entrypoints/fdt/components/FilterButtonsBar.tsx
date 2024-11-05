import { motion } from 'framer-motion';

export default function FilterButtonsBar(props: {
  runAnimations?: boolean;
  buttons: { text: string; action: (button?: string) => void }[];
}) {
  const [activeFilter, setActiveFilter] = useState('Show All');
  const filterButtons = props.buttons;
  const runAnimations = typeof props?.runAnimations === 'undefined' ? true : props.runAnimations;
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: runAnimations ? 0.5 : 0 }}
    >
      <div className="flex flex-wrap justify-end gap-1 bg-gray-800/50 p-2 rounded-lg shadow-inner">
        {filterButtons.map((button) => (
          <button
            key={button.text}
            onClick={() => {
              setActiveFilter(button.text);
              button.action(button.text);
            }}
            className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
              activeFilter === button.text
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {button.text}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
