import { Link, useRoute } from 'wouter';

const ActiveLink = (props: any) => {
  const [isActive] = useRoute(props.href);
  const extraClasses = isActive
    ? 'text-blue-400 border-b-2 border-blue-400'
    : 'text-gray-400 hover:bg-gray-800/50 hover:text-blue-400 rounded-md';
  return (
    <Link {...props} className={`${props.className} ${extraClasses}`}>
      {props.children}
    </Link>
  );
};

export default function DevToolsMenu(props: { items: { name: string; path: string }[] }) {
  const menuItems = props.items;
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-1 py-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <ActiveLink
                href={item.path}
                className={`group relative flex items-center space-x-1 px-2 py-1.5 text-xs font-medium transition-colors duration-200`}
              >
                <span className="inline">{item.name}</span>
              </ActiveLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
