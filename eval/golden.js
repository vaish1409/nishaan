// Golden set for Nishaan retrieval. Each item: a realistic parent question, an optional age chip, and the
// case id(s) that SHOULD be found. expected: [] marks a TRAP: nothing in the library fits, so retrieval should
// return nothing. ADD YOUR OWN questions (ask friends to write some without looking at the cases) because a
// test set written by the same person who wrote the retrieval can flatter it.
export const golden = [
  // positives (paraphrased, not copied from tags)
  { q: "my toddler lies on the floor screaming at the supermarket checkout when I refuse sweets", expected: ["c01"] },
  { q: "my 2 year old keeps pinching and pushing the newborn", expected: ["c02"] },
  { q: "my three year old fights me every morning about putting on clothes", expected: ["c03"] },
  { q: "my toddler throws the ipad and cries when his time is over", expected: ["c04"] },
  { q: "my little boy broke a vase and said the dog did it", expected: ["c05"] },
  { q: "she clings and cries when I leave her at the gate of her new school", expected: ["c06"] },
  { q: "my four year old says no to everything, even brushing her teeth", expected: ["c07"] },
  { q: "my 5 year old hit another child in his class when he got angry", expected: ["c08"] },
  { q: "my daughter will not do her homework unless I sit next to her", expected: ["c09"] },
  { q: "he said he is the stupid one after his cousin got better marks", expected: ["c10"] },
  { q: "caught my nine year old on his mobile under the blanket at midnight", expected: ["c11"] },
  { q: "my two kids keep arguing about who mummy loves more", expected: ["c12"] },
  { q: "my son hid his failed exam paper in his school bag for weeks", expected: ["c13"] },
  { q: "she is scared to sleep by herself since watching a horror film", expected: ["c14"] },
  { q: "my 11 year old slams the door and gives rude one word answers", expected: ["c15"] },
  { q: "my twelve year old wants to walk to her friend's house alone and I am worried", expected: ["c16"] },
  { q: "my child found out his classmates made a group chat without him", expected: ["c17"] },
  { q: "my aunt compared my son to his brother in front of everyone at the function", expected: ["c18"] },
  { q: "relatives keep asking my son whether he will take science or commerce", expected: ["c19"] },
  { q: "my teenager stays on his phone till 2am and his grades are dropping", expected: ["c20"] },
  { q: "my sixteen year old asked to go on an overnight trip with a friend's family", expected: ["c21"] },
  { q: "my 17 year old gets panic attacks before the board exams", expected: ["c22"] },
  { q: "I caught my teen lying about where he was using the location app", expected: ["c23"] },
  { q: "my teenager said I don't understand anything and went silent after our argument", expected: ["c24"] },
  // harder / different wording
  { q: "kid refuses to wear clothes in the morning and we are always late", expected: ["c03"] },
  { q: "he sneaks the phone into bed after lights out", expected: ["c11", "c20"] },
  { q: "she cries and screams in the shop when we say no to chocolate", expected: ["c01"] },
  { q: "my daughter is afraid of the dark after a scary show", expected: ["c14"] },
  { q: "he slams doors and is so disrespectful lately", expected: ["c15"] },
  { q: "my son lied about his location", expected: ["c23"] },
  // with an age chip selected
  { q: "he will not sit and do his homework alone", age: "6-9", expected: ["c09"] },
  { q: "she screams when the phone is taken away", age: "13-17", expected: ["c20"] },
  // traps: no case fits (retrieval should return nothing, even when an age chip is selected)
  { q: "how do I bake a chocolate cake", expected: [] },
  { q: "which cricket coaching is best in Bengaluru", expected: [] },
  { q: "what is the capital of France", expected: [] },
  { q: "my car engine is making a strange noise", expected: [] },
  { q: "how should I invest in mutual funds", expected: [] },
  { q: "help me fix a python error in my code", expected: [] },
  { q: "how to bake a cake", age: "6-9", expected: [] },
  { q: "what is the weather tomorrow", age: "13-17", expected: [] },
];
