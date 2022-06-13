// OLD TEST FILE

var subjectUrl = localStorage.getItem('url')
console.log(subjectUrl)
title.innerText = subjectUrl;


// Add API retrieval code here
let posts = [
  {
    "link": subjectUrl,
    "receptivity": 0.9,
    "reactivity": 1,
    "datePosted": new Date('2022-02-03')

  },
  // title
  // link
  // score
  // date posted
  {
    "link": "a",
    "receptivity": 0.40,
    "reactivity": 0.7,
    "datePosted": new Date('2022-02-04')
  },
  {
    "link": "b",
    "receptivity": 0.78,
    "reactivity": 0.5,
    "datePosted": new Date('2022-02-05')
  },
  {
    "link": "c",
    "receptivity": 0.28,
    "reactivity": 0.4,
    "datePosted": new Date('2022-02-06')
  },
  {
    "link": "b",
    "receptivity": 0.78,
    "reactivity": 0.1,
    "datePosted": new Date('2022-02-05')
  },
  {
    "link": "c",
    "receptivity": 0.28,
    "reactivity": 0,
    "datePosted": new Date('2022-02-05')
  }
]
