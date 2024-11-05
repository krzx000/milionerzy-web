import n1to3win from "../assets/sounds/win/1_to_3 win.mp3";
import win4 from "../assets/sounds/win/4 win.wav";
import win5 from "../assets/sounds/win/5 win.wav";
import win6 from "../assets/sounds/win/6 win.wav";
import win7 from "../assets/sounds/win/7 win.wav";
import win8 from "../assets/sounds/win/8 win.wav";
import win9 from "../assets/sounds/win/9 win.wav";
import win10 from "../assets/sounds/win/10 win.wav";
import win11 from "../assets/sounds/win/11 win.wav";
import win12 from "../assets/sounds/win/12 win.wav";

import n1to4start from "../assets/sounds/start/1_to_4-start.mp3";
import start5 from "../assets/sounds/start/5 start.wav";
import start6 from "../assets/sounds/start/6 start.wav";
import start7 from "../assets/sounds/start/7 start.wav";
import start8 from "../assets/sounds/start/8 start.wav";
import start9 from "../assets/sounds/start/9 start.wav";
import start10 from "../assets/sounds/start/10 start.wav";
import start11 from "../assets/sounds/start/11 start.wav";
import start12 from "../assets/sounds/start/12 start.wav";

import n1to4lose from "../assets/sounds/lose/1_to_4 lose.mp3";
import lose5 from "../assets/sounds/lose/5 lose.mp3";
import lose6 from "../assets/sounds/lose/6 lose.mp3";
import lose7 from "../assets/sounds/lose/7 lose.mp3";
import lose8 from "../assets/sounds/lose/8 lose.mp3";
import lose9 from "../assets/sounds/lose/9 lose.mp3";
import lose10 from "../assets/sounds/lose/10 lose.mp3";
import lose11 from "../assets/sounds/lose/11 lose.mp3";
import lose12 from "../assets/sounds/lose/12 lose.mp3";

import answer from "../assets/sounds/answer/answer.wav";
import lightsDown from "../assets/sounds/lightsdown/start lights down.wav";
export const SOUND = {
  lightsDown,
  answer,
  win: [n1to3win, n1to3win, n1to3win, win4, win5, win6, win7, win8, win9, win10, win11, win12],
  start: [
    n1to4start,
    n1to4start,
    n1to4start,
    n1to4start,
    start5,
    start6,
    start7,
    start8,
    start9,
    start10,
    start11,
    start12,
  ],
  lose: [
    n1to4lose,
    n1to4lose,
    n1to4lose,
    n1to4lose,
    lose5,
    lose6,
    lose7,
    lose8,
    lose9,
    lose10,
    lose11,
    lose12,
  ],
};
