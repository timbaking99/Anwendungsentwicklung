import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';

const LegendItem = ({ color, label }) => (
  <div className="flex items-center">
    <div 
      className="w-4 h-4 rounded-full mr-2" 
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
  </div>
);

LegendItem.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const Legend = () => (
  <div className="mt-4 flex items-center justify-center gap-8 p-4 bg-white border border-gray-300 rounded-lg">
    <LegendItem color={COLORS.MODULE} label="Module" />
    <LegendItem color={COLORS.CONCEPT} label="Konzepte" />
  </div>
);

export default Legend; 