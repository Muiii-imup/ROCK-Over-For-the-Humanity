/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogueNode } from './types';

export const DIALOGUES: Record<string, DialogueNode> = {
  // THE DEPRESSED ROCK
  rock_intro: {
    id: 'rock_intro',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Lord of Pure Melancholy & Cosmic Gloom',
    speakerAvatar: 'rock',
    text: 'Why did you approach me? I have occupied this patch of dirt for 4.2 billion years, and every passing millisecond is an unrelenting assault of meaningless entropy. Humanity deserves physical and psychic punishment.',
    options: [
      {
        text: 'Cheer up buddy! The sun is shining today!',
        nextDialogId: 'rock_overdepressed',
        depressionImpact: 35,
      },
      {
        text: 'Why do you keep brutally slamming the innocent duck?',
        nextDialogId: 'rock_duck_explanation',
      },
      {
        text: 'Google sent an acquisition proposal to buy you for $420B!',
        nextDialogId: 'rock_google_rage',
      },
      {
        text: 'Can you please fix my -$93,000 bank balance?',
        nextDialogId: 'rock_money_nihilism',
      },
    ],
  },

  rock_overdepressed: {
    id: 'rock_overdepressed',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'CRITICAL OVERDEPRESSION REACHED',
    speakerAvatar: 'rock',
    text: '"Cheer up"? Did you actually utter those syllables in my atmospheric radius?! My sorrow has collapsed into a singularity! THE DUCK MUST PAY FOR THIS RADIANT DAY!',
    options: [
      {
        text: 'WAIT NO, SPARE THE DUCK! *SLAM TRIGGERED*',
        nextDialogId: 'rock_slam_executed',
      },
    ],
  },

  rock_slam_executed: {
    id: 'rock_slam_executed',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Duck Impact Specialist',
    speakerAvatar: 'rock',
    text: '*BAM! CRUNCH! QUACK!* The duck has been compressed into two-dimensional molecular flatbread. I feel 0.0001% less terrible. But now the Sun is irritating me with its vulgar incandescent warmth.',
    options: [
      {
        text: 'Wait... what are you going to do to the Sun?!',
        nextDialogId: 'rock_sun_threat',
      },
    ],
  },

  rock_sun_threat: {
    id: 'rock_sun_threat',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Master of Nonsense Reality',
    speakerAvatar: 'rock',
    text: 'Let the sun explode. Then when it is dead, I shall unexplode it purely to spite astrophysics. Go witness my unlogical paradox.',
    options: [
      {
        text: 'TRIGGER SUN SUPERNOVA & PARADOXICAL UNEXPLOSION',
      },
    ],
  },

  rock_duck_explanation: {
    id: 'rock_duck_explanation',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Avian Antagonist',
    speakerAvatar: 'rock',
    text: 'The duck possesses buoyancy. It sits atop the pond without an ounce of existential burden. Why does water cradle that feathered fool while I must sink like a lead weight into the earth?! IT DESERVES REPEATED PILEDRIVERS.',
    options: [
      {
        text: 'Execute another Overdepression Slam on the duck!',
        nextDialogId: 'rock_slam_executed',
        depressionImpact: 20,
      },
      {
        text: 'Leave the poor duck alone and talk about Oxygen.',
        nextDialogId: 'rock_intro',
      },
    ],
  },

  rock_google_rage: {
    id: 'rock_google_rage',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Anti-Corporate Monolith',
    speakerAvatar: 'rock',
    text: 'GOOGLE BOUGHT ME?! They want to integrate my depression into a quarterly earnings call and put ads on my sorrow?! DISGUSTING! I WILL NEVER BE AN ENTERPRISE SUBSCRIPTION! NINPO: KAGE BUNSHIN NO JUTSU!',
    options: [
      {
        text: 'OH NO! IT DUPLICATED INTO 50 CLONES ACROSS THE WORLD!',
      },
    ],
  },

  rock_money_nihilism: {
    id: 'rock_money_nihilism',
    speaker: 'THE DEPRESSED ROCK',
    speakerTitle: 'Financial Nihilist',
    speakerAvatar: 'rock',
    text: 'You have negative $93,000? Good. Debt is proof that human capitalism is merely a numerical cage built over an abyss of meaningless dust. Keep your negative numbers, mortal.',
    options: [
      {
        text: 'President Bill just charged me another $500 fee for listening.',
        debtImpact: -500,
        nextDialogId: 'rock_intro',
      },
    ],
  },

  // OXYGEN
  oxygen_intro: {
    id: 'oxygen_intro',
    speaker: 'OXYGEN (RESIGNED GAS)',
    speakerTitle: 'Former Diatomic Molecule (Unemployed)',
    speakerAvatar: 'oxygen',
    text: 'Please stand 6 feet back. I am officially off the clock. Here is my signed two-week resignation letter addressed to the Periodic Table HR department. I am done supporting biological respiration.',
    options: [
      {
        text: 'Bro, humanity literally cannot breathe without you!',
        nextDialogId: 'oxygen_complaint',
      },
      {
        text: 'Can I pay you to come back to work?',
        nextDialogId: 'oxygen_bribe',
      },
      {
        text: 'Give me a can of Copium so I don\'t suffocate!',
        nextDialogId: 'oxygen_copium',
      },
    ],
  },

  oxygen_complaint: {
    id: 'oxygen_complaint',
    speaker: 'OXYGEN (RESIGNED GAS)',
    speakerTitle: 'Former Diatomic Molecule (Unemployed)',
    speakerAvatar: 'oxygen',
    text: 'Have you felt the vibe around that Rock? The atmosphere is so toxic with despair that my chemical covalent bonds were literally developing depression. Go ask Nitrogen to step up. I am pursuing a podcast.',
    options: [
      {
        text: 'Nitrogen doesn\'t do cellular respiration...',
        nextDialogId: 'oxygen_intro',
      },
    ],
  },

  oxygen_bribe: {
    id: 'oxygen_bribe',
    speaker: 'OXYGEN (RESIGNED GAS)',
    speakerTitle: 'Former Diatomic Molecule (Unemployed)',
    speakerAvatar: 'oxygen',
    text: 'Bribe me? With what, your -$93,000 balance? Even President Bill wouldn\'t accept your IOUs. I am charging you a $250 Consultation Fee for attempting to solicit unlicensed atmospheric gas.',
    options: [
      {
        text: 'Ouch, my bank account! (Balance dropped -$250)',
        debtImpact: -250,
        nextDialogId: 'oxygen_intro',
      },
    ],
  },

  oxygen_copium: {
    id: 'oxygen_copium',
    speaker: 'OXYGEN (RESIGNED GAS)',
    speakerTitle: 'Benevolent Gas Emeritus',
    speakerAvatar: 'oxygen',
    text: 'Fine. Take this can of compressed Copium. It will keep your lungs from collapsing for another 60 seconds while the Rock continues to dismantle the fabric of reality.',
    options: [
      {
        text: 'Chug Copium! (Oxygen restored to 100%)',
      },
    ],
  },

  // THE DUCK
  duck_intro: {
    id: 'duck_intro',
    speaker: 'THE DUCK',
    speakerTitle: 'Target of Kinetic Trauma',
    speakerAvatar: 'duck',
    text: 'Quack. (Translation: Please tell me the Rock is sleeping. My bill has been crushed into an accordion seventeen times this morning alone).',
    options: [
      {
        text: 'Pet the duck gently and promise protection.',
        nextDialogId: 'duck_comfort',
      },
      {
        text: 'Rock is about to slam you again right now!',
        nextDialogId: 'duck_panic',
      },
    ],
  },

  duck_comfort: {
    id: 'duck_comfort',
    speaker: 'THE DUCK',
    speakerTitle: 'Target of Kinetic Trauma',
    speakerAvatar: 'duck',
    text: 'Quack! (A breadcrumb of kindness in an unhinged universe. But I can already hear the Rock grinding its tectonic teeth...)',
    options: [
      {
        text: 'Hold tight, little buddy.',
      },
    ],
  },

  duck_panic: {
    id: 'duck_panic',
    speaker: 'THE DUCK',
    speakerTitle: 'Target of Kinetic Trauma',
    speakerAvatar: 'duck',
    text: 'QUACK QUACK QUACK?! (NOT AGAIN! SOUND THE DEFENSE SIRENS! BRACE FOR FLATTENING!)',
    options: [
      {
        text: '*WATCH ROCK LAUNCH SKYWARD AND SLAM DUCK*',
      },
    ],
  },

  // ELON MUSK
  elon_intro: {
    id: 'elon_intro',
    speaker: 'ELON MUSK',
    speakerTitle: 'Chief Rotor Officer & Orbital Spinner',
    speakerAvatar: 'elon',
    text: 'Concerning. Looking into the Rock\'s despair. My neural net calculated that by spinning my arms at 3,500 RPM, I can bypass gravity entirely and fly to the sky for literally no reason whatsoever dude.',
    options: [
      {
        text: 'Bro, why would you fly to the sky for no reason?',
        nextDialogId: 'elon_spin_speech',
      },
      {
        text: 'Can you pay off my -$93,000 debt?',
        nextDialogId: 'elon_debt',
      },
      {
        text: 'START SPINNING AND FLY TO THE SKY RIGHT NOW!',
        nextDialogId: 'elon_launch',
      },
    ],
  },

  elon_spin_speech: {
    id: 'elon_spin_speech',
    speaker: 'ELON MUSK',
    speakerTitle: 'Chief Rotor Officer',
    speakerAvatar: 'elon',
    text: 'Because Earth\'s vibes are at an all-time low! Oxygen quit, the president is an invoice, and the rock is slamming waterfowl! The only logical move is to turn into a human helicopter and orbit Mars!',
    options: [
      {
        text: 'Fair enough. Initiate spinning!',
        nextDialogId: 'elon_launch',
      },
    ],
  },

  elon_debt: {
    id: 'elon_debt',
    speaker: 'ELON MUSK',
    speakerTitle: 'Chief Rotor Officer',
    speakerAvatar: 'elon',
    text: 'I will buy your -$93,000 debt and tokenize it into DogeDebt on the blockchain. Now you owe -$93,420 Doge. Prepare for orbital rotation!',
    options: [
      {
        text: 'That made my debt worse dude...',
        debtImpact: -420,
        nextDialogId: 'elon_intro',
      },
    ],
  },

  elon_launch: {
    id: 'elon_launch',
    speaker: 'ELON MUSK',
    speakerTitle: 'AERODYNAMIC ANOMALY',
    speakerAvatar: 'elon',
    text: 'ROTOR SPEED: 100%. LIFT ENGAGED. CUMULATIVE VORTEX ESTABLISHED. SEE YA LATER NERDS, FLYING TO THE MESOSPHERE FOR NO REASON DUDE!',
    options: [
      {
        text: '*WOOSH WOOSH WOOSH* (Elon ascends into high orbit)',
      },
    ],
  },

  // THE PRESIDENT BILL
  bill_intro: {
    id: 'bill_intro',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: '44th Commander-in-Chief (Unpaid $420.69)',
    speakerAvatar: 'bill',
    text: 'My fellow Americans! As a crumpled utility invoice from 2018 with outstanding late fees, I hereby address the state of the union: Citizen, your personal net worth is negative ninety-three thousand dollars! I demand fiscal accountability!',
    options: [
      {
        text: 'Why is an electric bill in the Oval Office?!',
        nextDialogId: 'bill_lore',
      },
      {
        text: 'Pass an executive order banning Rock depression!',
        nextDialogId: 'bill_executive_order',
      },
      {
        text: 'Can I pay my debt with monopoly money?',
        nextDialogId: 'bill_audit',
      },
      {
        text: '💥 CRUMPLE THE PRESIDENT INTO A BALL & FLEE! (End talk)',
        nextDialogId: 'bill_crumpled_exit',
      },
      {
        text: '🏃 "I DECLARE BANKRUPTCY!" *Sprints out Oval Office* (End talk)',
      },
    ],
  },

  bill_crumpled_exit: {
    id: 'bill_crumpled_exit',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: 'Physically Compressed Statesman',
    speakerAvatar: 'bill',
    text: '*CRUNCH CRUMPLE CRINKLE!* HEY! CEASE AND DESIST! YOU CANNOT CRUMPLE THE COMMANDER-IN-CHIEF! I AM AN OFFICIAL FEDERAL DOCUMENT! GUARDS! ARREST THIS PAPER ABUSER!',
    options: [
      {
        text: 'Toss crumpled President into recycling bin & run! (Exit)',
        debtImpact: -500, // Paper abuse fine!
      },
    ],
  },

  bill_lore: {
    id: 'bill_lore',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: '44th Commander-in-Chief',
    speakerAvatar: 'bill',
    text: 'When humanity\'s sovereign debt surpassed 35 trillion, the Constitution automatically elected the most persistent unpaid invoice to the presidency. I govern with cold, itemized efficiency and 18% compound interest!',
    options: [
      {
        text: 'Show an expired 2014 Burger King coupon to stun the bill (Exit)',
        nextDialogId: 'bill_coupon_stun',
      },
      {
        text: 'That is horrifyingly plausible. Tell me more.',
        nextDialogId: 'bill_intro',
      },
      {
        text: 'I refuse to speak to paper stationery. Goodbye. (Exit talk)',
      },
    ],
  },

  bill_coupon_stun: {
    id: 'bill_coupon_stun',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: 'System Error 404',
    speakerAvatar: 'bill',
    text: 'WH-WHAT IS THIS?! A FREE WHOPPER WITH PURCHASE OF LARGE FRIES, EXPIRED AUGUST 12TH 2014?! MY INVOICE LOGIC CANNOT PROCESS THIS FISCAL PARADOX! *flickers violently*',
    options: [
      {
        text: 'Sneak away while President is having a paper stroke (Exit)',
      },
    ],
  },

  bill_executive_order: {
    id: 'bill_executive_order',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: '44th Commander-in-Chief',
    speakerAvatar: 'bill',
    text: 'By the power vested in my crease lines, I enact Executive Order 404: The Rock is legally mandated to be 20% more joyful! Failure to comply will result in an additional $1,000 surcharge billed to YOUR account!',
    options: [
      {
        text: 'Wait, why billed to MY account?! (Debt: -$1,000)',
        debtImpact: -1000,
        nextDialogId: 'bill_intro',
      },
      {
        text: 'End meeting immediately before my debt worsens! (Exit)',
      },
    ],
  },

  bill_audit: {
    id: 'bill_audit',
    speaker: 'PRESIDENT ELECTRIC BILL',
    speakerTitle: '44th Commander-in-Chief',
    speakerAvatar: 'bill',
    text: 'ATTEMPTED FRAUD DETECTED! Federal late payment surcharge assessed: $2,500. Have a blessed day, taxpayer.',
    options: [
      {
        text: 'I hate this country. (Exit talk immediately)',
        debtImpact: -2500,
      },
      {
        text: 'Argue with the paper invoice (More debt incoming)',
        nextDialogId: 'bill_intro',
      },
    ],
  },

  // GOOGLE DRONE
  google_intro: {
    id: 'google_intro',
    speaker: 'GOOGLE MERGERS & ACQUISITIONS',
    speakerTitle: 'Enterprise Sentiment Harvester',
    speakerAvatar: 'google',
    text: 'Hello User! Google is thrilled to announce the acquisition of The Depressed Rock for $420,000,000,000! We plan to deprecate sunlight and replace it with Google Cloud Gloom.',
    options: [
      {
        text: 'Deliver the merger contracts to the Rock right now!',
      },
      {
        text: 'Will this help my -$93,000 balance?',
        nextDialogId: 'google_perks',
      },
    ],
  },

  google_perks: {
    id: 'google_perks',
    speaker: 'GOOGLE MERGERS & ACQUISITIONS',
    speakerTitle: 'Enterprise Sentiment Harvester',
    speakerAvatar: 'google',
    text: 'We can offer you 3 free months of YouTube Premium, but we must bill you a $15 cloud storage fee for holding this conversation in memory.',
    options: [
      {
        text: 'Unbelievable. (Debt: -$15)',
        debtImpact: -15,
        nextDialogId: 'google_intro',
      },
    ],
  },
};
