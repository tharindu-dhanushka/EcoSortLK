// Starter learning dataset. Review, adapt, and expand it for your individual submission.
// Recycling acceptance and disposal rules vary among Sri Lankan collection services.
export const CATEGORIES = [
  { name: 'Plastic', icon: '♻️', description: 'Containers, packaging and plastic items' },
  { name: 'Paper', icon: '📄', description: 'Paper and cardboard products' },
  { name: 'Glass', icon: '🥛', description: 'Bottles and other glass products' },
  { name: 'Metal', icon: '🥫', description: 'Metal cans and household scrap' },
  { name: 'Organic', icon: '🌱', description: 'Food scraps and garden waste' },
  { name: 'E-Waste', icon: '🔌', description: 'Electrical and electronic equipment' },
  { name: 'Hazardous', icon: '⚠️', description: 'Materials requiring special handling' },
  { name: 'Textiles', icon: '👕', description: 'Clothing and fabric items' },
];

export const WASTE_ITEMS = [
  {id:1,name:'PET water bottle',category:'Plastic',disposal:'Empty and rinse the bottle. Check whether your local collector accepts PET (plastic type 1).',preparation:'Remove leftover liquid and keep it reasonably clean.',warning:'Do not burn plastic. A recycling symbol does not guarantee local acceptance.',reuse:'Reuse an undamaged bottle for a non-food craft project, such as a seed starter.'},
  {id:2,name:'Plastic shopping bag',category:'Plastic',disposal:'Reuse whenever possible. Ask the local collector if flexible-film plastic is accepted.',preparation:'Keep bags dry and free of food.',warning:'Do not place thin plastic films in collections that only take rigid plastics.',reuse:'Reuse as a bin liner or for carrying dry items.'},
  {id:3,name:'Yoghurt cup',category:'Plastic',disposal:'Rinse and check the plastic type and the collection service rules.',preparation:'Remove food residue.',warning:'Different plastic types are not always collected together.',reuse:'Use clean cups for small craft or plant projects.'},
  {id:4,name:'Newspaper',category:'Paper',disposal:'Keep clean and dry for paper recycling or reuse.',preparation:'Keep away from oily or wet waste.',warning:'Heavily contaminated paper may not be recyclable.',reuse:'Use for wrapping non-food items or crafts.'},
  {id:5,name:'Cardboard box',category:'Paper',disposal:'Flatten and keep dry; offer to a cardboard collector where accepted.',preparation:'Remove food residues and non-paper packaging.',warning:'Wet and greasy cardboard may be rejected.',reuse:'Use for home storage and organizing.'},
  {id:6,name:'Used tissue',category:'Paper',disposal:'Place in general waste if soiled. Follow local guidance.',preparation:'Bag securely if necessary.',warning:'Used tissues should not be mixed with clean paper recycling.',reuse:'No hygienic reuse recommended.'},
  {id:7,name:'Glass drink bottle',category:'Glass',disposal:'Keep intact, rinse, and check whether the collector accepts bottles.',preparation:'Remove the cap if required by the collector.',warning:'Broken glass can injure waste handlers.',reuse:'Use a clean jar or bottle for decorative storage.'},
  {id:8,name:'Broken drinking glass',category:'Glass',disposal:'Wrap securely and label as broken glass; ask your local service how to dispose of it.',preparation:'Use rigid wrapping or a safe container.',warning:'Drinking glasses are not always accepted with bottle glass.',reuse:'Do not reuse sharp broken glass.'},
  {id:9,name:'Aluminium beverage can',category:'Metal',disposal:'Empty, rinse and keep separate for metal collection where available.',preparation:'Drain liquids.',warning:'Take care with sharp edges.',reuse:'Clean cans can be used for suitable dry craft projects.'},
  {id:10,name:'Steel food tin',category:'Metal',disposal:'Rinse and send to metal recycling where accepted.',preparation:'Remove food residue and make sharp edges safe.',warning:'Avoid handling sharp cut lids with bare hands.',reuse:'Use a safely finished tin for tool or pencil storage.'},
  {id:11,name:'Vegetable peels',category:'Organic',disposal:'Add suitable fruit and vegetable scraps to a managed home compost system.',preparation:'Chop large pieces to help decomposition.',warning:'Keep compost covered and managed to prevent pests.',reuse:'Produce compost for suitable garden plants.'},
  {id:12,name:'Dry leaves',category:'Organic',disposal:'Compost or use as garden mulch where appropriate.',preparation:'Keep free from litter and chemicals.',warning:'Do not burn garden waste.',reuse:'Use dry leaves as the brown material in compost.'},
  {id:13,name:'Old mobile phone',category:'E-Waste',disposal:'Take to an authorised e-waste collection point or reputable take-back programme.',preparation:'Back up your data, sign out and factory-reset the device.',warning:'Do not dispose of electronics in open fires or general recycling.',reuse:'Donate a functioning, data-wiped phone if safe to do so.'},
  {id:14,name:'Broken charger',category:'E-Waste',disposal:'Take to an e-waste collection or repair service.',preparation:'Keep dry and separate from general household waste.',warning:'Do not continue using damaged electrical cables.',reuse:'Repair only through a suitably qualified person.'},
  {id:15,name:'Household battery',category:'Hazardous',disposal:'Use a battery collection programme or approved waste service.',preparation:'Store batteries separately; for relevant battery types, protect exposed terminals.',warning:'Never puncture, crush, heat, or burn batteries.',reuse:'Choose rechargeable batteries when appropriate.'},
  {id:16,name:'Leftover paint',category:'Hazardous',disposal:'Ask the local authority or a qualified waste service about hazardous-waste disposal.',preparation:'Keep in the labelled original container with the lid closed.',warning:'Do not pour paint into drains or onto soil.',reuse:'Use usable leftover paint on an appropriate future project.'},
  {id:17,name:'Old cotton T-shirt',category:'Textiles',disposal:'Donate if clean and wearable; otherwise check local textile collection.',preparation:'Wash and dry items intended for donation.',warning:'Do not donate wet or heavily contaminated clothing.',reuse:'Turn fabric into cleaning cloths.'},
  {id:18,name:'Torn bedsheet',category:'Textiles',disposal:'Repair, repurpose or use a textile collection service where available.',preparation:'Wash and dry first.',warning:'Textile collection rules vary.',reuse:'Cut into reusable fabric bags or cleaning rags.'},
  {id:19,name:'Eggshells',category:'Organic',disposal:'Crush and add to an appropriate compost setup.',preparation:'Rinse if necessary to reduce odour.',warning:'Manage compost to avoid attracting pests.',reuse:'Use crushed shells in compost material.'},
  {id:20,name:'Plastic food container',category:'Plastic',disposal:'Wash and check the resin type and collector policy before recycling.',preparation:'Remove oil and leftover food.',warning:'Not all food-grade plastics are accepted for recycling.',reuse:'Reuse a sound container for dry non-food storage.'},
];

export const QUIZ_QUESTIONS = [
  {question:'What should you usually do before placing an accepted plastic bottle in recycling?',options:['Fill it with food scraps','Empty and rinse it','Burn it','Break it'],answer:1},
  {question:'Which material is suitable for a managed home compost system?',options:['Vegetable peels','Batteries','Broken glass','Phone chargers'],answer:0},
  {question:'Where should an old mobile phone go?',options:['Open fire','An authorised e-waste collection point','The nearest drain','Clean paper recycling'],answer:1},
  {question:'What should you do with broken drinking glass?',options:['Leave it loose','Wrap securely and follow local disposal advice','Mix with food waste','Put in a school bag'],answer:1},
  {question:'Does a recycling symbol mean every local collector accepts an item?',options:['Always','No, acceptance varies','Only on weekends','Only if it is colourful'],answer:1},
];
