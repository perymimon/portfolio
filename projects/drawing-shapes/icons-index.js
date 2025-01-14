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
import {drawBells} from './items/bells.js'
import {drawSnowMan} from './items/snow-man.js'
import {drawCrown} from './items/crown.js'
import {drawSkate} from './items/skate.js'
import {drawDear} from './items/dear.js'


var basePath = './items/'
var iconsGenerators = []
iconsGenerators[0] =  {name:'Star',draw: drawStar, filePath: `${basePath}star.js`}
iconsGenerators[1] =  {name:'Ball',draw: drawBall, filePath: `${basePath}ball.js`}
iconsGenerators[2] =  {name:'Sock',draw: drawSock, filePath: `${basePath}sock.js`}
iconsGenerators[3] =  {name:'Cane',draw: drawCane, filePath: `${basePath}cane.js`}
iconsGenerators[4] =  {name:'Bow',draw: drawBow, filePath: `${basePath}bow.js`}
iconsGenerators[5] =  {name:'Bell',draw: drawBell, filePath: `${basePath}bell.js`}
iconsGenerators[6] =  {name:'SnowBall',draw: drawSnowBall, filePath: `${basePath}snow-ball.js`}
iconsGenerators[7] =  {name:'Candle',draw: drawCandle, filePath: `${basePath}candle.js`}
iconsGenerators[8] =  {name:'Glove',draw: drawGlove, filePath: `${basePath}glove.js`}
iconsGenerators[9] =  {name:'Candy',draw: drawCandy, filePath: `${basePath}candy.js`}
iconsGenerators[10] =  {name:'Snowflake',draw: drawSnowflake, filePath: `${basePath}snowflake.js`}
iconsGenerators[11] =  {name:'Sledge',draw: drawSledge, filePath: `${basePath}sledge.js`}
iconsGenerators[12] =  {name:'Tree',draw: drawTree, filePath: `${basePath}tree.js`}
iconsGenerators[13] =  {name:'Hat',draw: drawHat, filePath: `${basePath}hat.js`}
iconsGenerators[14] =  {name:'Calendar',draw: drawCalendar, filePath: `${basePath}calendar.js`}
iconsGenerators[15] =  {name:'Present',draw: drawPresent, filePath: `${basePath}present.js`}
iconsGenerators[16] =  {name:'Cookie',draw: drawCookie, filePath: `${basePath}cookie.js`}
iconsGenerators[17] =  {name:'Globe',draw: drawGlobe, filePath: `${basePath}globe.js`}
iconsGenerators[18] =  {name:'Bells',draw: drawBells, filePath: `${basePath}bells.js`}
iconsGenerators[19] =  {name:'SnowMan',draw: drawSnowMan, filePath: `${basePath}snow-man.js`}
iconsGenerators[20] =  {name:'Crown',draw: drawCrown, filePath: `${basePath}crown.js`}
iconsGenerators[21] =  {name:'Skate',draw: drawSkate, filePath: `${basePath}skate.js`}
iconsGenerators[22] =  {name:'Dear',draw: drawDear, filePath: `${basePath}dear.js`}
// drawItemGenerators[22] =  {name:'Present',draw: drawPresent, filePath: `${basePath}present.js`}

export default iconsGenerators;