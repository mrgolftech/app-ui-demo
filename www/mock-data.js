/* Entirely fictional, offline data. No third-party course media. */
window.DEMO_DATA = Object.freeze({
  raz: {
    title: '小兔子的森林冒险', level: 'C', collection: '森林朋友',
    pages: [
      {en:'The little rabbit wakes up.',zh:'小兔子醒来了。',art:'meadow'},
      {en:'The sun shines in the forest.',zh:'阳光照进森林。',art:'forest'},
      {en:'The little rabbit is running.',zh:'小兔子正在奔跑。',art:'meadow'},
      {en:'She can jump over the log.',zh:'她可以跳过木头。',art:'forest'},
      {en:'What a beautiful sunny day!',zh:'多么美丽的晴天！',art:'meadow'},
      {en:'A blue bird sings in a tree.',zh:'一只蓝色的小鸟在树上唱歌。',art:'bird'},
      {en:'She meets her friend near the pond.',zh:'她在池塘边遇见了朋友。',art:'pond'},
      {en:'The duck swims across the water.',zh:'鸭子游过水面。',art:'pond'},
      {en:'They play together in the forest.',zh:'他们在森林里一起玩耍。',art:'forest'},
      {en:'The little rabbit finds a flower.',zh:'小兔子发现了一朵花。',art:'meadow'},
      {en:'It is time to go home.',zh:'该回家了。',art:'forest'},
      {en:'Good night, my forest friends!',zh:'晚安，我的森林朋友们！',art:'bird'}
    ]
  },
  phonics: {
    title:'sh 拼读练习', unit:'Unit 3',
    words:[
      {word:'ship',sound:'sh',rest:'ip',zh:'轮船',letters:['s','h','i','p'],art:'ship'},
      {word:'fish',sound:'sh',rest:'fi',zh:'鱼',letters:['f','i','s','h'],art:'pond'},
      {word:'shop',sound:'sh',rest:'op',zh:'商店',letters:['s','h','o','p'],art:'village'},
      {word:'shell',sound:'sh',rest:'ell',zh:'贝壳',letters:['s','h','e','l','l'],art:'ship'}
    ]
  },
  dub: {
    title:'小狐狸的森林一天',
    lines:[
      {en:'Hello, little Fox!',zh:'你好，小狐狸！',art:'fox'},
      {en:'Let’s go to the green forest.',zh:'一起去绿色的森林吧。',art:'forest'},
      {en:'What a beautiful day!',zh:'今天真是美好的一天！',art:'meadow'},
      {en:'We can sing together.',zh:'我们可以一起唱歌。',art:'bird'},
      {en:'Look at the little pond!',zh:'看那个小池塘！',art:'pond'},
      {en:'See you tomorrow!',zh:'明天见！',art:'fox'}
    ]
  },
  quizzes:[
    {q:'What is it?',a:'Rabbit',choices:['Rabbit','Tiger','Duck','Fish'],art:'meadow'},
    {q:'Which word starts with sh?',a:'Ship',choices:['Cat','Ship','Dog','Sun'],art:'ship'},
    {q:'Who is singing in the tree?',a:'Bird',choices:['Bear','Frog','Bird','Fox'],art:'bird'},
    {q:'Where does the duck swim?',a:'Pond',choices:['Sky','Pond','Road','Tree'],art:'pond'}
  ]
});
