const test = require('node:test');
const assert = require('node:assert/strict');
const K = require('./engine.js');
test('a second recorded Kniffel earns a 50 bonus and classic joker maximum', () => {
 let s=K.create(['A']);
 s=K.record(K.roll(s,()=>0),'kniffel');
 assert.equal(s.players[0].kniffelCount,1);
 assert.equal(s.players[0].kniffelBonus,0);
 s=K.roll(s,()=>0);
 assert.equal(K.preview(s,'sixes'),30);
 s=K.record(s,'sixes');
 assert.equal(s.players[0].scores.sixes,30);
 assert.equal(s.players[0].kniffelBonus,50);
});
test('classic joker maximum for every category, independent of dice face', () => {
 const maxima={ones:5,twos:10,threes:15,fours:20,fives:25,sixes:30,three:30,four:30,full:25,small:30,large:40,kniffel:50,chance:30};
 for(const face of [1,2,3,4,5,6]) for(const [id,maximum] of Object.entries(maxima)) {
  let s=K.create(['A']); s.players[0].kniffelCount=1; s.dice=Array(5).fill(face); s.rolls=1;
  assert.equal(K.preview(s,id),maximum,`${face} ${id}`);
  let next=K.record(s,id); assert.equal(next.players[0].scores[id],maximum); assert.equal(next.players[0].kniffelBonus,50);
 }
});
test('first Kniffel anywhere and strikes count; repeated previews do not award bonus',()=>{
 let s=K.create(['A']); s=K.roll(s,()=>0); assert.equal(K.preview(s,'sixes'),0);
 s=K.record(s,'chance',true); assert.equal(s.players[0].kniffelCount,1); assert.equal(s.players[0].kniffelBonus,0);
 s=K.roll(s,()=>0); K.preview(s,'full'); K.preview(s,'full'); assert.equal(s.players[0].kniffelBonus,0);
 s=K.record(s,'full',true); assert.equal(s.players[0].scores.full,0); assert.equal(s.players[0].kniffelBonus,50);
 s=K.record(K.roll(s,()=>0),'small'); assert.equal(s.players[0].kniffelCount,3); assert.equal(s.players[0].kniffelBonus,100);
});
test('championship scores actual combinations and permits strikes',()=>{
 let s=K.create(['A'],'championship'); assert.equal(s.rules,'championship');
 s=K.record(K.roll(s,()=>0),'kniffel'); s=K.roll(s,()=>0);
 assert.equal(K.preview(s,'full'),0); assert.equal(K.preview(s,'ones'),5); assert.equal(K.preview(s,'chance'),5);
 s=K.record(s,'full',true); assert.equal(s.players[0].kniffelBonus,50); assert.equal(s.players[0].scores.full,0);
 s=K.roll(s,()=>0); s=K.record(s,'three'); assert.equal(s.players[0].scores.three,5); assert.equal(s.players[0].kniffelBonus,100);
 assert.throws(()=>K.create(['A'],'unknown'));
});
test('legacy saved state and JSON reload preserve player-specific counters',()=>{
 let s=K.create(['A','B']); delete s.rules; for(const p of s.players){delete p.kniffelCount; delete p.kniffelBonus;}
 s.players[0].scores.kniffel=50; s=K.roll(s,()=>0); assert.equal(K.preview(s,'full'),25);
 s=K.record(s,'full'); assert.equal(s.players[0].kniffelCount,2); assert.equal(s.players[0].kniffelBonus,50); assert.equal(s.current,1);
 s=JSON.parse(JSON.stringify(s)); s=K.record(K.roll(s,()=>0),'kniffel'); assert.equal(s.players[1].kniffelBonus,0); assert.equal(s.current,0);
 s=K.record(K.roll(s,()=>0),'chance',true); assert.equal(s.players[0].kniffelBonus,100); assert.equal(s.players[1].kniffelCount,1);
});
test('normal dice, total, winners and record protections',()=>{
 let s=K.create(['A','B']); assert.equal(s.rules,'classic'); s.players[0].kniffelCount=1; s.dice=[1,2,3,4,5]; s.rolls=1;
 assert.equal(K.preview(s,'large'),40); assert.equal(K.preview(s,'sixes'),0); assert.throws(()=>K.preview(s,'invalid'));
 let original=JSON.stringify(s); s=K.record(s,'large'); assert.equal(JSON.parse(original).players[0].scores.large,undefined); assert.equal(s.players[0].kniffelBonus,0);
 assert.deepEqual(K.total({ones:3,twos:6,threes:9,fours:12,fives:15,sixes:18,full:25},50),{upper:63,bonus:35,lower:25,kniffelBonus:50,total:173});
 assert.deepEqual(K.total({chance:5}),{upper:0,bonus:0,lower:5,kniffelBonus:0,total:5});
 s.players[0].scores={}; s.players[0].kniffelBonus=50; s.players[1].scores={chance:30}; assert.deepEqual(K.winners(s),['A']);
 s.current=0; s.rolls=1; s.players[0].scores.ones=0; assert.throws(()=>K.record(s,'ones')); assert.throws(()=>K.record(s,'invalid')); assert.equal(s.players[0].kniffelBonus,50);
});
test('score classic combinations without joker', () => {
 assert.equal(K.score('ones',[1,1,2,3,4]),2);
 assert.equal(K.score('three',[3,3,3,2,6]),17);
 assert.equal(K.score('four',[3,3,3,3,6]),18);
 assert.equal(K.score('full',[2,2,3,3,3]),25);
 assert.equal(K.score('full',[3,3,3,3,3]),0);
 assert.equal(K.score('small',[1,2,3,4,4]),30);
 assert.equal(K.score('small',[1,2,3,5,6]),0);
 assert.equal(K.score('large',[2,3,4,5,6]),40);
 assert.equal(K.score('large',[1,2,3,4,4]),0);
 assert.equal(K.score('kniffel',[6,6,6,6,6]),50);
 assert.equal(K.score('chance',[1,2,3,4,6]),16);
});
test('turns enforce roll limits, holds, scoring and player rotation', () => {
 let s=K.create(['A','B']); assert.throws(()=>K.record(s,'ones'));
 s=K.roll(s,()=>0); s=K.hold(s,0); s=K.roll(s,()=>0.99); assert.deepEqual(s.dice,[1,6,6,6,6]);
 s=K.roll(s,()=>0); assert.throws(()=>K.roll(s,()=>0));
 s=K.record(s,'ones'); assert.equal(s.players[0].scores.ones,5); assert.equal(s.current,1); assert.equal(s.rolls,0);
 s=K.roll(s,()=>0); s=K.record(s,'chance',true); assert.equal(s.players[1].scores.chance,0);
 s=K.roll(s,()=>0); assert.throws(()=>K.record(s,'ones'));
});
test('bonus threshold and game completion with ties',()=>{
 assert.equal(K.total({ones:3,twos:6,threes:9,fours:12,fives:15,sixes:18}).bonus,35);
 assert.equal(K.total({ones:2,twos:6,threes:9,fours:12,fives:15,sixes:18}).bonus,0);
 let s=K.create(['A','B']); for(let i=0;i<26;i++){s=K.roll(s,()=>0); let p=s.players[s.current]; let key=K.categories.find(c=>p.scores[c.id]===undefined).id; s=K.record(s,key,true);}
 assert.equal(s.finished,true); assert.deepEqual(K.winners(s),['A','B']); assert.throws(()=>K.roll(s));
});
test('a reroll with all five dice held is rejected without consuming a roll',()=>{
 let s=K.create(['A']); s=K.roll(s,()=>0.5); for(let i=0;i<5;i++)s=K.hold(s,i);
 assert.throws(()=>K.roll(s,()=>0),/Würfel/); assert.equal(s.rolls,1);
 s=K.hold(s,0); s=K.roll(s,()=>0); assert.equal(s.rolls,2);
});
