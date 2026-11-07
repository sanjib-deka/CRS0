import PropTypes from "prop-types";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e5e5e5] bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl text-white ${color}`}>
        {icon}
      </div>
      <div>
        <h6 className="mb-1 text-sm text-[#737373]">{label}</h6>
        <span className="text-xl font-semibold tracking-tight text-[#171717]">₹{value}</span>
      </div>
    </div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

export default InfoCard;
