// ============ CATCH THE CLUE — GAME DATA ============
// 90 questions across 6 bands, dry-run tested against document sample answers before wiring to UI.

const GRADES = [
  { grade: 1, bandIdx: 0 },
  { grade: 2, bandIdx: 0 },
  { grade: 3, bandIdx: 1 },
  { grade: 4, bandIdx: 1 },
  { grade: 5, bandIdx: 2 },
  { grade: 6, bandIdx: 2 },
  { grade: 7, bandIdx: 3 },
  { grade: 8, bandIdx: 3 },
  { grade: 9, bandIdx: 4 },
  { grade: 10, bandIdx: 4 },
  { grade: 11, bandIdx: 5 },
  { grade: 12, bandIdx: 5 }
];

const BANDS = [
  {
    "id": 1,
    "grades": "Grade 1 & 2",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A school playground. Four children describe what they saw at lunch.",
        "witnesses": [
          "Witness A: \"I saw a cat sitting on the slide and eating a sandwich.\"",
          "Witness B: \"I saw a dog chasing a ball near the swings.\"",
          "Witness C: \"I saw a cat sitting on the slide eating a sandwich AND drinking juice at the same time.\"",
          "Witness D: \"I heard a bird singing near the big tree.\""
        ],
        "questions": [
          {
            "q": "Which witness says the cat was doing TWO things at the same time?",
            "keywords": [
              [
                "c"
              ],
              [
                "witness c"
              ]
            ]
          },
          {
            "q": "Can a cat eat a sandwich? What does this tell you about Witness A?",
            "keywords": [
              [
                "no"
              ],
              [
                "unlikely"
              ],
              [
                "mistak"
              ],
              [
                "imagin"
              ]
            ]
          },
          {
            "q": "Which two witnesses could BOTH be telling the truth?",
            "keywords": [
              [
                "b",
                "d"
              ]
            ]
          },
          {
            "q": "Which witness gives the most impossible statement?",
            "keywords": [
              [
                "c"
              ],
              [
                "witness c"
              ]
            ]
          },
          {
            "q": "If you had to pick one most reliable witness, who would it be and why?",
            "keywords": [
              [
                "d"
              ]
            ]
          }
        ],
        "img": "assets/images/b1_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "The investigation leads to a collection of objects found at the scene.",
        "questions": [
          {
            "q": "You find: a pencil, a reading book, a football, a shelf, and a library card. Which object does NOT belong in a reading place?",
            "keywords": [
              [
                "football"
              ]
            ]
          },
          {
            "q": "Put these in order of what you do first at a library: Return book \u2192 Read book \u2192 Borrow book \u2192 Choose book",
            "keywords": [
              [
                "choose",
                "borrow",
                "read",
                "return"
              ]
            ]
          },
          {
            "q": "Which two objects are connected? A bookmark and a novel.",
            "keywords": [
              [
                "read"
              ]
            ]
          },
          {
            "q": "One piece of evidence is a torn page with the word __EDGE written on it. What word could this be?",
            "keywords": [
              [
                "knowledge"
              ],
              [
                "ledge"
              ]
            ]
          },
          {
            "q": "You find a note that says: 'You need this to borrow things from a special place.' What is it?",
            "keywords": [
              [
                "library card"
              ],
              [
                "card"
              ]
            ]
          }
        ],
        "img": "assets/images/b1_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: Hospital, Library, Beach, Zoo, Supermarket, School.",
        "destinations": [
          "Hospital",
          "Library",
          "Beach",
          "Zoo",
          "Supermarket",
          "School"
        ],
        "questions": [
          {
            "q": "Clue: 'It is a quiet place.' Eliminate the loudest destinations.",
            "keywords": [
              [
                "beach",
                "zoo"
              ]
            ],
            "eliminate": [
              "Beach",
              "Zoo"
            ]
          },
          {
            "q": "Clue: 'You do not buy things here.' Eliminate places where you spend money.",
            "keywords": [
              [
                "supermarket"
              ]
            ],
            "eliminate": [
              "Supermarket"
            ]
          },
          {
            "q": "Clue: 'You borrow things here instead of keeping them.' Which places are left?",
            "keywords": [
              [
                "library",
                "hospital",
                "school"
              ]
            ]
          },
          {
            "q": "Clue: 'It is full of books.' Which destination fits?",
            "keywords": [
              [
                "library"
              ]
            ],
            "eliminate": [
              "Hospital",
              "School"
            ]
          },
          {
            "q": "Final question: Where have all the clues been leading you?",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b1_i3.jpg"
      }
    ]
  },
  {
    "id": 2,
    "grades": "Grade 3 & 4",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A school corridor. Three students describe what they saw after the bell rang.",
        "witnesses": [
          "Witness A: \"I saw a teacher carry a pile of books into the room at exactly 2:00 PM.\"",
          "Witness B: \"I saw the same teacher walk OUT of the room carrying the same books at 2:00 PM.\"",
          "Witness C: \"I heard the books fall from the third floor at 2:05 PM.\"",
          "Witness D: \"I saw the teacher in the staffroom at 2:10 PM reading a newspaper.\""
        ],
        "questions": [
          {
            "q": "What is the direct contradiction between Witness A and Witness B?",
            "keywords": [
              [
                "in",
                "out"
              ]
            ]
          },
          {
            "q": "Is it possible for both A and B to be correct? Explain.",
            "keywords": [
              [
                "no"
              ],
              [
                "cannot"
              ],
              [
                "can't"
              ],
              [
                "impossible"
              ]
            ]
          },
          {
            "q": "Does Witness C's statement support Witness A or B? Why?",
            "keywords": [
              [
                "neither"
              ],
              [
                "either"
              ]
            ]
          },
          {
            "q": "Which witness statement is most independent and least likely to be wrong?",
            "keywords": [
              [
                "d"
              ],
              [
                "witness d"
              ]
            ]
          },
          {
            "q": "Based on all statements, what is the most likely sequence of events?",
            "keywords": [
              [
                "a",
                "c",
                "d"
              ],
              [
                "b",
                "wrong"
              ],
              [
                "b",
                "incorrect"
              ]
            ]
          }
        ],
        "img": "assets/images/b2_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "Evidence from the corridor has been collected.",
        "questions": [
          {
            "q": "A torn note reads: 'Meet me where the ___OWLEDGE grows.' Complete the word.",
            "keywords": [
              [
                "knowledge"
              ]
            ]
          },
          {
            "q": "Arrange these events in logical order: Books fall \u2192 Bell rings \u2192 Teacher carries books \u2192 Students leave",
            "keywords": [
              [
                "bell",
                "students",
                "teacher",
                "books fall"
              ]
            ]
          },
          {
            "q": "Which piece of evidence is IRRELEVANT to a library investigation: a library card, a torn page, a football whistle, a bookmark?",
            "keywords": [
              [
                "whistle"
              ]
            ]
          },
          {
            "q": "A timeline shows: 1:55 \u2014 corridor empty. 2:00 \u2014 teacher seen. 2:05 \u2014 loud noise. 2:10 \u2014 staffroom. What likely happened between 2:00 and 2:05?",
            "keywords": [
              [
                "moved"
              ],
              [
                "dropped"
              ],
              [
                "fell"
              ]
            ]
          },
          {
            "q": "You find two pieces of evidence: a library receipt dated today, and a muddy shoe print near the bookshelf. What can you infer?",
            "keywords": [
              [
                "library"
              ],
              [
                "outside"
              ],
              [
                "visit"
              ]
            ]
          }
        ],
        "img": "assets/images/b2_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: Hospital, Library, Museum, Beach, Supermarket, School.",
        "destinations": [
          "Hospital",
          "Library",
          "Museum",
          "Beach",
          "Supermarket",
          "School"
        ],
        "questions": [
          {
            "q": "Clue: 'You visit here to gain knowledge, not to be treated.' Eliminate places.",
            "keywords": [
              [
                "hospital"
              ]
            ],
            "eliminate": [
              "Hospital"
            ]
          },
          {
            "q": "Clue: 'You don't pay to take things home.' Eliminate places.",
            "keywords": [
              [
                "supermarket",
                "beach"
              ]
            ],
            "eliminate": [
              "Supermarket",
              "Beach"
            ]
          },
          {
            "q": "Clue: 'It is quiet and indoors.' Which destinations remain?",
            "keywords": [
              [
                "library",
                "museum",
                "school"
              ]
            ]
          },
          {
            "q": "Clue: 'You can borrow items and bring them back.' Which place fits this perfectly?",
            "keywords": [
              [
                "library"
              ]
            ],
            "eliminate": [
              "Museum",
              "School"
            ]
          },
          {
            "q": "Final question: Name the destination all clues point to.",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b2_i3.jpg"
      }
    ]
  },
  {
    "id": 3,
    "grades": "Grade 5 & 6",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A school library. Four students and one librarian give statements about a missing book.",
        "witnesses": [
          "Witness A (Student): \"The book was on the top shelf when I left at 3:15 PM.\"",
          "Witness B (Student): \"I saw the book being carried out by someone in a red jacket at 3:10 PM.\"",
          "Witness C (Student): \"There was nobody in the library between 3:00 and 3:20 PM.\"",
          "Witness D (Librarian): \"I was at the desk the entire afternoon and saw no one leave with a book.\"",
          "Witness E (Student): \"I borrowed the book at 3:05 PM. I have the receipt.\""
        ],
        "questions": [
          {
            "q": "Identify ONE direct contradiction between any two witnesses.",
            "keywords": [
              [
                "c"
              ],
              [
                "nobody"
              ]
            ]
          },
          {
            "q": "Which witness provides the STRONGEST evidence? Why?",
            "keywords": [
              [
                "e"
              ],
              [
                "receipt"
              ]
            ]
          },
          {
            "q": "Can Witness B and Witness D both be correct? Explain.",
            "keywords": [
              [
                "no"
              ],
              [
                "cannot"
              ],
              [
                "can't"
              ]
            ]
          },
          {
            "q": "Which witness is LEAST reliable and why?",
            "keywords": [
              [
                "c"
              ],
              [
                "witness c"
              ]
            ]
          },
          {
            "q": "Based on all statements, construct the most likely sequence of events.",
            "keywords": [
              [
                "e"
              ],
              [
                "b"
              ],
              [
                "a"
              ]
            ]
          }
        ],
        "img": "assets/images/b3_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "Evidence has been gathered from the library scene.",
        "questions": [
          {
            "q": "You find three receipts: one dated yesterday, one from last week, one undated. Which is most useful to the investigation and why?",
            "keywords": [
              [
                "yesterday"
              ],
              [
                "recent"
              ]
            ]
          },
          {
            "q": "A sticky note reads: 'Check the place where IMAGINATION has no limits.' What kind of place is being described?",
            "keywords": [
              [
                "library"
              ],
              [
                "reading"
              ],
              [
                "creative"
              ]
            ]
          },
          {
            "q": "Two pieces of evidence point in opposite directions. How do you decide which to trust?",
            "keywords": [
              [
                "support"
              ],
              [
                "proof"
              ],
              [
                "consisten"
              ]
            ]
          },
          {
            "q": "Timeline: Book last seen (3:05) \u2192 Borrowed (3:05) \u2192 Reported missing (3:30). Is the book actually missing?",
            "keywords": [
              [
                "no"
              ],
              [
                "not"
              ],
              [
                "borrowed"
              ]
            ]
          },
          {
            "q": "A letter is found with every other word removed: 'The ___ is hidden ___ the place ___ knowledge ___.' Fill in plausible words.",
            "keywords": [
              [
                "book"
              ],
              [
                "library"
              ],
              [
                "knowledge"
              ]
            ]
          }
        ],
        "img": "assets/images/b3_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: Hospital, Library, Museum, Laboratory, Airport, School.",
        "destinations": [
          "Hospital",
          "Library",
          "Museum",
          "Laboratory",
          "Airport",
          "School"
        ],
        "questions": [
          {
            "q": "Clue: 'Knowledge is the only currency here.' Eliminate places of physical treatment or travel.",
            "keywords": [
              [
                "hospital",
                "airport"
              ]
            ],
            "eliminate": [
              "Hospital",
              "Airport"
            ]
          },
          {
            "q": "Clue: 'You do not own what you take \u2014 you return it.' Narrow the list.",
            "keywords": [
              [
                "library"
              ],
              [
                "museum"
              ]
            ]
          },
          {
            "q": "Clue: 'Curious minds are always welcome here, regardless of age.' What does this suggest?",
            "keywords": [
              [
                "public"
              ],
              [
                "accessible"
              ],
              [
                "library"
              ]
            ]
          },
          {
            "q": "Clue: 'Every story ever told lives within these walls.' What place fits perfectly?",
            "keywords": [
              [
                "library"
              ]
            ],
            "eliminate": [
              "Museum",
              "Laboratory",
              "School"
            ]
          },
          {
            "q": "Final question: Name the destination. Justify using ALL three clues.",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b3_i3.jpg"
      }
    ]
  },
  {
    "id": 4,
    "grades": "Grade 7 & 8",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A community centre. Five people give statements about a missing invitation envelope.",
        "witnesses": [
          "Witness A: \"I placed the envelope on the front desk at 9:00 AM before anyone arrived.\"",
          "Witness B: \"I arrived at 9:05 AM. The desk was empty. No envelope.\"",
          "Witness C: \"I was cleaning the lobby from 8:45 to 9:15 AM and saw nothing unusual.\"",
          "Witness D: \"I used the front desk at 9:02 AM and saw no envelope.\"",
          "Witness E: \"I saw an envelope on the desk at 9:01 AM when I passed the window outside.\""
        ],
        "questions": [
          {
            "q": "What is the precise time window during which the envelope disappeared?",
            "keywords": [
              [
                "9:01",
                "9:02"
              ],
              [
                "901",
                "902"
              ]
            ]
          },
          {
            "q": "Does Witness C's statement help or hurt the investigation? Why?",
            "keywords": [
              [
                "hurt"
              ]
            ]
          },
          {
            "q": "Which two witnesses' statements create the most significant tension?",
            "keywords": [
              [
                "d",
                "e"
              ]
            ]
          },
          {
            "q": "What makes Witness A's statement impossible to verify independently?",
            "keywords": [
              [
                "no one else"
              ],
              [
                "alone"
              ],
              [
                "only"
              ]
            ]
          },
          {
            "q": "Identify the most suspicious witness and construct a theory explaining why.",
            "keywords": [
              [
                "c"
              ],
              [
                "witness c"
              ]
            ]
          }
        ],
        "img": "assets/images/b4_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "Evidence from the community centre lobby has been secured.",
        "questions": [
          {
            "q": "You have: CCTV footage (blurry), a witness receipt (dated yesterday), and a cleaning log (unsigned). Rank these by reliability.",
            "keywords": [
              [
                "receipt"
              ],
              [
                "cctv"
              ],
              [
                "log"
              ]
            ]
          },
          {
            "q": "The cleaning log shows the lobby was swept at 8:45, 9:00, and 9:30. What does the 9:00 entry suggest about Witness C's claim?",
            "keywords": [
              [
                "working"
              ],
              [
                "overlook"
              ],
              [
                "missed"
              ]
            ]
          },
          {
            "q": "A cause-and-effect chain: Envelope placed (9:00) \u2192 ? \u2192 Envelope gone (9:02). What is the most likely middle event?",
            "keywords": [
              [
                "took"
              ],
              [
                "moved"
              ],
              [
                "someone"
              ]
            ]
          },
          {
            "q": "Two pieces of evidence conflict: C's log says nothing unusual; E's testimony says the envelope was visible. How do you reconcile this?",
            "keywords": [
              [
                "notice"
              ],
              [
                "dishonest"
              ],
              [
                "mistaken"
              ],
              [
                "cctv"
              ]
            ]
          },
          {
            "q": "The envelope contained an invitation to a place that 'contains the knowledge of ages.' Based on investigation so far, where might this lead?",
            "keywords": [
              [
                "library"
              ],
              [
                "archive"
              ],
              [
                "museum"
              ]
            ]
          }
        ],
        "img": "assets/images/b4_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: Hospital, Library, Museum, Archive, University, Laboratory.",
        "destinations": [
          "Hospital",
          "Library",
          "Museum",
          "Archive",
          "University",
          "Laboratory"
        ],
        "questions": [
          {
            "q": "Clue: 'You don't need money to access what is kept here.' Eliminate destinations.",
            "keywords": [
              [
                "university",
                "laboratory"
              ]
            ],
            "eliminate": [
              "University",
              "Laboratory"
            ]
          },
          {
            "q": "Clue: 'Anyone of any age may enter and leave with knowledge.' Narrow the list.",
            "keywords": [
              [
                "library",
                "museum"
              ]
            ]
          },
          {
            "q": "Clue: 'You may take what is here, but you must return it.' Which destination fits precisely?",
            "keywords": [
              [
                "library"
              ]
            ],
            "eliminate": [
              "Museum"
            ]
          },
          {
            "q": "Clue: 'Every genre of human thought lives within these walls.' What specific feature is described?",
            "keywords": [
              [
                "book"
              ],
              [
                "collection"
              ],
              [
                "library"
              ]
            ]
          },
          {
            "q": "Final question: State the destination and provide a full justification using all four clues.",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b4_i3.jpg"
      }
    ]
  },
  {
    "id": 5,
    "grades": "Grade 9 & 10",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A government building. Five staff members give statements about a missing file.",
        "witnesses": [
          "Witness A (Security): \"The file room was locked from 6:00 PM. I have the only key.\"",
          "Witness B (Clerk): \"I saw the file in the room at 5:45 PM when I locked up.\"",
          "Witness C (Manager): \"I used the file room at 5:50 PM. Everything was in order.\"",
          "Witness D (Cleaner): \"I cleaned the file room at 5:55 PM. I saw a folder on the floor.\"",
          "Witness E (Colleague): \"The file was reported missing at 8:00 AM the next morning.\""
        ],
        "questions": [
          {
            "q": "What contradiction exists between Witness A and Witness C?",
            "keywords": [
              [
                "only key"
              ],
              [
                "key"
              ]
            ]
          },
          {
            "q": "Does Witness D's statement support or undermine the official narrative? Why?",
            "keywords": [
              [
                "undermine"
              ]
            ]
          },
          {
            "q": "Assess the credibility of Witness B given that C also visited at 5:50 PM.",
            "keywords": [
              [
                "before"
              ],
              [
                "left"
              ]
            ]
          },
          {
            "q": "What is the significance of the 5-minute gap between 5:55 PM (D's visit) and 6:00 PM (A locks up)?",
            "keywords": [
              [
                "disturb"
              ],
              [
                "remove"
              ],
              [
                "window"
              ]
            ]
          },
          {
            "q": "Construct a timeline of the most likely sequence of events, identifying where the file most probably went missing.",
            "keywords": [
              [
                "5:55",
                "6:00"
              ],
              [
                "555",
                "600"
              ]
            ]
          }
        ],
        "img": "assets/images/b5_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "Physical and documentary evidence from the building has been collected.",
        "questions": [
          {
            "q": "You have: an access log showing 4 entries, a CCTV recording with a corrupted 10-minute section, and a signed checkout form. Rank evidence by reliability and explain each.",
            "keywords": [
              [
                "form"
              ],
              [
                "log"
              ],
              [
                "cctv"
              ]
            ]
          },
          {
            "q": "The access log shows 5 entries but only 4 people gave statements. What does this imply?",
            "keywords": [
              [
                "fifth"
              ],
              [
                "unidentified"
              ],
              [
                "unaccounted"
              ]
            ]
          },
          {
            "q": "A cause-and-effect chain: File last confirmed (5:45) \u2192 Room disturbed (5:55) \u2192 Room locked (6:00) \u2192 File missing (8:00). At which point should the investigation focus?",
            "keywords": [
              [
                "5:55",
                "6:00"
              ],
              [
                "555",
                "600"
              ]
            ]
          },
          {
            "q": "Two witnesses contradict each other. One has a signed form; the other has a verbal account. Which do you prioritise and why?",
            "keywords": [
              [
                "form"
              ],
              [
                "document"
              ]
            ]
          },
          {
            "q": "The missing file was labelled: 'For the eyes of those who seek to understand.' What type of content does this suggest and where would it ultimately belong?",
            "keywords": [
              [
                "academic"
              ],
              [
                "scholarly"
              ],
              [
                "library"
              ],
              [
                "archive"
              ],
              [
                "research"
              ]
            ]
          }
        ],
        "img": "assets/images/b5_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: Government Archive, Hospital, Library, University Research Lab, Museum, International Office.",
        "destinations": [
          "Government Archive",
          "Hospital",
          "Library",
          "University Research Lab",
          "Museum",
          "International Office"
        ],
        "questions": [
          {
            "q": "Clue: 'The destination does not restrict access based on profession or status.' Eliminate destinations.",
            "keywords": [
              [
                "archive",
                "research",
                "office"
              ]
            ],
            "eliminate": [
              "Government Archive",
              "University Research Lab",
              "International Office"
            ]
          },
          {
            "q": "Clue: 'No transaction is required to access the knowledge stored here.' Eliminate remaining options.",
            "keywords": [
              [
                "museum"
              ]
            ],
            "eliminate": [
              "Museum"
            ]
          },
          {
            "q": "Clue: 'The destination is the oldest known system for sharing recorded human thought.' What does this describe?",
            "keywords": [
              [
                "library"
              ]
            ]
          },
          {
            "q": "Clue: 'You may temporarily possess what is stored here, but it must be returned for others to access.' Which destination fits perfectly and why?",
            "keywords": [
              [
                "library"
              ],
              [
                "lending"
              ],
              [
                "borrow"
              ]
            ]
          },
          {
            "q": "Final question: Provide a comprehensive case summary identifying the destination and justifying it using evidence from all three investigations.",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b5_i3.jpg"
      }
    ]
  },
  {
    "id": 6,
    "grades": "Grade 11 & 12",
    "investigations": [
      {
        "title": "Witness Statements",
        "scene": "A national institution. Six senior staff give statements about a classified report that has gone missing.",
        "witnesses": [
          "Witness A (Director): \"The report was filed correctly at end of day. I personally oversaw the process.\"",
          "Witness B (Deputy): \"The filing system showed an anomaly at 6:12 PM \u2014 an entry was made under an incorrect reference code.\"",
          "Witness C (Archivist): \"I filed the report at 6:05 PM under the correct code. I have no knowledge of a 6:12 entry.\"",
          "Witness D (IT Officer): \"The system log confirms a manual override was used at 6:12 PM from Terminal 4.\"",
          "Witness E (Security): \"Terminal 4 is located in a restricted zone. Only three staff have access: the Director, Deputy, and Archivist.\"",
          "Witness F (Intern): \"I was near Terminal 4 at around 6:10 PM and saw someone leaving quickly, though I couldn't identify them.\""
        ],
        "questions": [
          {
            "q": "Identify all logical inconsistencies across the six statements.",
            "keywords": [
              [
                "6:05",
                "6:12"
              ],
              [
                "605",
                "612"
              ]
            ]
          },
          {
            "q": "Assess the reliability of Witness A given their position and statement.",
            "keywords": [
              [
                "authority"
              ],
              [
                "reliab"
              ],
              [
                "contradict"
              ]
            ]
          },
          {
            "q": "Witness D provides system log data. What are the limitations of this as evidence? ",
            "keywords": [
              [
                "identity"
              ],
              [
                "credential"
              ],
              [
                "altered"
              ]
            ]
          },
          {
            "q": "Witness F is an intern with low institutional authority. Does this affect their credibility? Justify.",
            "keywords": [
              [
                "not necessarily"
              ],
              [
                "consistency"
              ],
              [
                "motive"
              ],
              [
                "corroborat"
              ]
            ]
          },
          {
            "q": "Construct a suspect profile for the most likely person responsible, using all six statements as evidence.",
            "keywords": [
              [
                "deputy"
              ],
              [
                "archivist"
              ],
              [
                "terminal 4"
              ]
            ]
          }
        ],
        "img": "assets/images/b6_i1.jpg"
      },
      {
        "title": "Evidence Analysis",
        "scene": "A full evidence board from the national institution has been compiled.",
        "questions": [
          {
            "q": "You have: a system log with a verified timestamp, a witness testimony with a possible bias, a security badge scan record, and an unsigned memo. Rank all four by evidentiary value and justify each.",
            "keywords": [
              [
                "log"
              ],
              [
                "badge"
              ],
              [
                "memo"
              ],
              [
                "testimony"
              ]
            ]
          },
          {
            "q": "The manual override at 6:12 PM was made from Terminal 4 using Archivist credentials. Does this prove the Archivist committed the act? Explain.",
            "keywords": [
              [
                "no"
              ],
              [
                "stolen"
              ],
              [
                "shared"
              ],
              [
                "circumstantial"
              ]
            ]
          },
          {
            "q": "Conflicting evidence: C's filing log says 6:05 (correct), D's system log says 6:12 (override). How do you determine which version of events is more accurate?",
            "keywords": [
              [
                "cross-reference"
              ],
              [
                "badge"
              ],
              [
                "cctv"
              ],
              [
                "harder to fabricate"
              ]
            ]
          },
          {
            "q": "A memo is found reading: 'The knowledge we protect must never be silenced. Return it to where all may access it.' What does this suggest about the motive and likely destination of the missing report?",
            "keywords": [
              [
                "public"
              ],
              [
                "accessible"
              ],
              [
                "library"
              ],
              [
                "archive"
              ]
            ]
          },
          {
            "q": "Synthesise the full evidence chain: system anomaly \u2192 restricted access \u2192 eyewitness \u2192 memo. What single conclusion best accounts for ALL available evidence?",
            "keywords": [
              [
                "authorised"
              ],
              [
                "authorized"
              ],
              [
                "access"
              ],
              [
                "library"
              ],
              [
                "public"
              ]
            ]
          }
        ],
        "img": "assets/images/b6_i2.jpg"
      },
      {
        "title": "Crack the Conclusion",
        "scene": "Possible destinations: National Archive, Government Vault, Library, Research Institute, Private Collection, International Repository.",
        "destinations": [
          "National Archive",
          "Government Vault",
          "Library",
          "Research Institute",
          "Private Collection",
          "International Repository"
        ],
        "questions": [
          {
            "q": "Clue: 'The destination operates on the principle that knowledge belongs to everyone, not to the few.' Eliminate destinations.",
            "keywords": [
              [
                "vault",
                "private",
                "international"
              ]
            ],
            "eliminate": [
              "Government Vault",
              "Private Collection",
              "International Repository"
            ]
          },
          {
            "q": "Clue: 'Access requires no credentials, no payment, and no institutional affiliation.' Narrow the list further.",
            "keywords": [
              [
                "library"
              ]
            ],
            "eliminate": [
              "National Archive",
              "Research Institute"
            ]
          },
          {
            "q": "Clue: 'The institution has existed in some form in nearly every civilisation in recorded history.' What does this indicate?",
            "keywords": [
              [
                "library"
              ],
              [
                "universal"
              ],
              [
                "oldest"
              ]
            ]
          },
          {
            "q": "Clue: 'The memo found in Investigation Two says: Return it to where all may access it.' Cross-reference this with the clues above. What is the destination?",
            "keywords": [
              [
                "library"
              ]
            ]
          },
          {
            "q": "Final question: Write a complete case summary \u2014 the destination, the motive, the suspect profile, and the role of the Library in the broader story of knowledge and access.",
            "keywords": [
              [
                "library"
              ]
            ],
            "final": true
          }
        ],
        "img": "assets/images/b6_i3.jpg"
      }
    ]
  }
];

const BRIEF_TEXT = "Every year, only the sharpest minds in the world receive an invitation. Not the loudest. Not the fastest. The sharpest. Three investigations stand between you and the destination. <strong>Interview witnesses. Analyse evidence. Reach a conclusion.</strong> Collect all three pieces of evidence, and you will know exactly where you are going. Your investigation begins now.";

// The single shared closing question, shown after a player's 3 investigations are complete.
// Worth +15 pts per the scoring doc (Section 5.1). This is where the point-wager mechanic applies.
const FINAL_MYSTERY = {
  intro: "You have interviewed witnesses. You have analysed evidence. You have reached your conclusion. These three pieces of evidence — a Book, a Bookshelf, and a Library Card — all point to one very special destination.",
  question: "Where have all the clues been leading you?",
  need: [["library"]],
  points: 15
};
