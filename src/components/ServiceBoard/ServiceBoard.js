import PropTypes from 'prop-types';
import Board from 'react-trello';
import CustomCard from './CustomCard';
import CustomLaneHeader from './CustomLaneHeader';

import './ServiceBoard.css';

export default function ServiceBoard({ data = [], filterPayload, onCardClick, cardDetail }) {
  const onCardClickHandler = (cardId, cardDetails, laneId) => onCardClick(cardId, cardDetails, laneId);

  const onCardDragEndHandler = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
    // TODO
  };

  const onDataChangeHandler = (newData) => console.log('Data Changed');

  return (
    <Board
      components={{ Card: CustomCard, LaneHeader: CustomLaneHeader }}
      data={{ lanes: data }}
      tagStyle={{ fontSize: '80%' }}
      style={{
        backgroundColor: 'transparent',
        height: '75vh',
        width: '100%',
        overflowX: 'hidden'
      }}
      onCardClick={onCardClickHandler}
      handleDragEnd={onCardDragEndHandler}
      onDataChange={onDataChangeHandler}
    />
  );
}

ServiceBoard.propTypes = {
  data: PropTypes.object,
  onCardClick: PropTypes.func,
  filterPayload: PropTypes.object
};
