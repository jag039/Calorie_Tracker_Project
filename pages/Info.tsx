import React from 'react';

interface InfoProps {
  limit: number;
  img: string;
  eaten: number;
}

const Info: React.FC<InfoProps> = ({ limit, img, eaten }) => {
  return (
    <div>
      <div>
        <p>Limit: {limit}</p>
        <img src={img} alt="Food"/>
        <p>Eaten: {eaten}</p>
      </div>
    </div>
  );
};

export default Info;