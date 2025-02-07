import PropTypes from 'prop-types';
import Autocomplete from '@mui/joy/Autocomplete';

const SearchBar = ({ onInputChange, options }) => (
  <div className="flex-grow mr-4">
    <Autocomplete
      onChange={onInputChange}
      placeholder="Suchen..."
      options={options}
      getOptionLabel={option => option.title}
      className="w-full border border-gray-300 p-2 rounded-md"
    />
  </div>
);

SearchBar.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired
    })
  ).isRequired
};

export default SearchBar; 