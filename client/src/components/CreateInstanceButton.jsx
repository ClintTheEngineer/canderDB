import PropTypes from 'prop-types';

export const CreateInstanceButton = ({ onClick }) => {
  return (
    <>
    <button onClick={onClick}> + Create New Instance</button>
    </>
  )
}

CreateInstanceButton.propTypes = {
  onClick: PropTypes.func.isRequired
}