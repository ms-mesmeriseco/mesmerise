import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default function ListIcons({ items = [] }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-1 gap-6">
      {items.map((item, index) => (
        <li key={index} className="flex gap-4 items-start">
          {item.icon?.url && (
            <img
              src={item.icon.url}
              alt={item.icon.title || ""}
              className="w-10 h-10 object-contain"
            />
          )}
          <div className="prose">
            {item.textContent?.json &&
              documentToReactComponents(item.textContent.json)}
          </div>
        </li>
      ))}
    </ul>
  );
}
