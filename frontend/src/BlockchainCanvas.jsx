import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to import Bootstrap CSS

const BlockchainCanvas = ({ blockchain }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawBlockchain();
  }, [blockchain]); // Redraw whenever blockchain changes

  const drawBlockchain = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const blockHeight = 80; // Increased height for better visibility
    const blockWidth = 300;
    const spacing = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    blockchain.forEach((block, index) => {
      // Draw block background
      ctx.fillStyle = 'rgba(173, 216, 230, 0.8)'; // Light blue with transparency
      ctx.fillRect(10, index * (blockHeight + spacing) + 10, blockWidth, blockHeight); // Draw block
      
      // Set text properties
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial'; // Set font size and family
      ctx.textAlign = 'left';

      // Display block index
      ctx.fillText(`Block ${block.index}`, 15, index * (blockHeight + spacing) + 30);
      
      // Check if voteData is valid before attempting to split
      if (block.voteData && typeof block.voteData === 'string') {
        const voteDataParts = block.voteData.split(', ');
        
        // Display voter ID and candidate, with fallback to 'N/A'
        const voterId = voteDataParts[0]?.split(': ')[1] || 'N/A';
        const candidate = voteDataParts[1]?.split(': ')[1] || 'N/A';
        
        ctx.fillText(`Voter ID: ${voterId}`, 15, index * (blockHeight + spacing) + 50);
        ctx.fillText(`Candidate: ${candidate}`, 15, index * (blockHeight + spacing) + 70);
      } else {
        // Fallback for blocks with invalid voteData
        ctx.fillText(`Voter ID: N/A`, 15, index * (blockHeight + spacing) + 50);
        ctx.fillText(`Candidate: N/A`, 15, index * (blockHeight + spacing) + 70);
      }

      // Draw block border with rounded corners
      ctx.strokeStyle = 'darkblue'; // Border color
      ctx.lineWidth = 2; // Set border width
      ctx.strokeRect(10, index * (blockHeight + spacing) + 10, blockWidth, blockHeight);
    });
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Blockchain Visualization</h2>
      <div className="d-flex justify-content-center">
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={600} 
          style={{ 
            border: '1px solid black', 
            margin: '20px auto', 
            display: 'block', 
            borderRadius: '10px', // Rounded corners
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
          }} 
        />
      </div>
    </div>
  );
};

export default BlockchainCanvas;
