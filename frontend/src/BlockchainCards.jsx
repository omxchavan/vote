import React, { useState, useEffect } from 'react';
import { useSprings, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import './BlockchainCards.css'; // Import your CSS file for additional styles

const BlockchainCards = ({ blockchain }) => {
  const [visibleCount, setVisibleCount] = useState(1); // Start with one visible card
  const { ref, inView } = useInView({ threshold: 1.0 });

  // Update the visible count when the last card is in view
  useEffect(() => {
    if (inView && visibleCount < blockchain.length) {
      setVisibleCount((prevCount) => prevCount + 1); // Show next card
    }
  }, [inView, visibleCount, blockchain.length]);

  // Log the blockchain data for debugging
  console.log("Blockchain Data:", blockchain);

  // Use useSprings to create springs for all visible cards
  const springs = useSprings(
    visibleCount,
    blockchain.slice(0, visibleCount).map((block, index) => ({
      opacity: 1,
      transform: 'translateY(0)',
      from: { opacity: 0, transform: 'translateY(20px)' },
      config: { tension: 250, friction: 20, duration: 2000 }, // 2 seconds for the appearance
      delay: index * 500, // Add delay based on index
    }))
  );

  return (
    <div className="blockchain-cards-container">
      {springs.map((spring, index) => (
        <div className="block-container" key={index}>
          <animated.div style={spring}>
            <div className="card border-light shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Block #{index + 1}</h5>
              </div>
              <div className="card-body">
                {blockchain[index] ? ( // Check if blockchain[index] exists
                  <>
                    <p className="card-text"><strong>Data:</strong> {blockchain[index].data}</p>
                    <p className="card-text"><strong>Hash:</strong> {blockchain[index].hash}</p>
                    <p className="card-text"><strong>Previous Hash:</strong> {blockchain[index].previousHash}</p>
                    <p className="card-text"><strong>Timestamp:</strong> {new Date(blockchain[index].timestamp).toLocaleString()}</p>
                    {blockchain[index].candidate && (
                      <p className="card-text"><strong>Candidate:</strong> {blockchain[index].candidate}</p>
                    )}
                  </>
                ) : (
                  <p>Loading block data...</p> // Optional loading state
                )}
              </div>
              <div className="card-footer">
                <button className="btn btn-info btn-sm">View Details</button>
              </div>
            </div>
          </animated.div>
          {/* Arrow pointing to the next block */}
          {index < visibleCount - 1 && (
            <div className="arrow-container">
              <div className="arrow"></div>
            </div>
          )}
        </div>
      ))}
      {/* Sentinel div to trigger loading of next card */}
      {visibleCount < blockchain.length && (
        <div ref={ref} style={{ height: '20px', margin: '10px 0' }}></div>
      )}
    </div>
  );
};

export default BlockchainCards;
