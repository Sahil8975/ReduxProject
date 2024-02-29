import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';

function AvatarComponent({ imageUrl, width, height, variant, alt, fallbacks }) {
  return (
    <div>
      <Avatar alt={alt} src={imageUrl} sx={{ width, height }} variant={variant}>
        {fallbacks}
      </Avatar>
    </div>
  );
}

AvatarComponent.propTypes = {
  imageUrl: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  variant: PropTypes.string,
  alt: PropTypes.string,
  fallbacks: PropTypes.string
};

export default AvatarComponent;
