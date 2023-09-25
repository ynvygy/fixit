import React from 'react';
import '../App.css';

const MainPage = ({connectWallet}) => {
  const cities = [
    "New York",
    "Paris",
    "London",
    "Tokyo",
    "Rome",
    "Beijing",
    "Istanbul",
    "Rio de Janeiro",
    "Cairo",
    "Sydney",
    "Moscow",
    "Mumbai",
    "Los Angeles",
    "Dubai",
    "Buenos Aires",
    "Seoul",
    "Amsterdam",
    "Bangkok",
    "San Francisco",
    "Barcelona",
    "Athens",
    "Singapore",
    "Toronto",
    "Prague",
  ];

  const shuffledCities = [...cities].sort(() => Math.random() - 0.5);

  const colors = [
    "red", "brown", "orange","#FFC400" , "yellow",
    "purple", "plum", "lightcoral", "gold", "#E6E600", 
    "lightseagreen", "cyan", "lightseagreen", "#FFE633", "#C5E17A" , 
    "#3498db","#23DAE9" , "mediumspringgreen", "#A4D54D", "#83C720",
    "blue", "lightskyblue",  "teal", "lime", "green"
  ];

  const colors_save = [
    "red", "brown", "orange", "powderblue", "yellow",
    "purple", "pink", "cyan", "teal", "gold", 
    "gray", "lightcoral", "lightseagreen", "lightpink", "lightskyblue", 
    "lightsteelblue", "lightyellow", "mediumorchid", "lime", "mediumspringgreen",
    "blue", "mediumpurple", "paleturquoise", "plum", "green"
  ];

  const boxes = shuffledCities.map((city, index) => ({
    text: city,
    color: colors[index],
    clickable: index === 12
  }));

  boxes[24] = boxes[12];
  boxes[24].clickable = false;
  boxes[12] = { text: 'FixIt', color: 'gray', clickable: true };

  const handleBoxClick = (index) => {
    connectWallet();
  };

  return (
    <div className="grid">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={`box ${box.clickable ? 'clickable' : 'destinations'}`}
          style={{ backgroundColor: box.color }}
          onClick={() => box.clickable && handleBoxClick(index)}
        >
          <p className="box-text">{box.text}</p>
        </div>
      ))}
    </div>
  );
}

export default MainPage;
