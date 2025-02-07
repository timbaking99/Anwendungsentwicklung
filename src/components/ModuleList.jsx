import PropTypes from 'prop-types';

const ModuleList = ({ data, searchQuery, onItemClick, expandedItems }) => (
  <>
    <h1 className="text-red-600 text-xl font-bold">Module</h1>
    {data.map((item, index) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) && (
        <div
          className="p-4 mb-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          key={item.id}
          onClick={() => onItemClick(index)}
        >
          <h2 className="font-bold text-lg">{item.title}</h2>
          <p className="text-gray-600">Quelle: {item.source}</p>
          {expandedItems[index] && (
            <div className="mt-2">
              <p className="font-semibold">Verwandte Module:</p>
              <ul className="list-disc list-inside text-blue-600">
                {item.relatedmodules.map((module) => (
                  <li key={module}>{module}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    )}
  </>
);

ModuleList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      relatedmodules: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  searchQuery: PropTypes.string.isRequired,
  onItemClick: PropTypes.func.isRequired,
  expandedItems: PropTypes.object.isRequired
};

export default ModuleList; 