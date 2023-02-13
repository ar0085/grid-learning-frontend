import { grid } from "@mui/system";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { createDummyObj } from "./helper";
import LegendComponent from "./LegendComponent";

const GridComponent = () => {
  // stores index of cell machine currently is at
  const currIdx = useRef(
    sessionStorage.getItem("currIdx")
      ? JSON.parse(sessionStorage.getItem("currIdx"))
      : [10, 30]
  );
  const gridMap = sessionStorage.getItem("gridMap")
    ? JSON.parse(sessionStorage.getItem("gridMap"))
    : createDummyObj(20, 60);
  // stores the index where machine has to perform next operation
  const destIdx = useRef(currIdx.current);
  // stores the value of next operation to perform
  const nextOp = useRef("idle");
  // stores the current state of machine
  const machineState = useRef(
    sessionStorage.getItem("machineState")
      ? sessionStorage.getItem("machineState")
      : "idle"
  );

  /*
  setAsPath is used to mark cells as a part of path while
  traversing the grid.
  It takes the Index of the cell to be marked as path,
  and sets the attribute value of "cellStatus" to "path"
  and it would not change for any cell which is already marked as
  "Captured", "Focused" or "Capturing".
  */

  const setAsPath = (pathIdx) => {
    let pathCellStatus = document
      .getElementById(`gci-${pathIdx[0]}-${pathIdx[1]}`)
      .getAttribute("cellStatus");
    //checking if cellStatus attribute is not set as Captured,
    //Focused or Capturing
    if (
      pathCellStatus !== "Captured" &&
      pathCellStatus !== "Focused" &&
      pathCellStatus !== "Capturing"
    ) {
      document
        .getElementById(`gci-${pathIdx[0]}-${pathIdx[1]}`)
        .setAttribute("cellStatus", "Path");
      gridMap[`status-${pathIdx[0]}-${pathIdx[1]}`] = "Path";
      sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
    }
  };

  /* 
  keyPressApiFunc is used to call backend to get the next
  destiation cell value and what operation to perform next.
  Takes Key Stroke, Current Index and Machine State as input
  and returns new Destination Index and what Operation to perform.
  */

  const keyPressApiFunc = async (keyStroke, currentIdx, machineState) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/key-pressed",
        {
          keyStroke: keyStroke,
          currentIdx: JSON.stringify({ data: currentIdx }),
          machineState: machineState,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return res;
    } catch (err) {
      throw err;
    }
  };

  /*
  focus function mocks the actual focus function by using setTimeout for 3000ms.
  It takes Index of the cell on which the focus operation should be performed
  and stores it in focusedIdx variable and sets the "machine state" to "focus" along with
  "cellStatus" attribute to "Focused". By default nextOp is set to capture.
  */

  const focus = async (destIndex) => {
    //store destIdx in focusedIdx
    const focusedIdx = destIndex;
    //set machineState to focus
    machineState.current = "focus";
    sessionStorage.setItem("machineState", machineState.current);
    const cellPrevState = document
      .getElementById(`gci-${focusedIdx[0]}-${focusedIdx[1]}`)
      .getAttribute("cellStatus");
    //set focusedIdx "cellStatus" attribute to "Focused"
    document
      .getElementById(`gci-${focusedIdx[0]}-${focusedIdx[1]}`)
      .setAttribute("cellStatus", "Focused");
    gridMap[`status-${focusedIdx[0]}-${focusedIdx[1]}`] = "Focused";
    sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
    //set nextOp to be default as capture
    nextOp.current = "capture";

    //wait for 3 seconds
    await setTimeout(() => {
      //Check if nextOp is changed i.e. user has given more keyStroke input
      if (nextOp.current === "capture") {
        //if next operation is capture call capture function on focusedIdx
        capture(focusedIdx);
      } else {
        //set focusedIdx "cellStatus" attribute to "Path"
        //but check if previousCellState is captured then
        //reset focusedIdx "cellStatus" attribute to "Capture"
        if (cellPrevState !== "Captured") {
          document
            .getElementById(`gci-${focusedIdx[0]}-${focusedIdx[1]}`)
            .setAttribute("cellStatus", "Path");
          gridMap[`status-${focusedIdx[0]}-${focusedIdx[1]}`] = "Path";
          sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
        } else {
          document
            .getElementById(`gci-${focusedIdx[0]}-${focusedIdx[1]}`)
            .setAttribute("cellStatus", "Captured");
          gridMap[`status-${focusedIdx[0]}-${focusedIdx[1]}`] = "Captured";
          sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
        }
        //call focus function on the new destination index
        focus(destIdx.current);
      }
    }, 3000);
  };

  /*
  capture function mocks the actual capture function by using setTimeout for 2000ms.
  It takes Index of the cell on which the capture operation should be performed
  and stores it in captureIdx variable and sets the "machine state" to "capture" along with
  "cellStatus" attribute to "Capturing". By default nextOp is set to idle.
  */

  const capture = async (destIndex) => {
    //store destIdx in captureIdx
    const captureIdx = destIndex;
    //set machine state to capture
    machineState.current = "capture";
    sessionStorage.setItem("machineState", machineState.current);
    //set captureIdx "cellStatus" attribute to "Capturing"
    document
      .getElementById(`gci-${captureIdx[0]}-${captureIdx[1]}`)
      .setAttribute("cellStatus", "Capturing");
    gridMap[`status-${captureIdx[0]}-${captureIdx[1]}`] = "Capturing";
    sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
    //set nextOp to default state of idle
    nextOp.current = "idle";
    await setTimeout(() => {
      //set captureIdx "cellStatus" attribute to "Captured after Timeout is over"
      document
        .getElementById(`gci-${captureIdx[0]}-${captureIdx[1]}`)
        .setAttribute("cellStatus", "Captured");
      gridMap[`status-${captureIdx[0]}-${captureIdx[1]}`] = "Captured";
      sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
      //Check if nextOp is changed i.e. user has given more keyStroke input
      if (nextOp.current === "idle") {
        //if nextOp is not changed then machine should go to Idle state
        machineState.current = "idle";
        sessionStorage.setItem("machineState", machineState.current);
        return;
      } else {
        //call focus function on the new destination index
        focus(destIdx.current);
      }
    }, 2000);
  };

  //useEffect runs only at first render to start tracking of
  //current cell based on user input
  useEffect(() => {
    document
      .getElementById(`gci-${currIdx.current[0]}-${currIdx.current[1]}`)
      .setAttribute("activeCell", true);
    if (machineState.current !== "idle") {
      if (machineState.current === "focus") {
        focus(currIdx.current);
      } else {
        capture(currIdx.current);
      }
    }
  }, []);
  //Over here 0 means the user is moving in a column,
  //1 means the user is moving in a row;
  const handleUserInput = async (e) => {
    const response = await keyPressApiFunc(
      e.key,
      currIdx.current,
      machineState.current
    );
    //updating destIdx and nextOp value based
    //on API response
    destIdx.current = response.data.destIdx;
    nextOp.current = response.data.newMachineState;
    setAsPath(response.data.destIdx);
    console.log(gridMap); //Focus function is called here to start the machine when
    //state is set to idle
    console.log(machineState.current);
    if (machineState.current === "idle") {
      focus(response.data.destIdx);
    }
    switch (e.key) {
      case "ArrowUp":
        move(0, -1);
        break;
      case "ArrowDown":
        move(0, 1);
        break;
      case "ArrowLeft":
        move(1, -1);
        break;
      case "ArrowRight":
        move(1, 1);
        break;
      default:
        break;
    }
  };

  //This will ass an event listner to window on
  //the initial render
  useEffect(() => {
    window.addEventListener("keydown", handleUserInput);
  }, []);

  /*
  move function will help updated the current cell index based on
  user input. it takes direction and change as input parameter, where
  direction denotes if user is moving across an array(dir = 1) or a 
  column(dir = 0)
  */
  const move = (dir, change) => {
    let currCoord = currIdx.current;
    //checker to make sure current cell index is in bounds
    if (
      currCoord[dir] + change > -1 && dir === 0
        ? currCoord[dir] + change < 20
        : currCoord[dir] + change < 60
    ) {
      //set previous cell "activeCell" attribute to "false"
      document
        .getElementById(`gci-${currCoord[0]}-${currCoord[1]}`)
        .setAttribute("activeCell", false);

      //updating the currCoord to point to new selected index
      currCoord[dir] += change;
      currIdx.current = currCoord;
      sessionStorage.setItem("currIdx", JSON.stringify(currIdx.current));
      //set current cell "activeCell" attribute to "true"
      document
        .getElementById(`gci-${currCoord[0]}-${currCoord[1]}`)
        .setAttribute("activeCell", true);
    }
  };

  //creates a 2-D grid array
  const gridArr = () => {
    const grid = [];
    for (let i = 0; i < 20; i++) {
      const currRow = [];
      for (let j = 0; j < 60; j++) {
        if (
          gridMap[`status-${i}-${j}`] === "Focused" ||
          gridMap[`status-${i}-${j}`] === "Capturing"
        ) {
          gridMap[`status-${i}-${j}`] = "Path";
          sessionStorage.setItem("gridMap", JSON.stringify(gridMap));
        }
        currRow.push(gridMap[`status-${i}-${j}`]);
      }
      grid.push(currRow);
    }
    return grid;
  };
  return (
    <div>
      <div className="grid">
        {gridArr().map((row, rowIdx) => {
          return (
            <div key={rowIdx} style={{ display: "flex" }}>
              {row.map((cell, cellIdx) => {
                return (
                  <div
                    id={`gci-${rowIdx}-${cellIdx}`}
                    activeCell="false"
                    className="grid-cell"
                    cellStatus={cell}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      <LegendComponent />
    </div>
  );
};

export default GridComponent;