import type { Artwork } from '../types';
type WordQuestion={word:string;zh:string;sentence:string;art:Artwork};
const dictionary:Record<string,WordQuestion>={
 bridge:{word:'bridge',zh:'n. 桥',sentence:'We sat on the bridge.',art:'village'},
 dam:{word:'dam',zh:'n. 大坝',sentence:'We saw a dam.',art:'pond'},
 'Grand Canyon':{word:'Grand Canyon',zh:'n. 大峡谷',sentence:'Our last stop is the Grand Canyon.',art:'meadow'},
 mountain:{word:'mountain',zh:'n. 山',sentence:'We can see a tall mountain.',art:'meadow'},
 'road trip':{word:'road trip',zh:'n. 自驾旅行',sentence:'We are on a road trip.',art:'ship'},
 yawn:{word:'yawn',zh:'v. 打哈欠',sentence:'I yawn when I am tired.',art:'fox'},
 boil:{word:'boil',zh:'v. 煮沸',sentence:'We boil the potatoes.',art:'village'},
 count:{word:'count',zh:'v. 数数',sentence:'Count from one to ten.',art:'bird'},
 eat:{word:'eat',zh:'v. 吃',sentence:'We eat together.',art:'fox'},
 mash:{word:'mash',zh:'v. 捣碎',sentence:'Mash the potatoes.',art:'village'},
 peel:{word:'peel',zh:'v. 剥皮',sentence:'Peel the orange.',art:'village'},
 potato:{word:'potato',zh:'n. 土豆',sentence:'This potato is big.',art:'village'},
 blocked:{word:'blocked',zh:'adj. 被阻挡的',sentence:'The road is blocked.',art:'ship'},
 long:{word:'long',zh:'adj. 长的',sentence:'The road is long.',art:'ship'},
 round:{word:'round',zh:'adj. 圆形的',sentence:'The ball is round.',art:'pond'},
 shape:{word:'shape',zh:'n. 形状',sentence:'What is this shape?',art:'village'},
 short:{word:'short',zh:'adj. 短的',sentence:'The path is short.',art:'forest'},
 square:{word:'square',zh:'n. 正方形',sentence:'This is a square.',art:'village'},
 bird:{word:'bird',zh:'n. 小鸟',sentence:'The bird can sing.',art:'bird'},
 branch:{word:'branch',zh:'n. 树枝',sentence:'The bird is on a branch.',art:'bird'},
 fly:{word:'fly',zh:'v. 飞',sentence:'Birds can fly.',art:'bird'},
 sky:{word:'sky',zh:'n. 天空',sentence:'Look at the blue sky.',art:'bird'},
 sing:{word:'sing',zh:'v. 唱歌',sentence:'We sing a song.',art:'bird'},
 tree:{word:'tree',zh:'n. 树',sentence:'The tree is green.',art:'forest'},
 home:{word:'home',zh:'n. 家',sentence:'We are going home.',art:'village'},
 shop:{word:'shop',zh:'n. 商店',sentence:'We visit the shop.',art:'village'},
 street:{word:'street',zh:'n. 街道',sentence:'Walk along the street.',art:'village'},
 town:{word:'town',zh:'n. 小镇',sentence:'Our town is small.',art:'village'},
 walk:{word:'walk',zh:'v. 行走',sentence:'We walk to school.',art:'forest'},
 day:{word:'day',zh:'n. 白天',sentence:'Have a happy day!',art:'meadow'},
 friend:{word:'friend',zh:'n. 朋友',sentence:'You are my friend.',art:'fox'},
 fox:{word:'fox',zh:'n. 狐狸',sentence:'The little fox is happy.',art:'fox'},
 forest:{word:'forest',zh:'n. 森林',sentence:'They are in the forest.',art:'forest'},
 play:{word:'play',zh:'v. 玩耍',sentence:'We play together.',art:'fox'},
 tomorrow:{word:'tomorrow',zh:'adv. 明天',sentence:'See you tomorrow!',art:'fox'},
 light:{word:'light',zh:'n. 光',sentence:'The light is bright.',art:'bird'},
 moon:{word:'moon',zh:'n. 月亮',sentence:'The moon is in the sky.',art:'bird'},
 night:{word:'night',zh:'n. 夜晚',sentence:'Good night!',art:'forest'},
 space:{word:'space',zh:'n. 太空',sentence:'We look at space.',art:'bird'},
 star:{word:'star',zh:'n. 星星',sentence:'The star is bright.',art:'bird'},
 sun:{word:'sun',zh:'n. 太阳',sentence:'The sun shines.',art:'meadow'}
};
const distractors=['n. 新娘','adj. 新娘的','v. 带来','n. 河流','v. 跳跃','n. 天空','adj. 漂亮的','n. 小猫'];
export function quizForWord(word:string,index:number){
 const item=dictionary[word]??{word,zh:'n. '+word,sentence:'I can say '+word+'.',art:'meadow' as Artwork};
 const pool=[...distractors.filter(t=>t!==item.zh)];
 const slot=index%4;
 const choices=pool.slice(0,3);
 choices.splice(slot,0,item.zh);
 return {...item,choices};
}
