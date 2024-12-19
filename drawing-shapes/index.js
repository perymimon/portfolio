import {drawBall} from "./items/ball.js";
import {drawBell} from './items/bell.js'
import {drawBow} from './items/bow.js'
import {drawCalendar} from './items/calendar.js'
import {drawCandle} from './items/candle.js'
import {drawCandy} from './items/candy.js'
import {drawCane} from './items/cane.js'
import {drawGlove} from './items/glove.js'
import {drawHat} from './items/hat.js'
import {drawSledge} from './items/sledge.js'
// import {drawBell as drawBell2} from './items/bell-2.js'
import {drawSnowBall} from './items/snow-ball.js'
import {drawSnowflake} from './items/snowflake.js'
import {drawSock} from "./items/sock.js";
import {drawStar} from './items/star.js'
import {drawTree} from './items/tree.js'
import {drawPresent} from './items/present.js'
import {drawCookie} from './items/cookie.js'
import {drawGlobe} from './items/globe.js'


var basePath = './items/'
var drawItemGenerators = []
drawItemGenerators[0] =  {name:'Star',draw: drawStar, filePath: `${basePath}star.js`}
drawItemGenerators[1] =  {name:'Ball',draw: drawBall, filePath: `${basePath}ball.js`}
drawItemGenerators[2] =  {name:'Sock',draw: drawSock, filePath: `${basePath}sock.js`}
drawItemGenerators[3] =  {name:'Cane',draw: drawCane, filePath: `${basePath}cane.js`}
drawItemGenerators[4] =  {name:'Bow',draw: drawBow, filePath: `${basePath}bow.js`}
drawItemGenerators[5] =  {name:'Bell',draw: drawBell, filePath: `${basePath}bell.js`}
drawItemGenerators[6] =  {name:'SnowBall',draw: drawSnowBall, filePath: `${basePath}snow-ball.js`}
drawItemGenerators[7] =  {name:'Candle',draw: drawCandle, filePath: `${basePath}candle.js`}
drawItemGenerators[8] =  {name:'Glove',draw: drawGlove, filePath: `${basePath}glove.js`}
drawItemGenerators[9] =  {name:'Candy',draw: drawCandy, filePath: `${basePath}candy.js`}
drawItemGenerators[10] =  {name:'Snowflake',draw: drawSnowflake, filePath: `${basePath}snowflake.js`}
drawItemGenerators[11] =  {name:'Sledge',draw: drawSledge, filePath: `${basePath}sledge.js`}
drawItemGenerators[12] =  {name:'Tree',draw: drawTree, filePath: `${basePath}tree.js`}
drawItemGenerators[13] =  {name:'Hat',draw: drawHat, filePath: `${basePath}hat.js`}
drawItemGenerators[14] =  {name:'Calendar',draw: drawCalendar, filePath: `${basePath}calendar.js`}
drawItemGenerators[15] =  {name:'Present',draw: drawPresent, filePath: `${basePath}present.js`}
drawItemGenerators[16] =  {name:'Cookie',draw: drawCookie, filePath: `${basePath}cookie.js`}
drawItemGenerators[17] =  {name:'Globe',draw: drawGlobe, filePath: `${basePath}globe.js`}
drawItemGenerators[18] =  {name:'Present',draw: drawPresent, filePath: `${basePath}present.js`}

export default drawItemGenerators;