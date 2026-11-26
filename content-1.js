/* Units 1-2. Format (see ADDING-LESSONS.md):
   w: [tagalog, english, say-it guide (CAPS = stress), example, example english, {l:literal, u:meaning/when, r:register, n:note}]
   s: [tagalog, english, [other accepted english], [other accepted tagalog word orders]]
   b: [sentence with ___, english, answer, [wrong choices], why]
   c: [situation, speaker, their line, english, [[reply, english, feedback], ...]]  FIRST reply is the correct one */
window.COURSE = window.COURSE || [];
COURSE.push({id:"u1", title:"First Words", tl:"Unang mga Salita", icon:"👋", lessons:[
{id:"u1l1", title:"Hello and goodbye", cat:"Greetings",
w:[
["kumusta","how are you / hello","ku-mus-TA","Kumusta ka?","How are you?",{u:"The everyday way to ask how someone is. It often works as a hello.",r:"Neutral. Add po for elders.",n:"From Spanish “cómo está”. Often spelled “kamusta” in casual writing."}],
["hello","hello","he-LO","Hello, Tita!","Hello, Auntie!",{u:"Filipinos use the English word all the time.",r:"Casual"}],
["paalam","goodbye","pa-A-lam","Paalam, Lola.","Goodbye, Grandma.",{u:"A real farewell, often for a long or serious parting. For everyday goodbyes people usually say “bye” or “sige”.",r:"Formal",n:"Say the two a’s separately: pa-A-lam."}],
["sige","okay / go ahead","SI-ge","Sige, bukas na lang.","Okay, tomorrow then.",{u:"Agreeing, or wrapping up a chat before leaving: “Sige, alis na ako.”",r:"Casual. “Sige po” is polite."}],
["ingat","take care","I-ngat","Ingat sa biyahe!","Take care on your trip!",{l:"care / caution",u:"A warm goodbye when someone is leaving.",r:"Affectionate. “Ingat po” for elders.",n:"The ng is one sound, as in “singer”. Don’t add a hard g."}],
["kita tayo","see you","KI-ta TA-yo","Kita tayo bukas.","See you tomorrow.",{l:"we see (each other)",u:"Arranging or expecting to meet again.",r:"Casual"}],
["bukas","tomorrow","BU-kas","Bukas na lang.","Tomorrow instead.",{n:"With the stress at the end (bu-KAS) it means “open”."}]
],
s:[["Kumusta ka?","How are you?",["How are you doing?"]],["Sige, ingat!","Okay, take care!",["Alright, take care"]],["Kita tayo bukas.","See you tomorrow.",["Let's see each other tomorrow","We'll see each other tomorrow"]],["Paalam na po.","Goodbye now.",["Goodbye"]],["Ingat sa biyahe.","Take care on your trip.",["Have a safe trip","Take care on the trip","Safe travels"]]],
b:[["___ ka?","How are you?","Kumusta",["Ingat","Paalam","Sige"],"Kumusta asks how someone is."],["Kita tayo ___.","See you tomorrow.","bukas",["ingat","hello","paalam"],"Bukas means tomorrow."]],
c:[["Your friend is leaving your house.","Friend","Sige, alis na ako.","Okay, I’m leaving now.",[["Sige, ingat!","Okay, take care!","This is the natural send-off."],["Kumusta ka?","How are you?","You ask this when greeting, not when someone is leaving."],["Walang anuman.","You’re welcome.","Nobody thanked you."]]]]},

{id:"u1l2", title:"Yes, no, please and thank you", cat:"Conversation",
w:[
["oo","yes","O-o","Oo, gusto ko.","Yes, I like it.",{u:"Everyday yes with friends, siblings and people your age.",r:"Casual. Don’t say it alone to elders.",n:"Two separate o sounds, with a tiny catch between them."}],
["opo","yes (respectful)","O-po","Opo, Nanay.","Yes, Mom.",{u:"Yes to parents, grandparents, older people, customers or strangers.",r:"Respectful"}],
["hindi","no / not","hin-DI","Hindi, salamat.","No, thank you.",{u:"Both “no” and “not”.",r:"Neutral. “Hindi po” is polite."}],
["salamat","thank you","sa-LA-mat","Salamat sa tulong.","Thanks for the help.",{u:"Any time you are grateful.",r:"Neutral. “Salamat po” for elders."}],
["walang anuman","you’re welcome","wa-LANG a-nu-MAN","Walang anuman, Tita.","You’re welcome, Auntie.",{l:"it is nothing at all",u:"The standard reply to thanks. Many people also just smile or say “welcome”.",r:"Neutral, slightly formal"}],
["pasensya na","sorry / bear with me","pa-SEN-sya na","Pasensya na, late ako.","Sorry, I’m late.",{l:"patience now",u:"Everyday apology for small inconveniences.",r:"Neutral. “Pasensya na po” is polite."}],
["paki-","please (before an action)","pa-KI","Pakiabot ng tubig.","Please pass the water.",{u:"Attach it to an action word to make a polite request. This is far more common than the separate word “pakiusap”, which sounds like pleading.",r:"Polite"}]
],
s:[["Salamat po.","Thank you.",["Thank you (respectful)","Thanks"]],["Hindi, salamat.","No, thank you.",["No thanks"]],["Opo, salamat po.","Yes, thank you.",["Yes thanks"]],["Pasensya na po.","I’m sorry.",["Sorry","Please bear with me","My apologies"]],["Pakiabot ng tubig.","Please pass the water.",["Please hand me the water","Pass the water please"]]],
b:[["Salamat! — Walang ___.","Thanks! You’re welcome.","anuman",["ingat","sige","opo"],"The set phrase is walang anuman."],["___, Lola.","Yes, Grandma. (respectful)","Opo",["Oo","Hindi","Sige na"],"Use opo, not oo, with a grandparent."]],
c:[["Your grandmother asks if you have eaten.","Lola","Kumain ka na ba?","Have you eaten?",[["Opo, Lola.","Yes, Grandma.","Opo shows respect."],["Oo.","Yep.","The meaning is right, but a bare oo sounds abrupt to a grandparent."],["Walang anuman po.","You’re welcome.","This answers thanks, not a question about eating."]]]],
g:{t:"Two kinds of yes",x:["Tagalog changes some words depending on who you’re talking to. Oo is the everyday yes. Opo is the respectful yes.","The little word po adds respect to almost any sentence. English has no exact equivalent. The closest feeling is adding “sir” or “ma’am”, but Filipinos use po with their own family too."],
e:[["Salamat.","Thanks.","Fine with a friend."],["Salamat po.","Thank you.","Add po for someone older."],["Hindi po.","No (polite).","po softens a no."]],
cmp:"English mostly changes tone of voice to be polite. Tagalog often changes the words.",
m:[["Oo po.","Opo.","Say opo as one word."]],
q:["Your uncle offers a ride and you accept. You say: “___, salamat po.”","Opo",["Oo","Hindi","Paki"],"Opo is the respectful yes."]}},

{id:"u1l3", title:"Greetings through the day", cat:"Greetings",
w:[
["magandang umaga","good morning","ma-gan-DANG u-MA-ga","Magandang umaga po!","Good morning!",{l:"beautiful morning",r:"Polite and neutral"}],
["magandang tanghali","good noon","ma-gan-DANG tang-HA-li","Magandang tanghali sa inyo.","Good noon to you all.",{l:"beautiful noon",u:"Around midday.",r:"Polite"}],
["magandang hapon","good afternoon","ma-gan-DANG HA-pon","Magandang hapon, Tito.","Good afternoon, Uncle.",{l:"beautiful afternoon",r:"Polite"}],
["magandang gabi","good evening","ma-gan-DANG ga-BI","Magandang gabi po.","Good evening.",{l:"beautiful night",u:"A greeting on arrival in the evening. To say good night at bedtime, people often just say “good night”.",r:"Polite"}],
["mabuti","good / fine","ma-BU-ti","Mabuti naman ako.","I’m doing fine.",{u:"The classic answer to “Kumusta?”",r:"Neutral"}],
["naman","(softener) too / on the other hand","na-MAN","Ikaw naman.","Your turn. / And you.",{u:"A small word that softens or shifts focus. “Mabuti naman” sounds warmer than “Mabuti”.",r:"Everyday"}],
["ikaw","you","i-KAW","Ikaw, kumusta?","And you, how are you?",{r:"Casual with one person your age or younger"}]
],
s:[["Magandang umaga po.","Good morning.",["Good morning (respectful)"]],["Mabuti naman ako.","I’m fine.",["I am fine","I'm good","I am doing fine","I'm doing well"]],["Mabuti naman, salamat.","I’m fine, thank you.",["Fine, thanks","I'm good, thanks","Good, thank you"]],["Ikaw, kumusta ka?","And you, how are you?",["How about you, how are you?","You, how are you?"]],["Magandang gabi, Lola.","Good evening, Grandma.",[]]],
b:[["Magandang ___ po. (7 a.m.)","Good morning.","umaga",["gabi","hapon","bukas"],"Umaga is morning."],["___ naman ako.","I’m fine.","Mabuti",["Ingat","Maganda","Salamat"],"Mabuti means good or fine."]],
c:[["You arrive at your partner’s family home at 7 p.m.","Tita","O, nandito ka na!","Oh, you’re here!",[["Magandang gabi po, Tita.","Good evening, Auntie.","A respectful evening greeting is perfect."],["Magandang umaga po.","Good morning.","It is evening, so use gabi."],["Paalam po.","Goodbye.","You have only just arrived."]]],
["A coworker greets you.","Coworker","Kumusta ka?","How are you?",[["Mabuti naman. Ikaw?","Fine. And you?","You answer and return the question."],["Oo, salamat.","Yes, thanks.","This isn’t a yes-or-no question."],["Sige, ingat.","Okay, take care.","That ends the chat."]]]]},

{id:"u1l4", title:"Introducing yourself", cat:"Questions",
w:[
["ako","I / me","a-KO","Ako si Maya.","I am Maya."],
["pangalan","name","pa-NGA-lan","Ano ang pangalan mo?","What is your name?",{n:"Practice nga as one syllable, starting with the ng in “sing”."}],
["ano","what","a-NO","Ano ito?","What is this?"],
["mo","your / you (after a word)","mo","Ang pangalan mo?","Your name?",{u:"Comes after the thing owned.",r:"Casual, one person"}],
["ko","my / I (after a word)","ko","Ang pangalan ko ay Sam.","My name is Sam.",{u:"Comes after the thing owned."}],
["si","(marker before a person’s name)","si","Si Ben ito.","This is Ben.",{u:"Put it before the name of one person."}],
["taga-saan","from where","ta-ga sa-AN","Taga-saan ka?","Where are you from?",{u:"A very common getting-to-know-you question.",r:"Neutral. “Taga-saan po kayo?” is polite."}],
["nice to meet you","nice to meet you","nays tu MIT yu","Nice to meet you po.","Nice to meet you.",{u:"Filipinos usually say this in English. The textbook “Ikinagagalak kitang makilala” is correct but very formal.",r:"Neutral Taglish"}]
],
s:[["Ako si Maya.","I am Maya.",["I'm Maya","My name is Maya"],["Si Maya ako."]],["Ano ang pangalan mo?","What is your name?",["What's your name?"]],["Ang pangalan ko ay Ben.","My name is Ben.",["My name's Ben"]],["Taga-saan ka?","Where are you from?",[]],["Taga-Canada ako.","I’m from Canada.",["I am from Canada"]]],
b:[["Ako ___ Ana.","I am Ana.","si",["ang","sa","ng"],"Si marks a person’s name."],["Ano ang pangalan ___?","What is your name?","mo",["ko","ako","si"],"Mo means your. Ko means my."]],
c:[["A new relative smiles at you.","Pinsan","Ano ang pangalan mo?","What’s your name?",[["Ako si Alex.","I’m Alex.","Ako si + your name is the most natural introduction."],["Mabuti naman.","I’m fine.","That answers “How are you?”"],["Ano ang pangalan ko?","What’s my name?","You asked them what YOUR name is."]]]],
g:{t:"Saying who you are",x:["Tagalog has no word for “am”, “is” or “are” in a sentence like “I am Maya”. You just say “I” and then who: Ako si Maya.","Use si before one person’s name. For things, you’ll use ang, which you’ll study more later."],
e:[["Ako si Leo.","I am Leo.","ako (I) + si + name."],["Si Leo ako.","I’m Leo.","Name first is also natural, often when answering who someone is."],["Ano ang pangalan niya?","What is his/her name?","niya means his or her. Tagalog doesn’t mark gender here."]],
cmp:"English needs “am”. Tagalog places the two ideas side by side.",
m:[["Ako ay si Leo ang.","Ako si Leo.","Don’t add extra words to stand in for “am”."],["Ako Leo.","Ako si Leo.","Don’t drop si before the name."]],
q:["Introduce Rosa: “___ Rosa ito.”","Si",["Ang","Sa","Ng"],"Si goes before a person’s name."]}}
]});

