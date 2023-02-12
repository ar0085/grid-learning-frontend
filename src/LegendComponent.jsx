import React from "react";

const LegendComponent = () => {
  return (
    <div className="legend-container">
      <div style={{ display: "flex", marginRight: "5%" }}>
        <div className="grid-cell-legend" cellStatus="Unmarked"></div>
        <span>Unvisited</span>
      </div>
      <div style={{ display: "flex", marginRight: "5%" }}>
        <div className="grid-cell-legend" cellStatus="Path"></div>
        <span>Path</span>
      </div>
      <div style={{ display: "flex", marginRight: "5%" }}>
        <div className="grid-cell-legend" cellStatus="Focused"></div>
        <span>Focused</span>
      </div>
      <div style={{ display: "flex", marginRight: "5%" }}>
        <div className="grid-cell-legend" cellStatus="Capturing"></div>
        <span>Capturing</span>
      </div>
      <div style={{ display: "flex" }}>
        <div className="grid-cell-legend" cellStatus="Captured"></div>
        <span>Captured</span>
      </div>
    </div>
  );
};

export default LegendComponent;