COURSE.push({id:"u2", title:"Everyday Vocabulary", tl:"Pang-araw-araw na Salita", icon:"🥭", lessons:[
{id:"u2l1", title:"Numbers 1 to 10", cat:"Numbers",
w:[
["isa","one","i-SA","Isa lang.","Just one."],["dalawa","two","da-la-WA","Dalawa ang anak ko.","I have two children."],["tatlo","three","tat-LO","Tatlong mangga.","Three mangoes."],["apat","four","A-pat","Apat kami.","There are four of us."],["lima","five","li-MA","Limang minuto.","Five minutes."],["anim","six","A-nim","Anim na itlog.","Six eggs."],["pito","seven","pi-TO","Pito ang upuan.","There are seven chairs."],["walo","eight","wa-LO","Walong baso.","Eight glasses."],["siyam","nine","si-YAM","Siyam na araw.","Nine days."],["sampu","ten","sam-PU","Sampung piso.","Ten pesos."]],
s:[["Isa lang po.","Just one.",["Only one","Just one please"]],["Dalawa ang anak ko.","I have two children.",["I have two kids","My children are two"]],["Apat kami.","There are four of us.",["We are four"]],["Limang minuto na lang.","Just five more minutes.",["Only five minutes left","Just five minutes"]],["Tatlong mangga po.","Three mangoes, please.",["Three mangoes"]]],
b:[["isa, dalawa, ___","one, two, three","tatlo",["apat","lima","anim"],"Tatlo is three."],["___ na itlog","six eggs","Anim",["Pito","Siyam","Apat"],"Anim is six."]],
c:[["A vendor asks how many you want.","Tindera","Ilan po?","How many?",[["Dalawa po.","Two, please.","A number plus po is polite and clear."],["Opo.","Yes.","They asked how many."],["Bukas po.","Tomorrow.","That is a time."]]]],
g:{t:"Linking numbers to things: -ng and na",x:["When a number describes a noun, Tagalog joins them with a linker.","If the number ends in a vowel, add -ng: lima → limang. If it ends in a consonant, add the separate word na: anim na.","This linker also joins other describing words to nouns, so you’ll see it everywhere."],
e:[["limang mangga","five mangoes","lima ends in a vowel."],["apat na mangga","four mangoes","apat ends in a consonant."],["isang baso","one glass","isa ends in a vowel."]],
cmp:"English just says “five mangoes”. Tagalog glues the words with a linker. The noun doesn’t need a plural ending.",
m:[["lima mangga","limang mangga","The linker is missing."],["anim itlog","anim na itlog","Use na after a consonant."]],
q:["Choose the correct form: “___ upuan” (three chairs)","tatlong",["tatlo","tatlo na","tatlon"],"Tatlo ends in a vowel, so add -ng."]}},

{id:"u2l2", title:"Days and months", cat:"Time",
w:[
["Lunes","Monday","LU-nes","Sa Lunes na lang.","Let’s do it Monday."],["Martes","Tuesday","mar-TES","May klase ako sa Martes.","I have class on Tuesday."],["Miyerkoles","Wednesday","MYER-ko-les","Miyerkoles ngayon.","Today is Wednesday."],["Huwebes","Thursday","hu-WE-bes","Alis kami sa Huwebes.","We leave on Thursday."],["Biyernes","Friday","BYER-nes","Biyernes na!","It’s Friday!"],["Sabado","Saturday","SA-ba-do","Libre ako sa Sabado.","I’m free on Saturday."],["Linggo","Sunday / week","ling-GO","Nagsisimba sila tuwing Linggo.","They go to church every Sunday."],["Enero","January","e-NE-ro","Enero ang kaarawan ko.","My birthday is in January."],["Mayo","May","MA-yo","Mainit sa Mayo.","It’s hot in May."],["Disyembre","December","dis-YEM-bre","Uuwi kami sa Disyembre.","We’re going home in December.",{n:"Other months: Pebrero, Marso, Abril, Hunyo, Hulyo, Agosto, Setyembre, Oktubre, Nobyembre."}],["ngayon","today / now","nga-YON","Anong araw ngayon?","What day is it today?"]],
s:[["Anong araw ngayon?","What day is it today?",["What day is today?"]],["Biyernes ngayon.","Today is Friday.",["It's Friday today"],["Ngayon ay Biyernes."]],["Libre ako sa Sabado.","I’m free on Saturday.",["I am free Saturday","I'm free on Saturday"]],["Uuwi kami sa Disyembre.","We’re going home in December.",["We will go home in December","We'll go home in December"],["Sa Disyembre uuwi kami."]],["Mainit sa Mayo.","It’s hot in May.",["It is hot in May"]]],
b:[["Lunes, ___, Miyerkoles","Monday, Tuesday, Wednesday","Martes",["Sabado","Huwebes","Linggo"],"Martes is Tuesday."],["Libre ako ___ Sabado.","I’m free on Saturday.","sa",["si","ang","ako"],"Sa works like “on” or “in” for days and months."]],
c:[["Your cousin is making plans.","Pinsan","Libre ka ba sa Linggo?","Are you free on Sunday?",[["Oo, libre ako.","Yes, I’m free.","You answered the question directly."],["Lunes ngayon.","Today is Monday.","They asked about your availability."],["Salamat, ingat.","Thanks, take care.","This ends the conversation without answering."]]]]},

{id:"u2l3", title:"Colours and describing words", cat:"Colours",
w:[
["pula","red","pu-LA","Pula ang damit niya.","Her dress is red."],["asul","blue","a-SUL","Asul ang langit.","The sky is blue."],["dilaw","yellow","di-LAW","Dilaw ang saging.","The banana is yellow."],["berde","green","BER-de","Berde ang dahon.","The leaf is green."],["puti","white","pu-TI","Puti ang plato.","The plate is white."],["itim","black","i-TIM","Itim ang aso.","The dog is black."],
["maganda","beautiful / nice","ma-gan-DA","Maganda ang bahay mo.","Your house is beautiful.",{cat:"Describing"}],["malaki","big","ma-la-KI","Malaki ang mangga.","The mango is big.",{cat:"Describing"}],["maliit","small","ma-li-IT","Maliit ang kuwarto.","The room is small.",{cat:"Describing"}],["bago","new","BA-go","Bago ang sapatos ko.","My shoes are new.",{cat:"Describing",n:"With stress at the end (ba-GO), it means “before”."}]],
s:[["Asul ang langit.","The sky is blue.",[]],["Maganda ang bahay mo.","Your house is beautiful.",["Your house is nice","Your home is beautiful","Your house is pretty"]],["Malaki ang aso.","The dog is big.",["The dog is large"]],["Bago ang sapatos ko.","My shoes are new.",["My shoe is new"]],["Maliit ang pulang bag.","The red bag is small.",[]]],
b:[["___ ang saging.","The banana is yellow.","Dilaw",["Asul","Itim","Pula"],"Dilaw is yellow."],["pula___ bag","red bag","ng",["na","ang","sa"],"Pula ends in a vowel, so the linker is -ng."]],
c:[["A friend shows you her new dress.","Kaibigan","Bago ang damit ko!","My dress is new!",[["Wow, ang ganda!","Wow, how pretty!","Ang + root is the natural way to exclaim."],["Ilan?","How many?","That doesn’t fit a compliment moment."],["Pasensya na.","Sorry.","There’s nothing to apologize for."]]]],
g:{t:"Describing word first",x:["To say what something is like, put the describing word first, then ang and the thing: Maganda ang bahay. Literally: “Beautiful the house.”","To say “How beautiful!”, use Ang + the root: Ang ganda! (from maganda)."],
e:[["Malaki ang bahay.","The house is big.","Description, then ang + thing."],["malaking bahay","big house","With a linker, it’s a phrase and not a full sentence."],["Ang laki!","So big!","Drop ma- to exclaim."]],
cmp:"English: “The house is big.” Tagalog: “Big the house.” There’s no separate word for “is”.",
m:[["Ang bahay malaki.","Malaki ang bahay.","Put the description first. (To keep the house first you need ay: Ang bahay ay malaki, which sounds formal.)"]],
q:["Say “The mango is sweet.” (matamis = sweet)","Matamis ang mangga.",["Ang mangga matamis.","Mangga ang ng matamis.","Matamis mangga."],"Description first, then ang + noun."]}},

{id:"u2l4", title:"Food and drinks", cat:"Food",
w:[
["kanin","cooked rice","KA-nin","Gusto ko ng kanin.","I’d like some rice.",{n:"Rice has several names: palay (in the field), bigas (uncooked), kanin (cooked)."}],["ulam","main dish eaten with rice","U-lam","Ano ang ulam?","What are we having with the rice?",{u:"Asked in almost every home before meals. English has no single word for it.",r:"Everyday"}],["tubig","water","TU-big","Pahingi ng tubig.","May I have some water?"],["manok","chicken","ma-NOK","Masarap ang manok.","The chicken is delicious."],["isda","fish","is-DA","Kumakain ako ng isda.","I eat fish."],["gulay","vegetables","GU-lay","Kain ka ng gulay.","Eat some vegetables."],["prutas","fruit","PRU-tas","Mahilig ako sa prutas.","I love fruit."],["kape","coffee","ka-PE","Gusto mo ba ng kape?","Would you like coffee?"],["itlog","egg","it-LOG","Itlog ang almusal ko.","My breakfast is egg."],["masarap","delicious","ma-sa-RAP","Ang sarap! Masarap talaga.","Yum! It’s really delicious.",{u:"Praise the cook with this. It will be appreciated.",r:"Everyday"}]],
s:[["Ano ang ulam?","What’s the main dish?",["What are we eating?","What's the ulam?","What's for the meal?","What is the dish?"]],["Masarap ang manok.","The chicken is delicious.",["The chicken is tasty","The chicken is good"]],["Gusto ko ng tubig.","I want water.",["I'd like water","I would like some water","I want some water"]],["Gusto mo ba ng kape?","Do you want coffee?",["Would you like coffee?","Would you like some coffee?","Do you want some coffee?"]],["Ang sarap ng ulam!","The dish is so delicious!",["This dish is so good","How delicious the dish is"]]],
b:[["Gusto ko ___ kape.","I’d like coffee.","ng",["si","ay","ako"],"After gusto ko, the thing wanted takes ng."],["___ ang adobo!","The adobo is delicious!","Masarap",["Tubig","Maliit","Gusto"],"Masarap means delicious."]],
c:[["Your tita watches you take a bite.","Tita","Masarap ba?","Is it good?",[["Opo, ang sarap po!","Yes, it’s so good!","Warm, respectful praise."],["Opo, ang laki po.","Yes, it’s so big.","She asked about the taste."],["Hindi ko po alam ang pangalan.","I don’t know the name.","That doesn’t answer her."]]]]},

{id:"u2l5", title:"Around the house", cat:"Household",
w:[
["bahay","house","BA-hay","Nasa bahay ako.","I’m at home."],["pinto","door","pin-TO","Pakisara ang pinto.","Please close the door."],["bintana","window","bin-TA-na","Bukas ang bintana.","The window is open."],["mesa","table","ME-sa","Nasa mesa ang susi.","The key is on the table."],["upuan","chair / seat","u-PU-an","May upuan pa ba?","Is there still a seat?"],["kama","bed","KA-ma","Nasa kama ang pusa.","The cat is on the bed."],["kusina","kitchen","ku-SI-na","Nasa kusina si Nanay.","Mom is in the kitchen."],["banyo","bathroom","BAN-yo","Nasaan ang banyo?","Where is the bathroom?",{u:"“CR” (comfort room) is also very common.",r:"Neutral"}],["susi","key","SU-si","Nasaan ang susi ko?","Where is my key?"],["plato","plate","PLA-to","Kumuha ka ng plato.","Get a plate."],["nasaan","where is","na-sa-AN","Nasaan ang cellphone ko?","Where is my phone?",{cat:"Questions"}]],
s:[["Nasaan ang banyo?","Where is the bathroom?",["Where's the bathroom?","Where is the toilet?","Where is the restroom?"]],["Nasa mesa ang susi.","The key is on the table.",["The keys are on the table"],["Ang susi ay nasa mesa."]],["Nasa kusina si Nanay.","Mom is in the kitchen.",["Mother is in the kitchen"]],["Pakisara ang pinto.","Please close the door.",["Close the door please"]],["Nasaan ang susi ko?","Where is my key?",["Where are my keys?"]]],
b:[["___ ang banyo?","Where is the bathroom?","Nasaan",["Ano","Sino","Ilan"],"Nasaan asks where something is."],["___ mesa ang susi.","The key is on the table.","Nasa",["Nasaan","Ang","Si"],"Nasa means in, on or at."]],
c:[["Your nanay is searching around.","Nanay","Nasaan ang susi?","Where’s the key?",[["Nasa mesa po.","It’s on the table.","Nasa + place says where it is."],["Susi po ito.","This is a key.","She wants to know where it is."],["Opo, nasaan.","Yes, where.","This doesn’t answer."]]]],
g:{t:"Nasaan and nasa",x:["Nasaan asks where a thing or person is. Nasa answers it: nasa + place.","Nasa covers “in”, “on” and “at”. Context tells you which."],
e:[["Nasaan si Kuya?","Where is Big Brother?","Use si before a person."],["Nasa banyo siya.","He’s in the bathroom.","nasa + place."],["Wala siya rito.","He isn’t here.","wala = not here / none."]],
cmp:"English changes the preposition (in, on, at). Tagalog usually keeps nasa.",
m:[["Nasa ang susi?","Nasaan ang susi?","Nasa answers the question. Nasaan asks it. Saan is mainly used with actions (Saan ka pupunta?), though you will also hear “Saan ang CR?”"]],
q:["“Where is the cat?”","Nasaan ang pusa?",["Nasa ang pusa?","Ano ang pusa?","Sino ang pusa?"],"Nasaan is the question word for location."]}}
]});
